'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trash2, Plus, AlertCircle, Clock, CheckCircle, XCircle, Loader2, Activity } from 'lucide-react';

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
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'processing': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-mesh opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12 animate-fadeInUp">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 mb-6">
              <Activity className="h-4 w-4 mr-2" />
              Live Demo
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl text-balance">
              Interactive
              <span className="gradient-text"> Queue</span> Demo
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto text-pretty">
              Experience Reliable Queue in action. Add tasks, watch them process, and see how retry logic works in real-time.
            </p>
          </div>

          {/* Controls */}
          <div className="relative group mb-8 animate-slideInRight" style={{ animationDelay: '200ms' }}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-white rounded-xl p-8 shadow-xl border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                {/* Queue Controls */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsProcessing(!isProcessing)}
                    className={`group relative flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isProcessing
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl btn-glow'
                        : 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:shadow-xl btn-glow'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Pause className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        <span>Stop Queue</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                        <span>Start Queue</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={clearTasks}
                    className="group flex items-center space-x-2 px-5 py-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Clear All</span>
                  </button>
                </div>

                {/* Add Task Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 mr-2">Add Tasks:</span>
                  <button
                    onClick={() => addTask('success')}
                    className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 text-sm font-medium border border-green-200 hover:border-green-300 transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Success</span>
                  </button>
                  <button
                    onClick={() => addTask('failure')}
                    className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-sm font-medium border border-red-200 hover:border-red-300 transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Failure</span>
                  </button>
                  <button
                    onClick={() => addTask('slow')}
                    className="group flex items-center space-x-2 px-4 py-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 hover:text-yellow-800 text-sm font-medium border border-yellow-200 hover:border-yellow-300 transition-all duration-300"
                  >
                    <Plus className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    <span>Slow</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 mb-8 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
            {[
              { label: 'Total', value: stats.total, color: 'gray', icon: Activity, bg: 'bg-white', text: 'text-gray-900', border: 'border-gray-200' },
              { label: 'Pending', value: stats.pending, color: 'gray', icon: Clock, bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
              { label: 'Processing', value: stats.processing, color: 'blue', icon: Loader2, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
              { label: 'Completed', value: stats.completed, color: 'green', icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
              { label: 'Failed', value: stats.failed, color: 'red', icon: XCircle, bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className={`group ${stat.bg} rounded-xl border ${stat.border} p-6 text-center transition-all duration-300 hover:shadow-lg card-hover animate-fadeInUp`}
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="flex items-center justify-center mb-3">
                  <stat.icon className={`h-6 w-6 ${stat.text} ${stat.label === 'Processing' && stats.processing > 0 ? 'animate-spin' : ''} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <div className={`text-3xl font-bold ${stat.text} group-hover:scale-105 transition-transform duration-300`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-medium ${stat.text} opacity-75`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Configuration Info */}
          <div className="relative group mb-8 animate-slideInRight" style={{ animationDelay: '600ms' }}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 shadow-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 border border-blue-200">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-blue-900 mb-3">Demo Configuration</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white/60 rounded-lg p-3 border border-blue-200/50">
                      <div className="text-sm font-medium text-blue-700">Max Retries</div>
                      <div className="text-lg font-bold text-blue-900">{maxRetries}</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 border border-blue-200/50">
                      <div className="text-sm font-medium text-blue-700">Retry Delay</div>
                      <div className="text-lg font-bold text-blue-900">{retryDelay}ms</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-3 border border-blue-200/50">
                      <div className="text-sm font-medium text-blue-700">Concurrency</div>
                      <div className="text-lg font-bold text-blue-900">{concurrency}</div>
                    </div>
                  </div>
                  <div className="text-sm text-blue-700 leading-relaxed">
                    <strong>Success tasks</strong> complete normally • <strong>Failure tasks</strong> fail and retry automatically • <strong>Slow tasks</strong> take 3 seconds to process
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="relative group animate-fadeInUp" style={{ animationDelay: '800ms' }}>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white rounded-xl overflow-hidden shadow-xl border border-gray-200">
              <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-600" />
                    Task Queue
                  </h3>
                  <div className="text-sm text-gray-500">
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                  </div>
                </div>
              </div>
              
              {tasks.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Activity className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No tasks in queue</h4>
                  <p className="text-gray-500">Add some tasks to get started and see the queue in action!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {tasks.map((task, index) => (
                    <div 
                      key={task.id} 
                      className="group p-6 hover:bg-gray-50 transition-all duration-300 animate-slideInRight"
                      style={{ animationDelay: `${800 + index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="flex items-center">
                              {getStatusIcon(task.status)}
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                            <span className="text-base font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                              {task.data.message}
                            </span>
                            {task.retryCount > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                Retry {task.retryCount}/{maxRetries}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              ID: {task.id.split('-').slice(-1)[0]}
                            </span>
                            {task.processingTime && (
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {task.processingTime}ms
                              </span>
                            )}
                            <span className="flex items-center">
                              <Activity className="h-3 w-3 mr-1" />
                              {new Date(task.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                          
                          {task.error && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center">
                                <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                <span className="text-sm text-red-700 font-medium">Error:</span>
                              </div>
                              <p className="text-sm text-red-600 mt-1">{task.error}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {task.status === 'failed' && task.retryCount < maxRetries && (
                            <button
                              onClick={() => retryTask(task.id)}
                              className="group/btn flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-800 text-sm font-medium border border-blue-200 hover:border-blue-300 transition-all duration-300"
                            >
                              <RotateCcw className="h-4 w-4 group-hover/btn:rotate-180 transition-transform duration-300" />
                              <span>Retry</span>
                            </button>
                          )}
                          
                          {task.status !== 'processing' && (
                            <button
                              onClick={() => removeTask(task.id)}
                              className="group/btn flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 text-sm font-medium border border-red-200 hover:border-red-300 transition-all duration-300"
                            >
                              <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
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
    </div>
  );
}