import React, { useState } from 'react';
import { useReliableQueue } from '../src/react';

// Example: React Data Processing Queue Component
interface ProcessingTask {
  id: string;
  type: 'email' | 'report' | 'export' | 'analysis';
  data: string;
  priority?: number;
}

export function DataProcessingQueueExample() {
  const [taskType, setTaskType] = useState<ProcessingTask['type']>('email');
  const [taskData, setTaskData] = useState('');

  const {
    tasks,
    stats,
    addTask,
    retryTask,
    removeTask,
    clearFailed,
    retryAllTasks,
  } = useReliableQueue<ProcessingTask>({
    queueName: 'data-processing',
    maxRetries: 3,
    retryDelay: 1000,
    exponentialBackoff: true,
    persistent: true,
    concurrency: 2, // Process 2 tasks concurrently
    processor: async (data) => {
      console.log('Processing task:', data.type, data.id);
      
      // Simulate different processing times based on task type
      const processingTime = {
        email: 500,
        report: 2000,
        export: 1500,
        analysis: 3000,
      }[data.type];

      // Simulate API call that might fail
      if (Math.random() < 0.2) {
        throw new Error(`${data.type} processing failed`);
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      console.log(`${data.type} task completed:`, data.id);
    },
  });

  const handleAddTask = () => {
    if (!taskData.trim()) return;

    const taskId = `${taskType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    addTask({
      id: taskId,
      type: taskType,
      data: taskData.trim(),
      priority: taskType === 'email' ? 10 : taskType === 'report' ? 5 : 1,
    });

    setTaskData('');
  };

  const handleAddBulkTasks = () => {
    const types: ProcessingTask['type'][] = ['email', 'report', 'export', 'analysis'];
    
    types.forEach((type, index) => {
      const taskId = `${type}-bulk-${Date.now()}-${index}`;
      addTask({
        id: taskId,
        type,
        data: `Bulk ${type} processing task`,
        priority: type === 'email' ? 10 : 1,
      });
    });
  };

  const getTaskTypeColor = (type: ProcessingTask['type']) => {
    switch (type) {
      case 'email': return '#007bff';
      case 'report': return '#28a745';
      case 'export': return '#ffc107';
      case 'analysis': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Reliable Queue - Data Processing Example</h2>
      
      {/* Queue Statistics */}
      <div style={{ 
        background: '#f5f5f5', 
        padding: '10px', 
        marginBottom: '20px',
        borderRadius: '5px'
      }}>
        <h3>Queue Statistics</h3>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Total: <strong>{stats.total}</strong></span>
          <span>Pending: <strong>{stats.pending}</strong></span>
          <span>Processing: <strong>{stats.processing}</strong></span>
          <span>Completed: <strong>{stats.completed}</strong></span>
          <span>Failed: <strong>{stats.failed}</strong></span>
        </div>
      </div>

      {/* Task Input */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Task Type: 
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value as ProcessingTask['type'])}
              style={{ marginLeft: '10px', padding: '5px' }}
            >
              <option value="email">Email Processing</option>
              <option value="report">Report Generation</option>
              <option value="export">Data Export</option>
              <option value="analysis">Data Analysis</option>
            </select>
          </label>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={taskData}
            onChange={(e) => setTaskData(e.target.value)}
            placeholder={`Enter ${taskType} task data...`}
            style={{ flex: 1, padding: '10px' }}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button 
            onClick={handleAddTask}
            style={{ 
              padding: '10px 20px',
              backgroundColor: getTaskTypeColor(taskType),
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Add {taskType} Task
          </button>
          <button 
            onClick={handleAddBulkTasks}
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Add Bulk Tasks
          </button>
        </div>
      </div>

      {/* Queue Actions */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => retryAllTasks()}
          disabled={stats.failed === 0}
          style={{ marginRight: '10px', padding: '8px 16px' }}
        >
          Retry All Failed ({stats.failed})
        </button>
        <button 
          onClick={() => clearFailed()}
          disabled={stats.failed === 0}
          style={{ padding: '8px 16px' }}
        >
          Clear Failed Tasks
        </button>
      </div>

      {/* Task List */}
      <div>
        <h3>Processing Queue</h3>
        {tasks.length === 0 ? (
          <p style={{ color: '#666' }}>No tasks in queue</p>
        ) : (
          <div>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  padding: '10px',
                  marginBottom: '10px',
                  background: task.status === 'failed' ? '#ffe6e6' : 
                             task.status === 'completed' ? '#e6ffe6' :
                             task.status === 'processing' ? '#fff3e6' : '#f9f9f9'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: 'white',
                        background: getTaskTypeColor(task.data.type)
                      }}>
                        {task.data.type.toUpperCase()}
                      </span>
                      {task.data.priority && task.data.priority > 5 && (
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '3px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          color: 'white',
                          background: '#ff6b35'
                        }}>
                          HIGH PRIORITY
                        </span>
                      )}
                    </div>
                    <strong>{task.data.data}</strong>
                    <br />
                    <small style={{ color: '#666' }}>
                      ID: {task.id}
                    </small>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '3px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'white',
                      background: task.status === 'failed' ? '#dc3545' :
                                 task.status === 'completed' ? '#28a745' :
                                 task.status === 'processing' ? '#fd7e14' : '#6c757d'
                    }}>
                      {task.status.toUpperCase()}
                    </span>
                    
                    {task.retryCount > 0 && (
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        Retries: {task.retryCount}
                      </span>
                    )}
                    
                    {task.error && (
                      <span style={{ fontSize: '12px', color: '#dc3545' }}>
                        Error: {task.error}
                      </span>
                    )}
                    
                    <div>
                      {task.status === 'failed' && (
                        <button
                          onClick={() => retryTask(task.id)}
                          style={{ 
                            padding: '4px 8px', 
                            fontSize: '12px',
                            marginRight: '5px'
                          }}
                        >
                          Retry
                        </button>
                      )}
                      
                      {task.status !== 'processing' && (
                        <button
                          onClick={() => removeTask(task.id)}
                          style={{ 
                            padding: '4px 8px', 
                            fontSize: '12px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '3px'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DataProcessingQueueExample;