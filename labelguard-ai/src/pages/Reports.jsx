import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Shield, Brain, CheckCircle, ArrowRight } from 'lucide-react';
import { getScans } from '../services/storageService';

export default function Reports() {
  const navigate = useNavigate();
  const scans = getScans();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-navy-900">
          Compliance Reports
        </h1>
        <p className="text-navy-600 mt-2">
          View and manage all your product compliance screening reports
        </p>
      </div>

      {/* Reports List */}
      {scans.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-navy-900 mb-2">
            No reports yet
          </h3>
          <p className="text-navy-600 mb-6">
            Start by scanning your first product label
          </p>
          <button
            onClick={() => navigate('/scan')}
            className="inline-flex items-center space-x-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors"
          >
            <span>Scan Product</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-brand-300 transition-colors cursor-pointer"
              onClick={() => navigate(`/report/${scan.id}`)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  {scan.image ? (
                    <img
                      src={scan.image}
                      alt={scan.productName}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      <Shield className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-navy-900">
                        {scan.productName || 'Unnamed Product'}
                      </h3>
                      {scan.isDemo && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          Demo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-navy-600 mt-1">
                      {formatDate(scan.scanDate)}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(scan.complianceScore)}`}>
                        Score: {scan.complianceScore}%
                      </span>
                      <span className="text-xs text-navy-500">
                        {scan.evaluations?.filter(e => e.status === 'present').length}/{scan.evaluations?.length} declarations present
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/report/${scan.id}`);
                    }}
                    className="inline-flex items-center space-x-2 text-brand-600 hover:text-brand-700 font-medium"
                  >
                    <span>View Report</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">
          About Compliance Reports
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <Brain className="h-6 w-6 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-navy-900 text-sm">AI-Assisted Analysis</p>
              <p className="text-sm text-navy-600 mt-1">
                Each report includes AI-extracted field data with confidence scores
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-navy-900 text-sm">Compliance Checklist</p>
              <p className="text-sm text-navy-600 mt-1">
                Detailed evaluation against Legal Metrology Rules, 2011
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <FileText className="h-6 w-6 text-brand-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-navy-900 text-sm">Downloadable Reports</p>
              <p className="text-sm text-navy-600 mt-1">
                Generate printable PDF reports for documentation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
