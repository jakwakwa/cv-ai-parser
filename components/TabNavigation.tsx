'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface TabNavigationProps {
  initialView: 'upload' | 'library';
}

export default function TabNavigation({ initialView }: TabNavigationProps) {
  const router = useRouter();
  const [currentView, setCurrentView] = useState(initialView);

  const handleTabClick = (view: 'upload' | 'library') => {
    setCurrentView(view);
    router.push(view === 'upload' ? '/' : '/library');
  };

  return (
    <div className="w-full flex justify-center space-x-4 mb-8">
      <button
        type="button"
        onClick={() => handleTabClick('upload')}
        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
          currentView === 'upload'
            ? 'bg-teal-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        style={{ height: '30px' }}
      >
        Upload New Resume
      </button>
      <button
        type="button"
        onClick={() => handleTabClick('library')}
        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
          currentView === 'library'
            ? 'bg-teal-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        style={{ height: '30px' }}
      >
        My Resume Library
      </button>
    </div>
  );
}
