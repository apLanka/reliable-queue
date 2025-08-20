import {
  QueueConfig,
  QueuedTask,
  TaskProcessor,
  QueueEvents,
  QueueStats,
  TaskStatus,
  AddTaskOptions,
} from './types';
import {
  generateId,
  calculateRetryDelay,
  sleep,
  isBrowser,
  safeJsonParse,
  safeJsonStringify,
} from './utils';

/**
 * Default queue configuration
 */
const DEFAULT_CONFIG: Required<QueueConfig> = {
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
  maxRetryDelay: 30000,
  concurrency: 1,
  persistent: false,
  storageKey: 'reliable-queue',
};

/**
 * A reliable queue system with retry logic, status tracking, and event subscriptions
 */
export class ReliableQueue<T = any> {
  private config: Required<QueueConfig>;
  private tasks: QueuedTask<T>[] = [];
  private processor?: TaskProcessor<T>;
  private isProcessing = false;
  private processingCount = 0;
  private subscribers = new Map<keyof QueueEvents<T>, Set<Function>>();

  constructor(config: QueueConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initializeSubscribers();
    
    if (this.config.persistent) {
      this.loadFromStorage();
    }
  }

  /**
   * Initialize event subscriber sets
   */
  private initializeSubscribers(): void {
    const events: (keyof QueueEvents<T>)[] = [
      'taskAdded',
      'taskStarted',
      'taskCompleted',
      'taskFailed',
      'taskRetried',
      'queueUpdated',
    ];

    events.forEach(event => {
      this.subscribers.set(event, new Set());
    });
  }

  /**
   * Set the task processor function
   */
  setProcessor(processor: TaskProcessor<T>): void {
    this.processor = processor;
  }

  /**
   * Add a task to the queue
   */
  add(data: T, options: AddTaskOptions = {}): string {
    const task: QueuedTask<T> = {
      id: options.id || generateId(),
      data,
      status: TaskStatus.PENDING,
      retryCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      priority: options.priority || 0,
      delay: options.delay,
      processAt: options.delay ? Date.now() + options.delay : undefined,
    };

    this.tasks.push(task);
    this.sortTasksByPriority();
    this.saveToStorage();
    this.emit('taskAdded', task);
    this.emit('queueUpdated', [...this.tasks]);
    
    // Start processing if not already running
    this.processQueue();
    
    return task.id;
  }

  /**
   * Remove a task from the queue
   */
  remove(taskId: string): boolean {
    const index = this.tasks.findIndex(task => task.id === taskId);
    if (index === -1) return false;

    const task = this.tasks[index];
    
    // Don't remove tasks that are currently processing
    if (task.status === TaskStatus.PROCESSING) {
      return false;
    }

    this.tasks.splice(index, 1);
    this.saveToStorage();
    this.emit('queueUpdated', [...this.tasks]);
    
    return true;
  }

  /**
   * Retry a failed task
   */
  retry(taskId: string): boolean {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || task.status !== TaskStatus.FAILED) {
      return false;
    }

    task.status = TaskStatus.PENDING;
    task.retryCount = 0;
    task.error = undefined;
    task.updatedAt = Date.now();
    
    this.sortTasksByPriority();
    this.saveToStorage();
    this.emit('taskRetried', task);
    this.emit('queueUpdated', [...this.tasks]);
    
    this.processQueue();
    
    return true;
  }

  /**
   * Retry all failed tasks
   */
  retryAll(): number {
    const failedTasks = this.tasks.filter(task => task.status === TaskStatus.FAILED);
    
    failedTasks.forEach(task => {
      task.status = TaskStatus.PENDING;
      task.retryCount = 0;
      task.error = undefined;
      task.updatedAt = Date.now();
      this.emit('taskRetried', task);
    });

    if (failedTasks.length > 0) {
      this.sortTasksByPriority();
      this.saveToStorage();
      this.emit('queueUpdated', [...this.tasks]);
      this.processQueue();
    }

    return failedTasks.length;
  }

  /**
   * Clear all completed tasks
   */
  clearCompleted(): number {
    const completedCount = this.tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    this.tasks = this.tasks.filter(task => task.status !== TaskStatus.COMPLETED);
    
    if (completedCount > 0) {
      this.saveToStorage();
      this.emit('queueUpdated', [...this.tasks]);
    }
    
    return completedCount;
  }

  /**
   * Clear all failed tasks
   */
  clearFailed(): number {
    const failedCount = this.tasks.filter(task => task.status === TaskStatus.FAILED).length;
    this.tasks = this.tasks.filter(task => task.status !== TaskStatus.FAILED);
    
    if (failedCount > 0) {
      this.saveToStorage();
      this.emit('queueUpdated', [...this.tasks]);
    }
    
    return failedCount;
  }

  /**
   * Clear all tasks
   */
  clear(): void {
    // Don't clear tasks that are currently processing
    this.tasks = this.tasks.filter(task => task.status === TaskStatus.PROCESSING);
    this.saveToStorage();
    this.emit('queueUpdated', [...this.tasks]);
  }

  /**
   * Get all tasks
   */
  getTasks(): QueuedTask<T>[] {
    return [...this.tasks];
  }

  /**
   * Get a specific task by ID
   */
  getTask(taskId: string): QueuedTask<T> | undefined {
    return this.tasks.find(task => task.id === taskId);
  }

  /**
   * Get queue statistics
   */
  getStats(): QueueStats {
    const stats = {
      total: this.tasks.length,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
    };

    this.tasks.forEach(task => {
      switch (task.status) {
        case TaskStatus.PENDING:
          stats.pending++;
          break;
        case TaskStatus.PROCESSING:
          stats.processing++;
          break;
        case TaskStatus.COMPLETED:
          stats.completed++;
          break;
        case TaskStatus.FAILED:
          stats.failed++;
          break;
      }
    });

    return stats;
  }

  /**
   * Subscribe to queue events
   */
  on<K extends keyof QueueEvents<T>>(event: K, callback: QueueEvents<T>[K]): () => void {
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      subscribers.add(callback);
    }

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(event);
      if (subscribers) {
        subscribers.delete(callback);
      }
    };
  }

  /**
   * Emit an event to all subscribers
   */
  private emit<K extends keyof QueueEvents<T>>(event: K, ...args: Parameters<QueueEvents<T>[K]>): void {
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          (callback as any)(...args);
        } catch (error) {
          console.error(`Error in queue event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Sort tasks by priority (higher priority first) and creation time
   */
  private sortTasksByPriority(): void {
    this.tasks.sort((a, b) => {
      // First sort by priority (higher first)
      if (a.priority !== b.priority) {
        return (b.priority || 0) - (a.priority || 0);
      }
      // Then by creation time (older first)
      return a.createdAt - b.createdAt;
    });
  }

  /**
   * Process the queue
   */
  private async processQueue(): Promise<void> {
    if (!this.processor) {
      return;
    }

    // Process tasks concurrently up to the limit
    while (this.processingCount < this.config.concurrency) {
      const task = this.getNextTask();
      if (!task) break;

      this.processTask(task);
    }
  }

  /**
   * Get the next task to process
   */
  private getNextTask(): QueuedTask<T> | undefined {
    const now = Date.now();
    
    return this.tasks.find(task => {
      if (task.status !== TaskStatus.PENDING) return false;
      if (task.processAt && task.processAt > now) return false;
      return true;
    });
  }

  /**
   * Process a single task
   */
  private async processTask(task: QueuedTask<T>): Promise<void> {
    if (!this.processor) return;

    this.processingCount++;
    task.status = TaskStatus.PROCESSING;
    task.updatedAt = Date.now();
    
    this.saveToStorage();
    this.emit('taskStarted', task);
    this.emit('queueUpdated', [...this.tasks]);

    try {
      await this.processor(task.data, task);
      
      task.status = TaskStatus.COMPLETED;
      task.updatedAt = Date.now();
      
      this.saveToStorage();
      this.emit('taskCompleted', task);
      this.emit('queueUpdated', [...this.tasks]);
      
    } catch (error) {
      await this.handleTaskError(task, error as Error);
    } finally {
      this.processingCount--;
      
      // Continue processing if there are more tasks
      setTimeout(() => this.processQueue(), 0);
    }
  }

  /**
   * Handle task processing errors
   */
  private async handleTaskError(task: QueuedTask<T>, error: Error): Promise<void> {
    task.retryCount++;
    task.error = error.message;
    task.updatedAt = Date.now();

    if (task.retryCount >= this.config.maxRetries) {
      task.status = TaskStatus.FAILED;
      this.saveToStorage();
      this.emit('taskFailed', task, error);
      this.emit('queueUpdated', [...this.tasks]);
      return;
    }

    // Schedule retry
    const retryDelay = calculateRetryDelay(
      task.retryCount,
      this.config.retryDelay,
      this.config.exponentialBackoff,
      this.config.maxRetryDelay
    );

    task.status = TaskStatus.PENDING;
    task.processAt = Date.now() + retryDelay;
    
    this.saveToStorage();
    this.emit('taskRetried', task);
    this.emit('queueUpdated', [...this.tasks]);

    // Schedule retry processing
    setTimeout(() => {
      this.processQueue();
    }, retryDelay);
  }

  /**
   * Save queue state to storage
   */
  private saveToStorage(): void {
    if (!this.config.persistent || !isBrowser()) return;

    try {
      const data = safeJsonStringify(this.tasks);
      localStorage.setItem(this.config.storageKey, data);
    } catch (error) {
      console.error('Failed to save queue to storage:', error);
    }
  }

  /**
   * Load queue state from storage
   */
  private loadFromStorage(): void {
    if (!this.config.persistent || !isBrowser()) return;

    try {
      const data = localStorage.getItem(this.config.storageKey);
      if (data) {
        const tasks = safeJsonParse<QueuedTask<T>[]>(data);
        if (Array.isArray(tasks)) {
          // Reset processing tasks to pending on load
          this.tasks = tasks.map(task => ({
            ...task,
            status: task.status === TaskStatus.PROCESSING ? TaskStatus.PENDING : task.status,
          }));
          this.sortTasksByPriority();
        }
      }
    } catch (error) {
      console.error('Failed to load queue from storage:', error);
    }
  }
}
