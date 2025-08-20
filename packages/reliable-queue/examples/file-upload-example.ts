import { ReliableQueue, TaskStatus } from '../src';

// Example: File Upload Queue System
interface FileUploadData {
  id: string;
  fileName: string;
  fileSize: number;
  uploadUrl: string;
  metadata?: {
    userId: string;
    folder: string;
    tags?: string[];
  };
}

// Create a file upload queue
const uploadQueue = new ReliableQueue<FileUploadData>({
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
  persistent: true,
  storageKey: 'file-upload-queue',
  concurrency: 2, // Upload 2 files concurrently
});

// Set up the processor for file uploads
uploadQueue.setProcessor(async (data) => {
  console.log('Uploading file:', data.fileName);
  
  // Simulate file upload API call
  const formData = new FormData();
  formData.append('fileName', data.fileName);
  formData.append('fileSize', data.fileSize.toString());
  
  if (data.metadata) {
    formData.append('metadata', JSON.stringify(data.metadata));
  }

  const response = await fetch(data.uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  console.log('File uploaded successfully:', data.fileName);
});

// Set up event handlers
uploadQueue.on('taskCompleted', (task) => {
  console.log('✅ File uploaded:', task.data.fileName);
});

uploadQueue.on('taskFailed', (task, error) => {
  console.error('❌ Upload failed:', task.data.fileName, error.message);
});

uploadQueue.on('taskRetried', (task) => {
  console.log('🔄 Retrying upload:', task.data.fileName, `(attempt ${task.retryCount})`);
});

// Usage functions
export function addFileUpload(fileData: Omit<FileUploadData, 'id'>) {
  const id = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return uploadQueue.add({ ...fileData, id });
}

export function retryFailedUpload(uploadId: string) {
  return uploadQueue.retry(uploadId);
}

export function removeUpload(uploadId: string) {
  return uploadQueue.remove(uploadId);
}

export function getUploadQueueStatus() {
  return uploadQueue.getStats();
}

export function clearFailedUploads() {
  return uploadQueue.clearFailed();
}

export function retryAllFailedUploads() {
  return uploadQueue.retryAll();
}

export function getUploadQueue() {
  return uploadQueue.getTasks();
}

// Example usage
if (require.main === module) {
  // Add some test file uploads
  addFileUpload({
    fileName: 'document.pdf',
    fileSize: 1024000, // 1MB
    uploadUrl: '/api/upload',
    metadata: {
      userId: 'user-123',
      folder: 'documents',
      tags: ['important', 'work'],
    },
  });

  addFileUpload({
    fileName: 'image.jpg',
    fileSize: 2048000, // 2MB
    uploadUrl: '/api/upload',
    metadata: {
      userId: 'user-123',
      folder: 'images',
    },
  });

  // Check queue status
  setTimeout(() => {
    const status = getUploadQueueStatus();
    console.log('Upload queue status:', status);
  }, 1000);
}
