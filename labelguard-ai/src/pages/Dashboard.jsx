import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Package, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { getDashboardStats, getScans } from '../services/storageService';
import ComplianceScore from '../components/ComplianceScore';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const navigate = useNavigate();
  const stats = getDashboardStats();
  const recentScans = getScans().slice(0, 5);

  const getStatusForScan = (score) => {
    if (score >= 90) return { label: 'Compliant', color: 'success' };
    if (score >= 70) return { label: 'Needs Review', color: 'warning' };
    return { label: 'Non-Compliant', color: 'danger' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 rounded-2xl p-8 md:p-12 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            AI-Powered Packaged Commodity Compliance
          </h1>
          <p className="text-lg text-brand-100 mb-8">
            Scan a product label and instantly identify key declarations that may require compliance review.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/scan')}
              className="inline-flex items-center space-x-2 bg-white text-brand-700 px-6 py-3 rounded-lg font-semibold hover:bg-brand-50 transition-colors"
            >
              <span>Scan Product</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="inline-flex items-center space-x-2 bg-brand-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-400 transition-colors border border-brand-400"
            >
              <span>View Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="h-8 w-8 text-navy-400" />
          </div>
          <p className="text-3xl font-bold text-navy-900">{stats.total}</p>
          <p className="text-sm text-navy-600 mt-1">Products Scanned</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-navy-900">{stats.compliant}</p>
          <p className="text-sm text-navy-600 mt-1">Compliant</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-navy-900">{stats.needsReview}</p>
          <p className="text-sm text-navy-600 mt-1">Needs Review</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-navy-900">{stats.nonCompliant}</p>
          <p className="text-sm text-navy-600 mt-1">Missing Declarations</p>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-navy-900">Recent Scans</h2>
        </div>

        {recentScans.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-navy-600 mb-4">No scans yet</p>
            <button
              onClick={() => navigate('/scan')}
              className="text-brand-600 font-medium hover:text-brand-700"
            >
              Start your first scan →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider hidden md:table-cell">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-navy-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentScans.map((scan) => {
                  const status = getStatusForScan(scan.complianceScore);
                  
                  return (
                    <tr key={scan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {scan.image && (
                            <img
                              src={scan.image}
                              alt={scan.productName}
                              className="h-10 w-10 rounded object-cover mr-3"
                            />
                          )}
                          <span className="font-medium text-navy-900">
                            {scan.productName || 'Unnamed Product'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-600 hidden md:table-cell">
                        {formatDate(scan.scanDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ComplianceScore score={scan.complianceScore} size="small" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={status.color === 'success' ? 'present' : status.color === 'warning' ? 'review' : 'missing'} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/report/${scan.id}`)}
                          className="text-brand-600 hover:text-brand-700 font-medium text-sm"
                        >
                          View Report
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Important:</strong> LabelGuard AI provides preliminary compliance screening assistance. 
          Final legal determination should be made by an authorized legal metrology authority.
        </p>
      </div>
    </div>
  );
}
