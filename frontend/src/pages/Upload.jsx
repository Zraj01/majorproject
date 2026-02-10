import { useState, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const DISEASE_LABELS = {
  PNEUMONIA: 'Pneumonia Detection',
  TB: 'Tuberculosis Detection',
};

const ANALYSIS_STEPS = [
  'AI model preprocessing',
  'Deep learning analysis',
  'Confidence scoring',
  'Report generation',
];

const IMAGE_REQUIREMENTS = [
  'Clear chest X-ray images only',
  'High resolution preferred (min 512x512)',
  'Supported formats: JPG, PNG, DICOM',
  'File size limit: 50MB',
];

const ABOUT_PNEUMONIA = 'Our AI model is trained on thousands of chest X-rays and can detect pneumonia with 95% accuracy. The analysis identifies characteristic patterns and opacity changes in lung tissue.';
const ABOUT_TB = 'Our AI model uses deep learning to detect tuberculosis from chest X-rays with 92% accuracy. It analyzes lung patterns and opacity to assist in early TB screening.';

export default function Upload() {
  const { diseaseType } = useParams();
  const navigate = useNavigate();
  const normalizedType = (diseaseType || '').toUpperCase();
  const isPneumonia = normalizedType === 'PNEUMONIA';
  const isTB = normalizedType === 'TB';

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  if (!isPneumonia && !isTB) {
    navigate('/dashboard');
    return null;
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer?.files?.[0];
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setError('');
    } else {
      setError('Please select an image file (JPG, PNG).');
    }
  };

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('diseaseType', normalizedType);
      const { data } = await api.post('/api/predictions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/result/${data.prediction.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const aboutText = isPneumonia ? ABOUT_PNEUMONIA : ABOUT_TB;
  const subtitle = isPneumonia
    ? 'Upload a chest X-ray for pneumonia analysis'
    : 'Upload a chest X-ray for tuberculosis analysis';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{DISEASE_LABELS[normalizedType]}</h1>
        <p className="text-gray-600 mt-1">{subtitle}</p>

        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          {/* Upload card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload X-ray Image</h2>
            <form onSubmit={handleSubmit}>
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                  dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                {preview ? (
                  <div className="space-y-4">
                    <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                    <p className="text-sm text-gray-600">{file?.name}</p>
                    <button
                      type="button"
                      onClick={() => { setFile(null); setPreview(null); }}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="mt-4 font-medium text-gray-700">Upload X-ray Image</p>
                    <p className="mt-1 text-sm text-gray-500">Drag and drop your image, or click to browse</p>
                  </>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="mt-4 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition"
                >
                  Choose File
                </button>
              </div>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={!file || loading}
                className="mt-4 w-full py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 transition"
              >
                {loading ? 'Analyzing...' : 'Upload & Analyze'}
              </button>
            </form>
          </div>

          {/* Analysis info card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis Information</h2>

            <div className="rounded-xl bg-primary-50 p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-gray-900">Image Requirements</span>
              </div>
              <ul className="space-y-1 text-sm text-gray-700">
                {IMAGE_REQUIREMENTS.map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Analysis Process</h3>
              <ul className="space-y-2">
                {ANALYSIS_STEPS.map((step, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-purple-50 p-4">
              <h3 className="font-medium text-gray-900 mb-2">About {DISEASE_LABELS[normalizedType]}</h3>
              <p className="text-sm text-gray-700">{aboutText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
