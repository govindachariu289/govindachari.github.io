import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';
import AnalysisProgress from '../components/AnalysisProgress';
import { analyzeLabelImage, evaluateAllFields } from '../services/ocrService';
import { calculateComplianceScore, getOverallStatus } from '../services/complianceService';
import { saveScan } from '../services/storageService';

export default function ScanLabel() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleImageSelect = (imageData, name) => {
    setImage(imageData);
    setImageName(name);
  };

  const handleDemoClick = async () => {
    setIsAnalyzing(true);
    
    // Simulate demo analysis
    try {
      const result = await analyzeLabelImage(null, true);
      
      // Evaluate fields
      const evaluations = evaluateAllFields(result.extractedFields);
      const complianceScore = calculateComplianceScore(evaluations);
      const overallStatus = getOverallStatus(complianceScore);
      
      // Save scan
      const scanData = {
        productName: result.productName,
        image: null, // Demo doesn't have real image
        extractedFields: result.extractedFields,
        evaluations,
        complianceScore,
        overallStatus: overallStatus.label,
        statusColor: overallStatus.color,
        scanDate: result.scanDate,
        isDemo: true
      };
      
      saveScan(scanData);
      
      // Navigate to results
      setTimeout(() => {
        navigate('/results', { state: { scanData } });
      }, 500);
    } catch (error) {
      console.error('Demo analysis error:', error);
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeLabelImage(image, false);
      
      // Evaluate fields
      const evaluations = evaluateAllFields(result.extractedFields);
      const complianceScore = calculateComplianceScore(evaluations);
      const overallStatus = getOverallStatus(complianceScore);
      
      // Save scan
      const scanData = {
        productName: result.productName,
        image: image,
        extractedFields: result.extractedFields,
        evaluations,
        complianceScore,
        overallStatus: overallStatus.label,
        statusColor: overallStatus.color,
        scanDate: result.scanDate,
        imageName: imageName,
        isDemo: false
      };
      
      saveScan(scanData);
      
      setAnalysisComplete(true);
      
      // Navigate to results after brief delay
      setTimeout(() => {
        navigate('/results', { state: { scanData } });
      }, 500);
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      alert('Analysis failed. Please try again.');
    }
  };

  const handleReset = () => {
    setImage(null);
    setImageName(null);
    setAnalysisComplete(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-navy-900">
          Scan Product Label
        </h1>
        <p className="text-navy-600 mt-2">
          Upload or capture an image of a packaged product label for compliance analysis
        </p>
      </div>

      {!isAnalyzing ? (
        <>
          {!image ? (
            <ImageUpload
              onImageSelect={handleImageSelect}
              onDemoClick={handleDemoClick}
            />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              {/* Image Preview */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-navy-900 mb-4">
                  Image Preview
                </h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={image}
                      alt="Product label"
                      className="w-full max-w-xs rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm text-navy-600">File Name</p>
                      <p className="font-medium text-navy-900">{imageName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-navy-600">Ready for Analysis</p>
                      <p className="font-medium text-green-600">✓ Image loaded successfully</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 pt-4">
                      <button
                        onClick={handleAnalyze}
                        className="inline-flex items-center space-x-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors"
                      >
                        <span>Analyze Label</span>
                      </button>
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center space-x-2 bg-white text-navy-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        <span>Choose Different Image</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <AnalysisProgress onComplete={() => setAnalysisComplete(true)} />
      )}

      {/* Info Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">
          What happens during analysis?
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="text-brand-600 font-bold">1</span>
            </div>
            <p className="font-medium text-navy-900">Text Extraction</p>
            <p className="text-sm text-navy-600">
              OCR technology reads all visible text from the label image
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="text-brand-600 font-bold">2</span>
            </div>
            <p className="font-medium text-navy-900">Field Identification</p>
            <p className="text-sm text-navy-600">
              AI identifies and extracts key declaration fields
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="text-brand-600 font-bold">3</span>
            </div>
            <p className="font-medium text-navy-900">Compliance Check</p>
            <p className="text-sm text-navy-600">
              Each field is evaluated against Legal Metrology Rules
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
