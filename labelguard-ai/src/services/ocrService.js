// OCR Service for LabelGuard AI
// This service provides the abstraction layer for OCR functionality
// 
// IMPORTANT: This is a MOCK implementation for the SIH prototype.
// In production, this would connect to a real OCR API such as:
// - Google Cloud Vision API
// - AWS Textract
// - Azure Computer Vision
// - Tesseract.js (client-side)

import { complianceRules, evaluateFieldCompliance } from './complianceService';

/**
 * Mock demo product data for "Try Demo Product" feature
 * This simulates what a real OCR extraction might return
 */
const demoProductData = {
  productName: 'FreshBite Premium Atta',
  image: null, // Will be set when demo is used
  extractedFields: {
    MRP: '₹249',
    NetQuantity: '5 kg',
    Manufacturer: 'FreshBite Foods Pvt. Ltd.,\nMumbai, Maharashtra 400001',
    ConsumerCare: '1800-123-4567\ncare@freshbite.in',
    CountryOfOrigin: 'India',
    BatchLot: 'FB0926A',
    DateMonthYear: '09/2026'
  },
  scanDate: new Date().toISOString()
};

/**
 * Simulates OCR processing and field extraction
 * In production, this would call a real OCR API and use NLP/ML to extract fields
 * 
 * @param {File|string} imageSource - Image file or base64 string
 * @param {boolean} isDemo - Whether this is a demo run
 * @returns {Promise<object>} - Extracted data with fields and metadata
 */
export const analyzeLabelImage = async (imageSource, isDemo = false) => {
  // Simulate processing delay for realistic UX
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Processing steps simulation
  const steps = [
    { name: 'Reading label', duration: 800 },
    { name: 'Extracting text', duration: 1000 },
    { name: 'Identifying declarations', duration: 800 },
    { name: 'Running compliance checks', duration: 600 },
    { name: 'Preparing report', duration: 400 }
  ];

  const stepResults = [];
  
  for (const step of steps) {
    await delay(step.duration);
    stepResults.push({
      name: step.name,
      completed: true
    });
  }

  if (isDemo) {
    // Return demo data with slight randomization for realism
    const imageData = typeof imageSource === 'string' ? imageSource : null;
    
    return {
      success: true,
      productName: demoProductData.productName,
      image: imageData || demoProductData.image,
      extractedFields: { ...demoProductData.extractedFields },
      scanDate: new Date().toISOString(),
      processingSteps: stepResults,
      confidence: 87,
      isDemo: true
    };
  }

  // For real uploads, we simulate extraction based on common patterns
  // In production, this is where you'd integrate with actual OCR API
  
  // Simulated mock extraction for uploaded images
  // This generates semi-random but realistic-looking data
  const mockExtractions = {
    MRP: `₹${Math.floor(Math.random() * 500) + 50}`,
    NetQuantity: `${Math.floor(Math.random() * 1000)} g`,
    Manufacturer: 'Sample Foods Pvt. Ltd.\nIndustrial Area, Delhi',
    ConsumerCare: `1800-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    CountryOfOrigin: 'India',
    BatchLot: `B${Date.now().toString().slice(-6)}`,
    DateMonthYear: `${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear() + 1}`
  };

  // Introduce some missing/review fields for demonstration
  if (Math.random() > 0.7) {
    mockExtractions.BatchLot = 'not detected';
  }
  if (Math.random() > 0.8) {
    mockExtractions.ConsumerCare = 'uncertain';
  }

  return {
    success: true,
    productName: 'Uploaded Product',
    image: typeof imageSource === 'string' ? imageSource : null,
    extractedFields: mockExtractions,
    scanDate: new Date().toISOString(),
    processingSteps: stepResults,
    confidence: 75 + Math.floor(Math.random() * 15),
    isDemo: false
  };
};

/**
 * Evaluates all extracted fields against compliance rules
 * @param {object} extractedFields - Object containing extracted field values
 * @returns {array} - Array of evaluation results
 */
export const evaluateAllFields = (extractedFields) => {
  const evaluations = [];

  complianceRules.forEach(rule => {
    const value = extractedFields[rule.field] || '';
    const evaluation = evaluateFieldCompliance(value, rule);
    
    evaluations.push({
      ruleId: rule.id,
      field: rule.field,
      label: rule.label,
      value: value || 'Not detected',
      ...evaluation,
      description: rule.description,
      action: rule.action
    });
  });

  return evaluations;
};

/**
 * Gets demo product image placeholder
 * In production, this could be a real product image
 */
export const getDemoProductImage = () => {
  // Returns a placeholder SVG as data URL
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <rect fill="#f8fafc" width="400" height="500"/>
      <rect fill="#e2e8f0" x="50" y="50" width="300" height="400" rx="8"/>
      <text x="200" y="200" text-anchor="middle" fill="#64748b" font-size="18" font-family="system-ui">FreshBite</text>
      <text x="200" y="230" text-anchor="middle" fill="#64748b" font-size="14" font-family="system-ui">Premium Atta</text>
      <rect fill="#cbd5e1" x="80" y="280" width="240" height="120" rx="4"/>
      <text x="200" y="350" text-anchor="middle" fill="#94a3b8" font-size="12" font-family="system-ui">Product Label Preview</text>
    </svg>
  `;
  return 'data:image/svg+xml;base64,' + btoa(svg);
};

export default {
  analyzeLabelImage,
  evaluateAllFields,
  getDemoProductImage
};
