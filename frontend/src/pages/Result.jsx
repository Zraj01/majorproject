import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000');
  return `${baseUrl}/${path.replace(/^\//, '')}`;
};

export default function Result() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const locationState = useLocation().state;

  const [imagePreview, setImagePreview] = useState(locationState?.imagePreview || '');
  const [result, setResult] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [showHospitals, setShowHospitals] = useState(false);
  const [showAiGuidance, setShowAiGuidance] = useState(false);
  const [location, setLocation] = useState(null);
  const [manualLocation, setManualLocation] = useState('');
  const [locationStatus, setLocationStatus] = useState('Pending');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fetchingHospitals, setFetchingHospitals] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchResult = async () => {
      try {
        const { data: res } = await api.get(`/api/predictions/${id}`);
        if (!cancelled) {
          setResult(res.prediction);
          if (!imagePreview) setImagePreview(getImageUrl(res.prediction.imagePath));
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load result');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchResult();
    return () => { cancelled = true; };
  }, [id, imagePreview]);

  const handleDownloadReport = () => {
    window.print();
  };

  const toggleHospitals = () => {
    setShowHospitals(!showHospitals);
    if (!showHospitals && locationStatus.includes("required") && !manualLocation.trim()) {
       // if we're just opening the panel and need location, don't auto-fetch
       // we can try geolocation if we haven't yet
       if (navigator.geolocation && locationStatus === "Pending") {
         fetchHospitalsWithLocation();
       }
    } else if (!showHospitals) {
       // just opening it, and either we have a location or we already know we need manual
       if (locationStatus === "Pending") fetchHospitalsWithLocation();
    }
  };

  const fetchHospitalsWithLocation = () => {
    if (navigator.geolocation) {
      setFetchingHospitals(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const { data: res } = await api.post(`/api/predictions/${id}/hospitals`, { location: `${lat},${lng}` });
            setHospitals(res.nearbyHospitals || []);
            setLocation(`${lat},${lng}`);
            setLocationStatus("Location active");
          } catch (err) {
            console.error(err);
            setLocationStatus("Location access is required to find nearby hospitals.");
          } finally {
            setFetchingHospitals(false);
          }
        },
        (error) => {
          setLocationStatus("Location access is required to find nearby hospitals.");
          setFetchingHospitals(false);
        }
      );
    } else {
      setLocationStatus("Location access is required to find nearby hospitals.");
    }
  };

  const handleManualHospitalSearch = async () => {
    if (!manualLocation.trim()) return;
    setFetchingHospitals(true);
    try {
      const { data: res } = await api.post(`/api/predictions/${id}/hospitals`, { location: manualLocation });
      setHospitals(res.nearbyHospitals || []);
      setLocation(manualLocation);
      setLocationStatus(`Location: ${manualLocation}`);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingHospitals(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4">
          <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div className="text-lg font-medium text-gray-900">Analyzing your symptoms...</div>
        <div className="text-sm text-gray-500 mt-1">Please wait a moment</div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto w-full">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </Link>
          
          <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <p className="text-red-900 font-medium text-sm">Unable to fetch AI response.</p>
              <p className="text-red-700 text-sm mt-0.5">Showing basic guidance instead. Please consult a doctor for a proper diagnosis.</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6">
             <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Medical Guidance</h2>
             <ul className="space-y-3 text-sm text-gray-700">
               <li className="flex items-start gap-2">
                 <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                 Monitor your symptoms closely and rest.
               </li>
               <li className="flex items-start gap-2">
                 <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                 Stay hydrated and maintain personal hygiene.
               </li>
               <li className="flex items-start gap-2">
                 <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                 If you experience severe chest pain, high fever, or difficulty breathing, seek immediate medical attention.
               </li>
             </ul>
          </div>
        </div>
      </div>
    );
  }

  const isNegative = result.result === 'Negative';
  const confidenceVal = result.confidence * 100;
  const confidencePct = confidenceVal.toFixed(1);
  const reportDate = new Date(result.createdAt);
  const dateStr = reportDate.toLocaleDateString();
  const timeStr = reportDate.toLocaleTimeString();

  const displayStatus = isNegative ? 'No Condition Detected' : result.diseaseType || 'Condition Detected';

  let fallbackSeverityLevel = '';
  let severityColor = '';
  if (isNegative) {
    fallbackSeverityLevel = 'Low Risk';
    severityColor = 'bg-green-100 text-green-800 border-green-200';
  } else {
    if (confidenceVal < 50) {
      fallbackSeverityLevel = 'Low Risk';
      severityColor = 'bg-green-100 text-green-800 border-green-200';
    } else if (confidenceVal <= 75) {
      fallbackSeverityLevel = 'Medium Risk';
      severityColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
    } else {
      fallbackSeverityLevel = 'High Risk';
      severityColor = 'bg-red-100 text-red-800 border-red-200';
    }
  }

  const severityLevel = result.urgencyLevel ? `${result.urgencyLevel} Risk` : fallbackSeverityLevel;

  const defaultGuidancePositive = [
    "Stay calm and monitor symptoms",
    "Follow recommended precautions",
    "Seek medical help if symptoms worsen"
  ];
  
  const defaultGuidanceNegative = [
    "Continue normal activities",
    "Maintain hygiene and safety precautions",
    "Monitor health regularly"
  ];

  const guidanceArray = isNegative ? defaultGuidanceNegative : defaultGuidancePositive;

  const symptomsList = result.warningSigns && result.warningSigns.length > 0 
    ? result.warningSigns 
    : (isNegative ? ["No specific symptoms reported"] : ["Fever", "Cough", "Shortness of Breath", "Chest Pain"]);

  const detailedGuidance = result.whatToDoNow && result.whatToDoNow.length > 0 
    ? result.whatToDoNow 
    : [
        "Isolate yourself to prevent spreading if contagious.",
        "Take plenty of rest and stay hydrated.",
        "Monitor your oxygen levels and temperature.",
        "Consult a healthcare professional for a precise diagnosis."
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50 pb-12 print:bg-white print:text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        

        <div className="flex justify-between items-start mb-6 print:hidden">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back
          </Link>
          <div className="text-sm text-gray-500">
            Date: {dateStr}
          </div>
        </div>

        <div className="print:hidden">
          <h1 className="text-3xl font-bold text-gray-900">Diagnosis Result</h1>
          <p className="text-gray-600 mt-1">Analysis generated for {result.user?.email || user?.email || 'Patient'}</p>
        </div>


        <div className="hidden print:block mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">MediScan AI - Medical Analysis Report</h1>
          <p className="text-gray-500 mt-1">Generated for: {result.user?.email || user?.email || 'Patient'}</p>
          <p className="text-gray-500">Date: {dateStr} {timeStr}</p>
        </div>

        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          

          <div className="lg:col-span-2 space-y-8">
            

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 print:shadow-none print:border-gray-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Condition Detected</p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{displayStatus}</h2>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${severityColor}`}>
                      {severityLevel}
                    </span>
                    <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      Confidence: {confidencePct}%
                    </span>
                  </div>
                </div>
                {imagePreview && (
                  <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shrink-0 hidden sm:block">
                    <img src={imagePreview} alt="Scan" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>


              <div className={`p-4 rounded-xl border ${isNegative ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <svg className={`w-5 h-5 ${isNegative ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <h3 className={`font-medium ${isNegative ? 'text-green-900' : 'text-red-900'}`}>Initial Guidance</h3>
                </div>
                <ul className={`text-sm space-y-1.5 ${isNegative ? 'text-green-800' : 'text-red-800'}`}>
                  {guidanceArray.map((msg, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 currentColor bg-current" />
                      {msg}
                    </li>
                  ))}
                </ul>
              </div>
            </div>


            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 print:shadow-none print:border-gray-300">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Symptoms Summary</h2>
              <div className="flex flex-wrap gap-2">
                {symptomsList.map((sym, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium">
                    {sym}
                  </span>
                ))}
              </div>
            </div>


            {(showAiGuidance || true) && (
              <div className={`${showAiGuidance ? 'block' : 'hidden print:block'} bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in print:shadow-none print:border-gray-300`}>
                <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600 print:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  Detailed Medical Guidance
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">What Should You Do Now</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      {detailedGuidance.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-primary-500 shrink-0 mt-0.5 print:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          <span className="hidden print:inline mr-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 pt-5 border-t border-gray-100">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">Symptoms to Monitor</h3>
                      <p className="text-sm text-gray-600">
                        Watch for worsening of {symptomsList.join(', ').toLowerCase()} or appearance of new severe symptoms.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">When to Contact a Doctor</h3>
                      <p className="text-sm text-gray-600">
                        {isNegative ? 'If symptoms persist for more than a few days or worsen unexpectedly.' : 'Immediately if you experience severe shortness of breath, chest pain, or high fever.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          <div className="space-y-8">
            

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 print:hidden">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowAiGuidance(!showAiGuidance)} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition ${showAiGuidance ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                  <svg className="w-6 h-6 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span className="text-xs font-medium text-center">AI Guidance</span>
                </button>
                <button onClick={toggleHospitals} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition ${showHospitals ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                  <svg className="w-6 h-6 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  <span className="text-xs font-medium text-center">Hospitals</span>
                </button>
                <button onClick={handleDownloadReport} className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition">
                  <svg className="w-6 h-6 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span className="text-xs font-medium text-center">Download</span>
                </button>
                <Link to="/dashboard" className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition">
                  <svg className="w-6 h-6 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  <span className="text-xs font-medium text-center">Recheck</span>
                </Link>
              </div>
            </div>


            {showHospitals && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in print:hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50">
                  <h2 className="text-md font-semibold text-gray-900">Nearby Hospitals</h2>
                  <p className="text-xs text-gray-500 mt-1">{locationStatus}</p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <input 
                      type="text" 
                      value={manualLocation}
                      onChange={(e) => setManualLocation(e.target.value)}
                      placeholder="Enter City & PIN (e.g., Delhi, 110001)" 
                      className="px-3 py-1.5 w-full border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                      onKeyDown={(e) => e.key === 'Enter' && handleManualHospitalSearch()}
                    />
                    <button onClick={handleManualHospitalSearch} disabled={fetchingHospitals} className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
                      {fetchingHospitals ? '...' : 'Search'}
                    </button>
                  </div>
                </div>

                <div className="p-2 max-h-[320px] overflow-y-auto">
                  {fetchingHospitals ? (
                    <div className="p-6 text-center text-gray-500">
                      <svg className="animate-spin h-5 w-5 mx-auto mb-2 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span className="text-sm">Searching...</span>
                    </div>
                  ) : (hospitals && hospitals.length > 0) ? (
                    <ul className="divide-y divide-gray-100">
                      {hospitals.map((h, i) => (
                        <li key={i} className="p-3 hover:bg-gray-50 transition-colors rounded-lg">
                          <h3 className="font-semibold text-gray-900 text-sm">{h.name}</h3>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1" title={h.address}>{h.address}</p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {h.distance || "N/A"}
                            </span>
                            <div className="flex gap-1.5">
                              {h.contact && h.contact !== "N/A" && (
                                <a href={`tel:${h.contact}`} className="p-1.5 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100 transition" title="Call">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </a>
                              )}
                              <a href={`https://maps.google.com/?q=${encodeURIComponent(h.name + ' ' + h.address)}`} target="_blank" rel="noopener noreferrer" className="p-1.5 border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition" title="Directions">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                              </a>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No hospitals found.
                    </div>
                  )}
                </div>


                <div className="border-t border-gray-100 p-4 bg-red-50/50">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Emergency (India)</h3>
                  <div className="flex flex-col gap-2">

                    <a href="tel:102" className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-red-300 transition text-sm">
                      <span className="font-medium text-gray-900">Ambulance</span>
                      <span className="text-red-600 font-bold">102</span>
                    </a>
                    <a href="tel:108" className="flex items-center justify-between px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-red-300 transition text-sm">
                      <span className="font-medium text-gray-900">Medical Helpline</span>
                      <span className="text-red-600 font-bold">108</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>


        <div className="mt-8 pt-6 border-t border-gray-200 text-center print:hidden">
          <p className="text-xs text-gray-500 font-medium max-w-2xl mx-auto">
            This AI tool provides guidance only and is not a substitute for professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
