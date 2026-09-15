import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import ScanLabel from './pages/ScanLabel'
import AnalysisResults from './pages/AnalysisResults'
import Reports from './pages/Reports'
import ReportDetail from './pages/ReportDetail'
import About from './pages/About'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scan" element={<ScanLabel />} />
            <Route path="/results" element={<AnalysisResults />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/report/:id" element={<ReportDetail />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
)
