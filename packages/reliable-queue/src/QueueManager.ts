import { ReliableQueue } from './ReliableQueue';
import { QueueConfig } from './types';

/**
 * Singleton queue manager for global queue instances
 */
export class QueueManager {
  private static instance: QueueManager;
  private queues = new Map<string, ReliableQueue<any>>();

  private constructor() {}

  /**
   * Get the singleton instance
   */
  static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  /**
   * Create or get a named queue
   */
  createQueue<T = any>(name: string, config?: QueueConfig): ReliableQueue<T> {
    if (this.queues.has(name)) {
      return this.queues.get(name) as ReliableQueue<T>;
    }

    const queue = new ReliableQueue<T>({
      ...config,
      storageKey: config?.storageKey || `reliable-queue-${name}`,
    });

    this.queues.set(name, queue);
    return queue;
  }

  /**
   * Get an existing queue by name
   */
  getQueue<T = any>(name: string): ReliableQueue<T> | undefined {
    return this.queues.get(name) as ReliableQueue<T> | undefined;
  }

  /**
   * Remove a queue
   */
  removeQueue(name: string): boolean {
    return this.queues.delete(name);
  }

  /**
   * Get all queue names
   */
  getQueueNames(): string[] {
    return Array.from(this.queues.keys());
  }

  /**
   * Clear all queues
   */
  clearAll(): void {
    this.queues.forEach(queue => queue.clear());
  }

  /**
   * Destroy all queues
   */
  destroyAll(): void {
    this.queues.clear();
  }
}
