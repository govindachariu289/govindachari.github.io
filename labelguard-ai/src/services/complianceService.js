// Compliance Rule Engine for LabelGuard AI
// This module defines the compliance rules based on Legal Metrology (Packaged Commodities) Rules, 2011

export const complianceRules = [
  {
    id: 'mrp',
    field: 'MRP',
    label: 'Maximum Retail Price',
    required: true,
    description: 'Every packaged commodity must display the Maximum Retail Price inclusive of all taxes.',
    action: 'Ensure MRP is clearly visible and includes "Rs." or "₹" symbol.'
  },
  {
    id: 'net_quantity',
    field: 'NetQuantity',
    label: 'Net Quantity',
    required: true,
    description: 'Net quantity must be declared in standard units (g, kg, ml, L, etc.).',
    action: 'Verify quantity is expressed in appropriate metric units.'
  },
  {
    id: 'manufacturer',
    field: 'Manufacturer',
    label: 'Manufacturer/Packer Details',
    required: true,
    description: 'Name and complete address of manufacturer/packer must be provided.',
    action: 'Ensure full address including pin code is visible.'
  },
  {
    id: 'consumer_care',
    field: 'ConsumerCare',
    label: 'Consumer Care Details',
    required: true,
    description: 'Contact information for consumer complaints must be displayed.',
    action: 'Verify phone number or email is provided.'
  },
  {
    id: 'country_origin',
    field: 'CountryOfOrigin',
    label: 'Country of Origin',
    required: true,
    description: 'Country where the product was manufactured must be declared.',
    action: 'Ensure "Made in India" or equivalent is present.'
  },
  {
    id: 'batch_lot',
    field: 'BatchLot',
    label: 'Batch/Lot Information',
    required: true,
    description: 'Batch or lot code for traceability must be present.',
    action: 'Verify batch/lot code is legible.'
  },
  {
    id: 'date',
    field: 'DateMonthYear',
    label: 'Manufacturing/Expiry Date',
    required: true,
    description: 'Date of manufacture or best before/expiry date must be declared.',
    action: 'Ensure date format is clear (MM/YYYY or DD/MM/YYYY).'
  }
];

/**
 * Evaluates compliance status for a given field value
 * @param {string} value - The extracted value for the field
 * @param {object} rule - The compliance rule object
 * @returns {object} - Status object with status, confidence, and details
 */
export const evaluateFieldCompliance = (value, rule) => {
  if (!value || value.trim() === '' || value.toLowerCase() === 'not detected') {
    return {
      status: 'missing',
      confidence: 95,
      message: `${rule.label} not detected on label`
    };
  }

  // Check for low confidence indicators
  if (value.includes('[?]') || value.includes('uncertain')) {
    return {
      status: 'review',
      confidence: 60,
      message: `${rule.label} detected but requires verification`
    };
  }

  // Additional validation for specific fields
  if (rule.id === 'mrp') {
    const hasCurrency = /₹|rs\.?|rupees?/i.test(value);
    const hasNumber = /\d+/.test(value);
    if (!hasCurrency || !hasNumber) {
      return {
        status: 'review',
        confidence: 70,
        message: 'MRP format may be incomplete - verify currency symbol and amount'
      };
    }
  }

  if (rule.id === 'net_quantity') {
    const hasUnit = /g|kg|ml|l|mg/i.test(value);
    const hasNumber = /\d+/.test(value);
    if (!hasUnit || !hasNumber) {
      return {
        status: 'review',
        confidence: 65,
        message: 'Net quantity format may be incomplete - verify unit and value'
      };
    }
  }

  if (rule.id === 'date') {
    const hasDatePattern = /\d{1,2}[\/-]\d{2,4}/.test(value) || /\d{4}/.test(value);
    if (!hasDatePattern) {
      return {
        status: 'review',
        confidence: 60,
        message: 'Date format unclear - verify manufacturing/expiry date'
      };
    }
  }

  return {
    status: 'present',
    confidence: 85 + Math.floor(Math.random() * 10),
    message: `${rule.label} properly declared`
  };
};

/**
 * Calculates overall compliance score based on field evaluations
 * @param {array} evaluations - Array of field evaluation results
 * @returns {number} - Compliance score (0-100)
 */
export const calculateComplianceScore = (evaluations) => {
  if (!evaluations || evaluations.length === 0) return 0;

  let totalPoints = 0;
  let earnedPoints = 0;

  evaluations.forEach(eval => {
    const rule = complianceRules.find(r => r.id === eval.ruleId);
    const weight = rule?.required ? 15 : 10;
    totalPoints += weight;

    if (eval.status === 'present') {
      earnedPoints += weight;
    } else if (eval.status === 'review') {
      earnedPoints += weight * 0.5;
    }
    // missing gets 0 points
  });

  return Math.round((earnedPoints / totalPoints) * 100);
};

/**
 * Gets overall status based on compliance score
 * @param {number} score - Compliance score
 * @returns {object} - Status object with label, color, and description
 */
export const getOverallStatus = (score) => {
  if (score >= 90) {
    return {
      label: 'Compliant',
      color: 'success',
      description: 'All mandatory declarations appear to be present.'
    };
  } else if (score >= 70) {
    return {
      label: 'Needs Review',
      color: 'warning',
      description: 'Some declarations require verification or clarification.'
    };
  } else {
    return {
      label: 'Non-Compliant',
      color: 'danger',
      description: 'Multiple mandatory declarations are missing or unclear.'
    };
  }
};

export default {
  complianceRules,
  evaluateFieldCompliance,
  calculateComplianceScore,
  getOverallStatus
};
