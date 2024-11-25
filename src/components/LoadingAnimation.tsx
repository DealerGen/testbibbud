import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        <div className="mt-4 text-xl font-semibold text-white">Processing Data...</div>
        <div className="mt-2 text-sm text-gray-300">BidBuddy AI is analyzing your vehicles</div>
      </div>
    </div>
  );
};

export default LoadingAnimation;