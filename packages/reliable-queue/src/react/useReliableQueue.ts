import { useEffect, useState, useCallback, useRef } from 'react';
import { ReliableQueue } from '../ReliableQueue';
import { QueueManager } from '../QueueManager';
import {
  QueuedTask,
  TaskProcessor,
  QueueConfig,
  QueueStats,
  AddTaskOptions,
} from '../types';

/**
 * Options for the useReliableQueue hook
 */
export interface UseReliableQueueOptions<T = any> extends QueueConfig {
  /** Name of the queue (for named/shared queues) */
  queueName?: string;
  /** Task processor function */
  processor?: TaskProcessor<T>;
  /** Whether to use a singleton queue manager */
  useSingleton?: boolean;
}

/**
 * Return type for the useReliableQueue hook
 */
export interface UseReliableQueueReturn<T = any> {
  /** All tasks in the queue */
  tasks: QueuedTask<T>[];
  /** Queue statistics */
  stats: QueueStats;
  /** Add a task to the queue */
  addTask: (data: T, options?: AddTaskOptions) => string;
  /** Remove a task from the queue */
  removeTask: (taskId: string) => boolean;
  /** Retry a failed task */
  retryTask: (taskId: string) => boolean;
  /** Retry all failed tasks */
  retryAllTasks: () => number;
  /** Clear all completed tasks */
  clearCompleted: () => number;
  /** Clear all failed tasks */
  clearFailed: () => number;
  /** Clear all tasks */
  clearAll: () => void;
  /** Get a specific task by ID */
  getTask: (taskId: string) => QueuedTask<T> | undefined;
  /** Set or update the task processor */
  setProcessor: (processor: TaskProcessor<T>) => void;
  /** The queue instance */
  queue: ReliableQueue<T>;
}

/**
 * React hook for using ReliableQueue
 */
export function useReliableQueue<T = any>(
  options: UseReliableQueueOptions<T> = {}
): UseReliableQueueReturn<T> {
  const {
    queueName,
    processor,
    useSingleton = true,
    ...queueConfig
  } = options;

  // Create or get queue instance
  const queueRef = useRef<ReliableQueue<T>>();
  if (!queueRef.current) {
    if (useSingleton && queueName) {
      queueRef.current = QueueManager.getInstance().createQueue<T>(queueName, queueConfig);
    } else {
      queueRef.current = new ReliableQueue<T>(queueConfig);
    }
  }

  const queue = queueRef.current;

  // State for tasks and stats
  const [tasks, setTasks] = useState<QueuedTask<T>[]>(() => queue.getTasks());
  const [stats, setStats] = useState<QueueStats>(() => queue.getStats());

  // Set processor if provided
  useEffect(() => {
    if (processor) {
      queue.setProcessor(processor);
    }
  }, [queue, processor]);

  // Subscribe to queue updates
  useEffect(() => {
    const unsubscribe = queue.on('queueUpdated', (updatedTasks: QueuedTask<T>[]) => {
      setTasks(updatedTasks);
      setStats(queue.getStats());
    });

    return unsubscribe;
  }, [queue]);

  // Memoized functions
  const addTask = useCallback(
    (data: T, options?: AddTaskOptions): string => {
      return queue.add(data, options);
    },
    [queue]
  );

  const removeTask = useCallback(
    (taskId: string): boolean => {
      return queue.remove(taskId);
    },
    [queue]
  );

  const retryTask = useCallback(
    (taskId: string): boolean => {
      return queue.retry(taskId);
    },
    [queue]
  );

  const retryAllTasks = useCallback((): number => {
    return queue.retryAll();
  }, [queue]);

  const clearCompleted = useCallback((): number => {
    return queue.clearCompleted();
  }, [queue]);

  const clearFailed = useCallback((): number => {
    return queue.clearFailed();
  }, [queue]);

  const clearAll = useCallback((): void => {
    queue.clear();
  }, [queue]);

  const getTask = useCallback(
    (taskId: string): QueuedTask<T> | undefined => {
      return queue.getTask(taskId);
    },
    [queue]
  );

  const setProcessor = useCallback(
    (newProcessor: TaskProcessor<T>): void => {
      queue.setProcessor(newProcessor);
    },
    [queue]
  );

  return {
    tasks,
    stats,
    addTask,
    removeTask,
    retryTask,
    retryAllTasks,
    clearCompleted,
    clearFailed,
    clearAll,
    getTask,
    setProcessor,
    queue,
  };
}
