import React from 'react';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function StatusBadge({ status }) {
  const config = {
    present: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      icon: CheckCircle,
      label: 'Present'
    },
    review: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: AlertCircle,
      label: 'Review'
    },
    missing: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: XCircle,
      label: 'Missing'
    }
  };

  const currentConfig = config[status] || config.review;
  const Icon = currentConfig.icon;

  return (
    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${currentConfig.bg} ${currentConfig.text} ${currentConfig.border}`}>
      <Icon className="h-3 w-3" />
      <span>{currentConfig.label}</span>
    </span>
  );
}
