/**
 * Status of a queued task
 */
export enum TaskStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Configuration options for the queue
 */
export interface QueueConfig {
  /** Maximum number of retry attempts for failed tasks */
  maxRetries?: number;
  /** Base delay in milliseconds before retrying a failed task */
  retryDelay?: number;
  /** Whether to use exponential backoff for retry delays */
  exponentialBackoff?: boolean;
  /** Maximum delay in milliseconds for exponential backoff */
  maxRetryDelay?: number;
  /** Maximum number of concurrent tasks being processed */
  concurrency?: number;
  /** Whether to persist queue state (useful for browser storage) */
  persistent?: boolean;
  /** Storage key for persistent queues */
  storageKey?: string;
}

/**
 * A queued task with metadata
 */
export interface QueuedTask<T = any> {
  /** Unique identifier for the task */
  id: string;
  /** The task data/payload */
  data: T;
  /** Current status of the task */
  status: TaskStatus;
  /** Number of retry attempts made */
  retryCount: number;
  /** Timestamp when the task was created */
  createdAt: number;
  /** Timestamp when the task was last updated */
  updatedAt: number;
  /** Error message if the task failed */
  error?: string;
  /** Priority of the task (higher number = higher priority) */
  priority?: number;
  /** Delay in milliseconds before processing this task */
  delay?: number;
  /** Timestamp when the task should be processed (for delayed tasks) */
  processAt?: number;
}

/**
 * Task processor function type
 */
export type TaskProcessor<T = any> = (data: T, task: QueuedTask<T>) => Promise<void>;

/**
 * Queue event types
 */
export interface QueueEvents<T = any> {
  /** Fired when a task is added to the queue */
  taskAdded: (task: QueuedTask<T>) => void;
  /** Fired when a task starts processing */
  taskStarted: (task: QueuedTask<T>) => void;
  /** Fired when a task completes successfully */
  taskCompleted: (task: QueuedTask<T>) => void;
  /** Fired when a task fails */
  taskFailed: (task: QueuedTask<T>, error: Error) => void;
  /** Fired when a task is retried */
  taskRetried: (task: QueuedTask<T>) => void;
  /** Fired when the queue state changes */
  queueUpdated: (tasks: QueuedTask<T>[]) => void;
}

/**
 * Queue statistics
 */
export interface QueueStats {
  /** Total number of tasks in the queue */
  total: number;
  /** Number of pending tasks */
  pending: number;
  /** Number of tasks currently being processed */
  processing: number;
  /** Number of completed tasks */
  completed: number;
  /** Number of failed tasks */
  failed: number;
}

/**
 * Options for adding a task to the queue
 */
export interface AddTaskOptions {
  /** Priority of the task (higher number = higher priority) */
  priority?: number;
  /** Delay in milliseconds before processing this task */
  delay?: number;
  /** Custom ID for the task (if not provided, one will be generated) */
  id?: string;
}
