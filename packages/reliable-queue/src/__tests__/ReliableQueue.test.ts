import { ReliableQueue, TaskStatus } from '../index';

describe('ReliableQueue', () => {
  let queue: ReliableQueue<{ message: string }>;

  beforeEach(() => {
    queue = new ReliableQueue({
      maxRetries: 2,
      retryDelay: 100,
      exponentialBackoff: false,
    });
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  it('should create a queue with default config', () => {
    const defaultQueue = new ReliableQueue();
    expect(defaultQueue).toBeDefined();
  });

  it('should add tasks to the queue', () => {
    const taskId = queue.add({ message: 'test' });
    
    expect(taskId).toBeDefined();
    expect(typeof taskId).toBe('string');
    
    const tasks = queue.getTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].data.message).toBe('test');
    expect(tasks[0].status).toBe(TaskStatus.PENDING);
  });

  it('should process tasks successfully', async () => {
    const mockProcessor = jest.fn().mockResolvedValue(undefined);
    queue.setProcessor(mockProcessor);

    const taskId = queue.add({ message: 'test' });
    
    // Fast-forward all timers and wait for all promises
    await jest.runAllTimersAsync();
    
    expect(mockProcessor).toHaveBeenCalledWith(
      { message: 'test' },
      expect.objectContaining({
        id: taskId,
      })
    );
    
    // Verify task is completed after processing
    const tasks = queue.getTasks();
    expect(tasks[0].status).toBe(TaskStatus.COMPLETED);
  });

  it('should retry failed tasks', async () => {
    let callCount = 0;
    const mockProcessor = jest.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        throw new Error('First attempt failed');
      }
      return Promise.resolve();
    });

    queue.setProcessor(mockProcessor);
    queue.add({ message: 'test' });

    // Fast-forward all timers and wait for all promises  
    await jest.runAllTimersAsync();

    expect(mockProcessor).toHaveBeenCalledTimes(2);
  });

  it('should mark tasks as failed after max retries', async () => {
    const mockProcessor = jest.fn().mockRejectedValue(new Error('Always fails'));
    queue.setProcessor(mockProcessor);

    queue.add({ message: 'test' });

    // Fast-forward all timers and wait for all promises
    await jest.runAllTimersAsync();

    const tasks = queue.getTasks();
    expect(tasks[0].status).toBe(TaskStatus.FAILED);
    expect(tasks[0].retryCount).toBe(2); // maxRetries
    expect(tasks[0].error).toBe('Always fails');
  });

  it('should handle task priority correctly', () => {
    queue.add({ message: 'low' }, { priority: 1 });
    queue.add({ message: 'high' }, { priority: 10 });
    queue.add({ message: 'medium' }, { priority: 5 });

    const tasks = queue.getTasks();
    expect(tasks[0].data.message).toBe('high');
    expect(tasks[1].data.message).toBe('medium');
    expect(tasks[2].data.message).toBe('low');
  });

  it('should emit events correctly', () => {
    const taskAddedSpy = jest.fn();
    const queueUpdatedSpy = jest.fn();

    queue.on('taskAdded', taskAddedSpy);
    queue.on('queueUpdated', queueUpdatedSpy);

    queue.add({ message: 'test' });

    expect(taskAddedSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { message: 'test' },
        status: TaskStatus.PENDING,
      })
    );
    expect(queueUpdatedSpy).toHaveBeenCalled();
  });

  it('should remove tasks correctly', () => {
    const taskId = queue.add({ message: 'test' });
    
    expect(queue.getTasks()).toHaveLength(1);
    
    const removed = queue.remove(taskId);
    expect(removed).toBe(true);
    expect(queue.getTasks()).toHaveLength(0);
  });

  it('should retry failed tasks manually', () => {
    // Add a task and manually set it as failed
    const taskId = queue.add({ message: 'test' });
    const tasks = queue.getTasks();
    tasks[0].status = TaskStatus.FAILED;
    tasks[0].error = 'Manual failure';

    const retried = queue.retry(taskId);
    expect(retried).toBe(true);

    const updatedTask = queue.getTask(taskId);
    expect(updatedTask?.status).toBe(TaskStatus.PENDING);
    expect(updatedTask?.error).toBeUndefined();
    expect(updatedTask?.retryCount).toBe(0);
  });

  it('should get queue statistics correctly', () => {
    queue.add({ message: 'pending1' });
    queue.add({ message: 'pending2' });
    
    // Manually set one as completed and one as failed for testing
    const tasks = queue.getTasks();
    tasks[0].status = TaskStatus.COMPLETED;
    tasks[1].status = TaskStatus.FAILED;

    const stats = queue.getStats();
    expect(stats.total).toBe(2);
    expect(stats.pending).toBe(0);
    expect(stats.completed).toBe(1);
    expect(stats.failed).toBe(1);
  });

  it('should clear completed tasks', () => {
    queue.add({ message: 'test1' });
    queue.add({ message: 'test2' });
    
    // Manually set one as completed
    const tasks = queue.getTasks();
    tasks[0].status = TaskStatus.COMPLETED;

    const cleared = queue.clearCompleted();
    expect(cleared).toBe(1);
    expect(queue.getTasks()).toHaveLength(1);
  });

  it('should clear failed tasks', () => {
    queue.add({ message: 'test1' });
    queue.add({ message: 'test2' });
    
    // Manually set one as failed
    const tasks = queue.getTasks();
    tasks[0].status = TaskStatus.FAILED;

    const cleared = queue.clearFailed();
    expect(cleared).toBe(1);
    expect(queue.getTasks()).toHaveLength(1);
  });
});
