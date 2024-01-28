import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-900 bg-gray-100 space-y-3">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-12 h-12 text-blue-500 stroke-current transform hover:scale-125 transition-transform duration-200 ease-in-out" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 17V5a2 2 0 012-2h6l2 4h4a2 2 0 012 2v10a2 2 0 01-2 2h-1m-1-2h-4M6 9h.01M6 12h.01M10 12h.01M6 15h.01M10 15h.01M14 13h3m-3-2h2m-2 2a2 2 0 100 4h2a2 2 0 100-4h-2z" />
      </svg>
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl">We couldn't find the page you're looking for.</p>
      <p className="text-xl">It seems like you're trying to reach a level that doesn't exist...</p>
      <button onClick={goBack} className="px-4 py-2 mt-5 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-200 ease-in-out">Go Back</button>
    </div>
  );
}
