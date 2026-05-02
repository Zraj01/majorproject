import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2563eb] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 3v4a5 5 0 0010 0V3M12 8v8m0 0a3 3 0 100 6 3 3 0 000-6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M7 3h.01M17 3h.01" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">MediScan AI</span>
          </Link>
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-gray-600 font-medium hover:text-[#2563eb] transition">Features</a>
            <a href="#how-it-works" className="text-gray-600 font-medium hover:text-[#2563eb] transition">How it Works</a>
            <a href="#about" className="text-gray-600 font-medium hover:text-[#2563eb] transition">About</a>
          </div>
          <Link
            to="/login"
            className="px-6 py-2.5 bg-[#2563eb] text-white font-medium rounded-xl hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </div>
      </nav>

     
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-br from-blue-50/50 to-transparent -z-10 pointer-events-none"></div>
      <section className="pt-32 pb-20 px-4 sm:px-6 max-w-[1100px] mx-auto md:flex md:items-center md:gap-16 min-h-[calc(100vh-80px)]">
        <div className="flex-1 animate-fade-in z-10 relative">
          <h1 className="text-5xl sm:text-[4rem] font-extrabold text-[#111827] leading-[1.1] tracking-tight">
            <span className="block">AI-Powered</span>
            <span className="block text-[#1d4ed8]">Chest Disease</span>
            <span className="block">Detection</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-xl leading-relaxed">
            Revolutionary medical AI that analyzes chest X-rays to detect pneumonia and tuberculosis with 95% accuracy. Get instant, reliable results from anywhere.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 items-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2563eb] text-white font-medium rounded-xl hover:bg-blue-800 transition"
            >
              Start Analysis <span className="text-sm ml-1 font-bold">&gt;</span>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center px-7 py-3.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="flex-1 mt-16 md:mt-0 flex justify-center relative">

          <div className="absolute inset-0 w-full max-w-[480px] mx-auto hidden sm:block">
            <div className="absolute top-0 -left-6 w-full h-full bg-[#8fbfff] rounded-[2rem] transform -rotate-3 z-0"></div>
            <div className="absolute top-8 left-8 w-full h-full bg-[#62d3bb] rounded-[2rem] transform rotate-3 z-0"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-[480px] bg-white rounded-[2rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-4 sm:p-5 border border-gray-50">
            <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-gray-100 rounded-2xl overflow-hidden mb-6">
              <img src="/stethoscope_heart.png" alt="Stethoscope and Heart" className="w-full h-full object-cover" />
            </div>
            
            <div className="px-2">
              <div className="flex items-center justify-between text-xs sm:text-sm mb-3">
                <span className="text-gray-500">Analysis Status</span>
                <span className="flex items-center gap-1.5 text-[#219653] font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /> </svg>
                  Complete
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[95%] bg-[#4ebdc3] rounded-full" />
              </div>
              
              <div className="mt-6 text-center pb-3">
                <p className="text-2xl font-bold text-gray-900">95% Confidence</p>
                <p className="text-sm text-gray-500 mt-1">Pneumonia Detection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
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
