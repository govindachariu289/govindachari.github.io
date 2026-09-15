import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Package, Calendar, Shield } from 'lucide-react';
import { getScanById } from '../services/storageService';
import ComplianceScore from '../components/ComplianceScore';
import StatusBadge from '../components/StatusBadge';
import ComplianceChecklist from '../components/ComplianceChecklist';

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const scanData = getScanById(id);

  if (!scanData) {
    return (
      <div className="text-center py-12">
        <p className="text-navy-600 mb-4">Report not found</p>
        <button
          onClick={() => navigate('/reports')}
          className="text-brand-600 font-medium hover:text-brand-700"
        >
          Back to Reports →
        </button>
      </div>
    );
  }

  const handleDownloadReport = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (color) => {
    switch (color) {
      case 'success': return 'bg-green-100 text-green-800 border-green-300';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'danger': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <button
          onClick={() => navigate('/reports')}
          className="inline-flex items-center space-x-2 text-navy-600 hover:text-navy-900"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Reports</span>
        </button>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center space-x-2 bg-brand-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </button>
          <button
            onClick={() => navigate('/scan')}
            className="inline-flex items-center space-x-2 bg-white text-navy-700 border border-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <span>New Scan</span>
          </button>
        </div>
      </div>

      {/* Report Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Product Image */}
          {scanData.image ? (
            <div className="flex-shrink-0">
              <img
                src={scanData.image}
                alt={scanData.productName}
                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border border-gray-200"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <Package className="h-16 w-16 text-gray-400" />
            </div>
          )}

          {/* Product Info & Score */}
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-navy-900">
                  {scanData.productName}
                </h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-navy-600">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(scanData.scanDate)}</span>
                  </span>
                  {scanData.isDemo && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      Demo Mode
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <ComplianceScore score={scanData.complianceScore} size="medium" />
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(scanData.statusColor)}`}>
                    {scanData.overallStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <Shield className="h-3 w-3 inline mr-1" />
                LabelGuard AI provides preliminary compliance screening assistance. 
                Final legal determination should be made by an authorized legal metrology authority.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(scanData.extractedFields).map(([field, value]) => {
          const evaluation = scanData.evaluations.find(e => e.field === field);
          
          return (
            <div key={field} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-navy-900 text-sm">
                  {evaluation?.label || field}
                </h3>
                {evaluation && (
                  <StatusBadge status={evaluation.status} />
                )}
              </div>
              <p className="text-navy-700 text-sm whitespace-pre-line break-words">
                {value || 'Not detected'}
              </p>
              {evaluation && (
                <p className="text-xs text-navy-500 mt-2">
                  {evaluation.confidence}% confidence
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Compliance Checklist */}
      <ComplianceChecklist evaluations={scanData.evaluations} />

      {/* Print-only footer */}
      <div className="hidden print:block mt-8 pt-8 border-t border-gray-200">
        <div className="text-center text-xs text-gray-500">
          <p>Generated by LabelGuard AI - Packaged Commodity Compliance Screening System</p>
          <p className="mt-1">This is a preliminary assessment and not a legally binding certification.</p>
        </div>
      </div>
    </div>
  );
}
