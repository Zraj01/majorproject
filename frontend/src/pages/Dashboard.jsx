import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cards = [
  {
    title: 'Pneumonia Detection',
    description: 'AI-powered pneumonia detection from chest X-rays with 95% accuracy.',
    features: ['Fast AI-powered analysis', 'Detailed medical reports', 'Hospital recommendations'],
    accuracy: '95%',
    color: 'blue',
    path: '/upload/PNEUMONIA',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: 'Tuberculosis Detection',
    description: 'Advanced TB detection using deep learning algorithms.',
    features: ['Fast AI-powered analysis', 'Detailed medical reports', 'Hospital recommendations'],
    accuracy: '92%',
    color: 'green',
    path: '/upload/TB',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Welcome, {user?.email}</h1>
            <p className="text-gray-600 text-sm mt-0.5">Select a disease detection service to continue.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-gray-600 text-sm">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {user?.email}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-gray-500 hover:text-primary-600 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-300"
            >
              <div
                className={`h-24 flex items-center justify-between px-6 ${
                  card.color === 'blue' ? 'bg-primary-600' : 'bg-emerald-600'
                }`}
              >
                <span className="text-white">{card.icon}</span>
                <div className="text-right text-white">
                  <span className="text-xs opacity-90">Accuracy</span>
                  <p className="text-2xl font-bold">{card.accuracy} Accuracy</p>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition">{card.title}</h2>
                <p className="mt-2 text-gray-600 text-sm">{card.description}</p>
                <ul className="mt-4 space-y-2">
                  {card.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <span
                  className={`mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white ${
                    card.color === 'blue' ? 'bg-primary-600 group-hover:bg-primary-700' : 'bg-emerald-600 group-hover:bg-emerald-700'
                  } transition`}
                >
                  Start Analysis <span>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
        <p className="text-center text-gray-500 text-sm mt-12">Trusted by Healthcare Professionals</p>
      </main>
    </div>
  );
}
