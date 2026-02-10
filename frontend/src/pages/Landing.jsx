import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900">MediScan AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-primary-600 transition">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition">How it Works</a>
            <a href="#about" className="text-gray-600 hover:text-primary-600 transition">About</a>
          </div>
          <Link
            to="/login"
            className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition shadow-sm"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 sm:px-6 max-w-6xl mx-auto md:flex md:items-center md:gap-12">
        <div className="flex-1 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            AI-Powered{' '}
            <span className="text-primary-700">Chest Disease</span>{' '}
            Detection
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-xl">
            Revolutionary medical AI that analyzes chest X-rays to detect pneumonia and tuberculosis with 95% accuracy. Get instant, reliable results from anywhere.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition shadow-md"
            >
              Start Analysis <span className="text-lg">→</span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-primary-500 hover:text-primary-600 transition"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="flex-1 mt-12 md:mt-0 flex justify-center">
          <div className="w-full max-w-md bg-gradient-to-br from-primary-50 to-cyan-50 rounded-2xl shadow-xl p-6 border border-primary-100">
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-cyan-100 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
                <span className="text-sm text-gray-500">Sample Analysis</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Analysis Status</span>
                <span className="flex items-center gap-1 text-green-600 font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"> <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /> </svg>
                  Complete
                </span>
              </div>
              <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                <div className="h-full w-full bg-primary-500 rounded-full" />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold text-primary-700">95% Confidence</p>
            <p className="text-sm text-gray-600">Pneumonia Detection</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">Features</h2>
          <p className="text-center text-gray-600 mt-2 max-w-2xl mx-auto">Everything you need for reliable chest disease screening.</p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Pneumonia Detection', desc: 'AI-powered analysis of chest X-rays for pneumonia with high accuracy.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
              { title: 'TB Detection', desc: 'Advanced tuberculosis detection using deep learning on chest radiographs.', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
              { title: 'Instant Reports', desc: 'Get detailed reports with confidence scores and recommendations.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { title: 'Secure & Private', desc: 'Your data is encrypted and handled with strict privacy standards.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
              { title: 'Hospital Recommendations', desc: 'Find nearby specialists based on your analysis results.', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' },
              { title: 'Access Anywhere', desc: 'Use the platform from any device with an internet connection.', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition animate-slide-up">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} /></svg>
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">How It Works</h2>
          <p className="text-center text-gray-600 mt-2 max-w-2xl mx-auto">Three simple steps to get your chest X-ray analyzed.</p>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload X-ray', desc: 'Sign in and choose Pneumonia or TB detection. Upload a clear chest X-ray image (JPG, PNG, or DICOM).' },
              { step: '2', title: 'AI Analysis', desc: 'Our model preprocesses the image, runs deep learning analysis, and generates a confidence score.' },
              { step: '3', title: 'Get Report', desc: 'View your result (Positive/Negative), confidence percentage, and recommendations.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary-600 text-white font-bold text-xl flex items-center justify-center mx-auto">{item.step}</div>
                <h3 className="mt-4 font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">About MediScan AI</h2>
          <p className="mt-6 text-gray-600 leading-relaxed">
            MediScan AI is an automated chest disease detection system designed to assist healthcare professionals and patients. Our AI is trained on thousands of chest X-rays to detect pneumonia and tuberculosis with high accuracy. This tool is meant to support, not replace, professional medical diagnosis. Always consult a doctor for final diagnosis and treatment.
          </p>
          <p className="mt-4 text-gray-600 leading-relaxed">
            We prioritize security and privacy. Your images and results are stored securely and used only to generate your report. Our goal is to make quality screening more accessible and faster.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
          <p className="mt-4 text-primary-100">Create an account and upload your first chest X-ray in minutes.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-gray-500 text-sm">© {new Date().getFullYear()} MediScan AI. Automated Chest Disease Detection.</span>
          <div className="flex gap-6">
            <a href="#features" className="text-gray-500 hover:text-primary-600 text-sm">Features</a>
            <a href="#how-it-works" className="text-gray-500 hover:text-primary-600 text-sm">How it Works</a>
            <a href="#about" className="text-gray-500 hover:text-primary-600 text-sm">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
