// LocalStorage utility for persisting scan data

const STORAGE_KEY = 'labelguard_scans';

/**
 * Gets all scans from localStorage
 * @returns {array} - Array of scan records
 */
export const getScans = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading scans from localStorage:', error);
    return [];
  }
};

/**
 * Saves a new scan to localStorage
 * @param {object} scan - Scan record to save
 * @returns {array} - Updated array of scans
 */
export const saveScan = (scan) => {
  try {
    const scans = getScans();
    const newScan = {
      ...scan,
      id: Date.now().toString(),
      savedAt: new Date().toISOString()
    };
    scans.unshift(newScan); // Add to beginning
    
    // Keep only last 50 scans to avoid storage limits
    const limitedScans = scans.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedScans));
    return limitedScans;
  } catch (error) {
    console.error('Error saving scan to localStorage:', error);
    return getScans();
  }
};

/**
 * Gets a specific scan by ID
 * @param {string} id - Scan ID
 * @returns {object|null} - Scan record or null if not found
 */
export const getScanById = (id) => {
  try {
    const scans = getScans();
    return scans.find(scan => scan.id === id) || null;
  } catch (error) {
    console.error('Error getting scan by ID:', error);
    return null;
  }
};

/**
 * Deletes a scan by ID
 * @param {string} id - Scan ID to delete
 * @returns {array} - Updated array of scans
 */
export const deleteScan = (id) => {
  try {
    const scans = getScans();
    const filteredScans = scans.filter(scan => scan.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredScans));
    return filteredScans;
  } catch (error) {
    console.error('Error deleting scan:', error);
    return getScans();
  }
};

/**
 * Gets dashboard statistics
 * @returns {object} - Statistics object
 */
export const getDashboardStats = () => {
  const scans = getScans();
  
  const stats = {
    total: scans.length,
    compliant: 0,
    needsReview: 0,
    nonCompliant: 0
  };

  scans.forEach(scan => {
    if (scan.complianceScore >= 90) {
      stats.compliant++;
    } else if (scan.complianceScore >= 70) {
      stats.needsReview++;
    } else {
      stats.nonCompliant++;
    }
  });

  return stats;
};

export default {
  getScans,
  saveScan,
  getScanById,
  deleteScan,
  getDashboardStats
};
