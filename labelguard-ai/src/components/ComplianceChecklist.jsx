import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ComplianceChecklist({ evaluations }) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (ruleId) => {
    setExpandedItems(prev => ({
      ...prev,
      [ruleId]: !prev[ruleId]
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-navy-900">Compliance Checklist</h3>
        <p className="text-sm text-navy-600 mt-1">
          Based on Legal Metrology (Packaged Commodities) Rules, 2011
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {evaluations.map((evaluation) => {
          const isExpanded = expandedItems[evaluation.ruleId];

          return (
            <div key={evaluation.ruleId} className="hover:bg-gray-50 transition-colors">
              <button
                onClick={() => toggleExpand(evaluation.ruleId)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-navy-900">{evaluation.label}</span>
                    <StatusBadge status={evaluation.status} />
                  </div>
                  <p className="text-sm text-navy-600 mt-1 line-clamp-1">
                    {evaluation.value}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-navy-500">
                    {evaluation.confidence}% confidence
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-navy-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-navy-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-4 pt-2 bg-gray-50 border-t border-gray-100">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">What was detected</p>
                        <p className="text-sm text-navy-600 mt-0.5 break-words">
                          {evaluation.value || 'No value detected'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">Why it matters</p>
                        <p className="text-sm text-navy-600 mt-0.5">
                          {evaluation.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Info className="h-4 w-4 text-brand-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-navy-900">Suggested action</p>
                        <p className="text-sm text-navy-600 mt-0.5">
                          {evaluation.action}
                        </p>
                      </div>
                    </div>

                    {evaluation.status === 'missing' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                        <p className="text-sm text-red-700 font-medium">
                          ⚠️ This is a mandatory declaration under Legal Metrology Rules. Please ensure this information is clearly visible on the product label.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
