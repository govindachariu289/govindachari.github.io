// Compliance Rule Engine for LabelGuard AI
// This service evaluates extracted fields against compliance rules

// Configurable compliance rules based on Legal Metrology (Packaged Commodities) Rules, 2011
const complianceRules = [
  {
    id: 'mrp',
    field: 'MRP',
    label: 'Maximum Retail Price',
    required: true,
    description: 'MRP must be clearly declared with ₹ symbol',
    evaluate: (value) => {
      if (!value) return 'missing';
      // Check if value contains ₹ or Rs
      if (typeof value === 'string' && (value.includes('₹') || value.toLowerCase().includes('rs'))) {
        return 'present';
      }
      // If it's just a number, still consider it present but flag for review
      return 'review';
    }
  },
  {
    id: 'net_quantity',
    field: 'Net Quantity',
    label: 'Net Quantity',
    required: true,
    description: 'Net quantity must be declared in standard units (g, kg, ml, L, etc.)',
    evaluate: (value) => {
      if (!value) return 'missing';
      const units = ['g', 'kg', 'ml', 'l', 'L', 'mg', 'pcs', 'pieces'];
      const hasUnit = units.some(unit => value.toLowerCase().includes(unit));
      return hasUnit ? 'present' : 'review';
    }
  },
  {
    id: 'manufacturer',
    field: 'Manufacturer',
    label: 'Manufacturer/Packer Details',
    required: true,
    description: 'Name and complete address of manufacturer/packer must be provided',
    evaluate: (value) => {
      if (!value) return 'missing';
      if (value.length > 20) return 'present';
      return 'review';
    }
  },
  {
    id: 'consumer_care',
    field: 'Consumer Care',
    label: 'Consumer Care Details',
    required: true,
    description: 'Consumer care contact information must be provided',
    evaluate: (value) => {
      if (!value) return 'missing';
      // Check for phone number pattern or email
      if (/\d{10}/.test(value.replace(/\D/g, '')) || value.includes('@')) {
        return 'present';
      }
      return 'review';
    }
  },
  {
    id: 'country_origin',
    field: 'Country of Origin',
    label: 'Country of Origin',
    required: true,
    description: 'Country of origin must be declared for imported products',
    evaluate: (value) => {
      if (!value) return 'missing';
      return 'present';
    }
  },
  {
    id: 'batch_lot',
    field: 'Batch',
    label: 'Batch/Lot Information',
    required: true,
    description: 'Batch or lot code must be declared',
    evaluate: (value) => {
      if (!value) return 'missing';
      if (value.length >= 3) return 'present';
      return 'review';
    }
  },
  {
    id: 'date',
    field: 'Date',
    label: 'Manufacturing/Expiry Date',
    required: true,
    description: 'Date of manufacturing or expiry must be declared',
    evaluate: (value) => {
      if (!value) return 'missing';
      // Check for date patterns
      if (/\d{2}\/\d{2}\/\d{2,4}/.test(value) || /\d{2}\/\d{4}/.test(value)) {
        return 'present';
      }
      return 'review';
    }
  }
];

/**
 * Evaluates extracted fields against compliance rules
 * @param {Object} extractedFields - Object containing extracted field values
 * @returns {Array} Array of compliance check results
 */
export const evaluateCompliance = (extractedFields) => {
  const results = [];
  
  complianceRules.forEach(rule => {
    const value = extractedFields[rule.field.toLowerCase()] || extractedFields[rule.field];
    const status = rule.evaluate(value);
    
    results.push({
      id: rule.id,
      field: rule.field,
      label: rule.label,
      value: value || null,
      status,
      required: rule.required,
      description: rule.description,
      explanation: getExplanation(rule, value, status)
    });
  });
  
  return results;
};

/**
 * Generates explanation for each compliance check
 */
const getExplanation = (rule, value, status) => {
  if (status === 'missing') {
    return {
      detected: 'Not found on label',
      whyItMatters: rule.description,
      suggestedAction: `Add ${rule.label.toLowerCase()} declaration to the product label`
    };
  }
  
  if (status === 'review') {
    return {
      detected: value ? `"${value}"` : 'Unclear',
      whyItMatters: `${rule.description}. Current value may need verification.`,
      suggestedAction: `Verify that "${value}" meets legal metrology requirements for ${rule.label.toLowerCase()}`
    };
  }
  
  return {
    detected: value ? `"${value}"` : 'Present',
    whyItMatters: `${rule.label} is properly declared`,
    suggestedAction: 'No action required'
  };
};

/**
 * Calculates overall compliance score
 * @param {Array} results - Array of compliance check results
 * @returns {Object} Score breakdown
 */
export const calculateComplianceScore = (results) => {
  const totalChecks = results.length;
  const present = results.filter(r => r.status === 'present').length;
  const review = results.filter(r => r.status === 'review').length;
  const missing = results.filter(r => r.status === 'missing').length;
  
  // Score calculation: present = 100%, review = 50%, missing = 0%
  const score = Math.round(((present * 100) + (review * 50)) / totalChecks);
  
  let overallStatus = 'compliant';
  if (missing > 0) overallStatus = 'non-compliant';
  else if (review > 0) overallStatus = 'needs-review';
  
  return {
    score,
    overallStatus,
    breakdown: {
      present,
      review,
      missing,
      total: totalChecks
    }
  };
};

/**
 * Gets all available compliance rules
 * @returns {Array} Array of compliance rules
 */
export const getComplianceRules = () => complianceRules;

export default {
  evaluateCompliance,
  calculateComplianceScore,
  getComplianceRules
};
