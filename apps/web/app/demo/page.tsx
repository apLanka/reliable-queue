'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trash2, Plus, AlertCircle } from 'lucide-react';

// Demo queue implementation (simplified for browser demo)
interface DemoTask {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data: {
    type: string;
    message: string;
  };
  retryCount: number;
  error?: string;
  createdAt: number;
  processingTime?: number;
}

interface QueueStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export default function DemoPage() {
  const [tasks, setTasks] = useState<DemoTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [maxRetries] = useState(3);
  const [retryDelay] = useState(1000);
  const [concurrency] = useState(2);

  // Calculate stats
  const stats: QueueStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    processing: tasks.filter(t => t.status === 'processing').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
  };

  // Add demo tasks
  const addTask = (type: 'success' | 'failure' | 'slow') => {
    const task: DemoTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      data: { type, message: `Demo ${type} task` },
      retryCount: 0,
      createdAt: Date.now(),
    };
    setTasks(prev => [...prev, task]);
  };

  // Process a single task
  const processTask = useCallback(async (task: DemoTask): Promise<void> => {
    // Update status to processing
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, status: 'processing' as const } : t
    ));

    // Simulate processing time
    const processingTime = task.data.type === 'slow' ? 3000 : 1000;
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Simulate success/failure
    const shouldFail = task.data.type === 'failure' && task.retryCount < maxRetries;
    
    if (shouldFail && Math.random() < 0.7) {
      // Task failed
      setTasks(prev => prev.map(t => 
        t.id === task.id ? { 
          ...t, 
          status: 'failed' as const,
          error: `Processing failed (attempt ${task.retryCount + 1})`,
          processingTime 
        } : t
      ));
    } else {
      // Task succeeded
      setTasks(prev => prev.map(t => 
        t.id === task.id ? { 
          ...t, 
          status: 'completed' as const,
          processingTime 
        } : t
      ));
    }
  }, [maxRetries]);

  // Retry a failed task
  const retryTask = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { 
        ...t, 
        status: 'pending' as const,
        retryCount: t.retryCount + 1,
        error: undefined 
      } : t
    ));
  };

  // Clear all tasks
  const clearTasks = () => {
    setTasks([]);
  };

  // Remove a task
  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Queue processor
  useEffect(() => {
    if (!isProcessing) return;

    const processingTasks = tasks.filter(t => t.status === 'processing').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    
    if (processingTasks < concurrency && pendingTasks.length > 0) {
      const nextTask = pendingTasks[0];
      void processTask(nextTask);
    }
  }, [tasks, isProcessing, concurrency, processTask]);

  // Auto-retry failed tasks
  useEffect(() => {
    if (!isProcessing) return;

    const retryTimer = setTimeout(() => {
      const failedTasks = tasks.filter(t => t.status === 'failed' && t.retryCount < maxRetries);
      if (failedTasks.length > 0) {
        const taskToRetry = failedTasks[0];
        retryTask(taskToRetry.id);
      }
    }, retryDelay);

    return () => clearTimeout(retryTimer);
  }, [tasks, isProcessing, retryDelay, maxRetries]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Interactive Demo
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experience Reliable Queue in action. Add tasks, watch them process, and see how retry logic works.
            </p>
          </div>

          {/* Controls */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsProcessing(!isProcessing)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium ${
                    isProcessing
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>Stop Queue</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Start Queue</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={clearTasks}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-medium"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => addTask('success')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Success Task</span>
                </button>
                <button
                  onClick={() => addTask('failure')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Failure Task</span>
                </button>
                <button
                  onClick={() => addTask('slow')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium"
                >
                  <Plus className="h-4 w-4" />
                  <span>Slow Task</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
              <div className="text-sm text-blue-600">Processing</div>
            </div>
            <div className="bg-green-50 rounded-lg border border-green-200 p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            <div className="bg-red-50 rounded-lg border border-red-200 p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
          </div>

          {/* Configuration Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Demo Configuration</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Max Retries: {maxRetries} • Retry Delay: {retryDelay}ms • Concurrency: {concurrency}
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Success tasks complete normally, Failure tasks fail and retry automatically, Slow tasks take 3 seconds to process.
                </p>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Task Queue</h3>
            </div>
            
            {tasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No tasks in queue. Add some tasks to get started!
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <div key={task.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {task.data.message}
                          </span>
                          {task.retryCount > 0 && (
                            <span className="text-xs text-gray-500">
                              (Retry {task.retryCount}/{maxRetries})
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-2 text-sm text-gray-500">
                          <span>ID: {task.id}</span>
                          {task.processingTime && (
                            <span className="ml-4">
                              Processed in: {task.processingTime}ms
                            </span>
                          )}
                        </div>
                        
                        {task.error && (
                          <div className="mt-2 text-sm text-red-600">
                            Error: {task.error}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {task.status === 'failed' && task.retryCount < maxRetries && (
                          <button
                            onClick={() => retryTask(task.id)}
                            className="flex items-center space-x-1 px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Retry</span>
                          </button>
                        )}
                        
                        {task.status !== 'processing' && (
                          <button
                            onClick={() => removeTask(task.id)}
                            className="flex items-center space-x-1 px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}