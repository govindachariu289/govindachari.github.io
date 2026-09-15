import React from 'react';
import { Shield, Brain, CheckCircle, AlertTriangle, Users, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="mx-auto w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="h-10 w-10 text-brand-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
            About LabelGuard AI
          </h1>
          
          <p className="text-lg text-navy-600 mb-8">
            LabelGuard AI is an AI-assisted screening system designed to help identify potentially missing or unclear packaged commodity declarations from product labels.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
            <p className="text-sm text-blue-800 font-medium">
              ⚠️ Human-in-the-loop review is recommended for uncertain cases
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Brain className="h-8 w-8 text-brand-600 mb-4" />
          <h3 className="font-semibold text-navy-900 mb-2">AI-Assisted Field Identification</h3>
          <p className="text-sm text-navy-600">
            Advanced OCR and NLP algorithms extract key declaration fields from product labels automatically.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <CheckCircle className="h-8 w-8 text-brand-600 mb-4" />
          <h3 className="font-semibold text-navy-900 mb-2">Configurable Compliance Rules</h3>
          <p className="text-sm text-navy-600">
            Rule engine based on Legal Metrology (Packaged Commodities) Rules, 2011 with customizable parameters.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <AlertTriangle className="h-8 w-8 text-brand-600 mb-4" />
          <h3 className="font-semibold text-navy-900 mb-2">Field-Level Findings</h3>
          <p className="text-sm text-navy-600">
            Detailed evaluation of each mandatory declaration with confidence scores and status indicators.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Zap className="h-8 w-8 text-brand-600 mb-4" />
          <h3 className="font-semibold text-navy-900 mb-2">Instant Analysis</h3>
          <p className="text-sm text-navy-600">
            Get preliminary compliance results within seconds of uploading a product label image.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Users className="h-8 w-8 text-brand-600 mb-4" />
          <h3 className="font-semibold text-navy-900 mb-2">Human-in-the-Loop</h3>
          <p className="text-sm text-navy-600">
            Designed to assist legal metrology officers, not replace human judgment and expertise.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <Shield className="h-8 w-8 text-brand-600 mb-4" />
          <h3 className="font-semibold text-navy-900 mb-2">Report Generation</h3>
          <p className="text-sm text-navy-600">
            Generate comprehensive compliance reports suitable for documentation and record-keeping.
          </p>
        </div>
      </div>

      {/* Architecture Workflow */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h2 className="text-xl font-bold text-navy-900 mb-8 text-center">
          System Architecture
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
          {[
            { icon: '📦', label: 'Product Image' },
            { icon: '🔍', label: 'OCR / Image Processing' },
            { icon: '🧠', label: 'AI Field Extraction' },
            { icon: '✓', label: 'Compliance Rule Engine' },
            { icon: '📊', label: 'Field-Level Findings' },
            { icon: '📄', label: 'Compliance Report' }
          ].map((step, index, arr) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center text-2xl border border-brand-200">
                  {step.icon}
                </div>
                <p className="text-xs font-medium text-navy-700 text-center max-w-[100px]">
                  {step.label}
                </p>
              </div>
              {index < arr.length - 1 && (
                <div className="hidden md:block text-brand-400">
                  →
                </div>
              )}
              {index < arr.length - 1 && (
                <div className="md:hidden text-brand-400 rotate-90">
                  ↓
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-semibold text-amber-900 mb-3">Important Disclaimer</h3>
        <div className="space-y-3 text-sm text-amber-800">
          <p>
            LabelGuard AI provides <strong>preliminary compliance screening assistance only</strong>. 
            The system uses AI-based analysis which may have limitations in accuracy.
          </p>
          <p>
            <strong>This is NOT a legally binding certification.</strong> Final determination of 
            compliance must be made by authorized legal metrology officers following proper 
            procedures and verification.
          </p>
          <p>
            For official enforcement actions, always conduct physical verification and follow 
            established legal metrology protocols.
          </p>
        </div>
      </div>

      {/* Technical Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-navy-900 mb-4">Technical Information</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-navy-900">Supported Image Formats</p>
            <p className="text-navy-600 mt-1">JPG, PNG, WEBP (Max 5MB)</p>
          </div>
          <div>
            <p className="font-medium text-navy-900">Compliance Standard</p>
            <p className="text-navy-600 mt-1">Legal Metrology (Packaged Commodities) Rules, 2011</p>
          </div>
          <div>
            <p className="font-medium text-navy-900">Data Storage</p>
            <p className="text-navy-600 mt-1">Local browser storage (no server upload)</p>
          </div>
          <div>
            <p className="font-medium text-navy-900">Integration Ready</p>
            <p className="text-navy-600 mt-1">Architecture supports real OCR API integration</p>
          </div>
        </div>
      </div>
    </div>
  );
}
