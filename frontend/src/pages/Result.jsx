import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';


const getImageUrl = (path) => (path?.startsWith('http') ? path : `/${path}`);


const NEARBY_HOSPITALS = [
  { name: 'City General Hospital', specialty: 'Pulmonology', distance: '2.1 km', rating: 4.8 },
  { name: 'Metropolitan Medical Center', specialty: 'Infectious Diseases', distance: '3.5 km', rating: 4.6 },
];

export default function Result() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const fetchResult = async () => {
      try {
        const { data: res } = await api.get(`/api/predictions/${id}`);
        if (!cancelled) setData(res.prediction);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load result');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchResult();
    return () => { cancelled = true; };
  }, [id]);

  const handleDownloadReport = () => {
    // Placeholder: in production, generate PDF from backend
    const report = data
      ? `MediScan AI - Analysis Report\n\nDisease: ${data.diseaseType}\nResult: ${data.result}\nConfidence: ${(data.confidence * 100).toFixed(1)}%\nDate: ${new Date(data.createdAt).toLocaleString()}\nPatient: ${data.user?.email || user?.email}`
      : '';
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-primary-600 font-medium">Loading report...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">{error || 'Result not found'}</p>
          <Link to="/dashboard" className="mt-4 inline-block text-primary-600 hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  const confidencePct = (data.confidence * 100).toFixed(1);
  const isNegative = data.result === 'Negative';
  const imageUrl = getImageUrl(data.imagePath);
  const reportDate = new Date(data.createdAt);
  const dateStr = reportDate.toLocaleDateString();
  const timeStr = reportDate.toLocaleTimeString();
  const patientEmail = data.user?.email || user?.email;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            New Analysis
          </Link>
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Report
          </button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 text-center">Analysis Report</h1>
        <p className="text-center text-gray-600 mt-1">Generated for {patientEmail}</p>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {/* Diagnosis Result - main card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Diagnosis Result</h2>
                <p className="text-sm text-gray-600">AI-powered analysis of your chest X-ray.</p>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium ${
                  isNegative ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {data.result.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700 mb-2">Analyzed Image</p>
                <div className="aspect-square max-h-64 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={imageUrl}
                    alt="Chest X-ray"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23f3f4f6" width="200" height="200"/><text x="50%" y="50%" fill="%236b7280" font-size="14" text-anchor="middle" dy=".3em">Image</text></svg>';
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Disease</p>
                  <p className="font-semibold text-gray-900">{data.diseaseType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confidence</p>
                  <p className="font-bold text-primary-700 text-xl">{confidencePct}%</p>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${confidencePct}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                  <p className="text-sm font-medium text-gray-900">Recommendation</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {isNegative
                      ? 'No significant findings. Continue routine care. If you have symptoms, consult a doctor.'
                      : 'Immediate medical attention recommended. Please consult a pulmonologist or infectious disease specialist.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">Recommended Precautions</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {isNegative ? (
                  <>
                    <li>• Maintain good respiratory hygiene.</li>
                    <li>• Follow up with a doctor if symptoms develop.</li>
                  </>
                ) : (
                  <>
                    <li>• Avoid close contact until evaluated by a doctor.</li>
                    <li>• Follow prescribed treatment and complete the full course.</li>
                    <li>• Rest and stay hydrated.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Report Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Summary</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Date</dt>
                  <dd className="font-medium text-gray-900">{dateStr}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Time</dt>
                  <dd className="font-medium text-gray-900">{timeStr}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Patient</dt>
                  <dd className="font-medium text-gray-900 truncate max-w-[140px]" title={patientEmail}>{patientEmail}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Analysis Type</dt>
                  <dd className="font-medium text-gray-900">{data.diseaseType}</dd>
                </div>
              </dl>
            </div>

            {/* Nearby Hospitals */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Nearby Hospitals</h2>
              <ul className="space-y-4">
                {NEARBY_HOSPITALS.map((h, i) => (
                  <li key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <p className="font-medium text-gray-900">{h.name}</p>
                    <p className="text-sm text-gray-600">{h.specialty}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
                        {h.distance}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        ★ {h.rating}
                      </span>
                      <a href={`tel:+1234567890`} className="text-sm text-primary-600 hover:underline ml-auto">Call</a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
