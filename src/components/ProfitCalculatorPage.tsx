import React from 'react';
import ProfitCalculator from './ProfitCalculator';

const ProfitCalculatorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900">
      <main className="lg:ml-[200px] min-h-screen py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-white">Profit Calculator</h1>
        <div className="card p-6">
          <ProfitCalculator />
        </div>
      </main>
    </div>
  );
};

export default ProfitCalculatorPage;