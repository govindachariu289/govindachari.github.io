import React from 'react';
import { Upload, Camera, Image as ImageIcon } from 'lucide-react';

export default function ImageUpload({ onImageSelect, onDemoClick }) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      processFile(files[0]);
    }
  };

  const processFile = (file) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, or WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelect(e.target.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Create video element for capture
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Wait for video to be ready
      await new Promise((resolve) => {
        video.onloadedmetadata = () => resolve();
      });

      // Capture frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      // Convert to data URL
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Stop camera
      stream.getTracks().forEach(track => track.stop());

      onImageSelect(imageData, 'camera-capture.jpg');
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Unable to access camera. Please ensure you have granted camera permissions.');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isDragging
            ? 'border-brand-500 bg-brand-50'
            : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-brand-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-navy-900">
              Upload Product Label
            </h3>
            <p className="text-sm text-navy-600 mt-1">
              Drag and drop an image here, or click to browse
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Upload Image</span>
            </button>

            <button
              onClick={handleCameraCapture}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-navy-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              <Camera className="h-4 w-4" />
              <span>Use Camera</span>
            </button>

            <button
              onClick={onDemoClick}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-navy-50 text-navy-700 border border-navy-200 rounded-lg hover:bg-navy-100 transition-colors font-medium text-sm"
            >
              <ImageIcon className="h-4 w-4" />
              <span>Try Demo Product</span>
            </button>
          </div>

          <p className="text-xs text-navy-500">
            Supported formats: JPG, PNG, WEBP • Max size: 5MB
          </p>
        </div>
      </div>

      {/* Info note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> For best results, ensure the product label is clearly visible, well-lit, and captured from a straight angle. Avoid shadows and glare.
        </p>
      </div>
    </div>
  );
}
