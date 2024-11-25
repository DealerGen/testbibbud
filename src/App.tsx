import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DataUploadPage from './components/DataUploadPage';
import DraggableFunnel from './components/DraggableFunnel';
import Statistics from './components/Statistics';
import ProfitCalculatorPage from './components/ProfitCalculatorPage';
import BiddingParametersPage from './components/BiddingParametersPage';
import AllBidsPage from './components/AllBidsPage';
import WhatsAppPage from './components/WhatsAppPage';
import ErrorBoundary from './components/ErrorBoundary';
import { BiddingParameters } from './types';

const App: React.FC = () => {
  const [showUploadPage, setShowUploadPage] = useState(false);
  const navigate = useNavigate();

  const [parameters, setParameters] = useState<BiddingParameters>(() => {
    const savedParams = localStorage.getItem('biddingParameters');
    return savedParams ? JSON.parse(savedParams) : {
      maxPrice: 160000,
      maxAge: 53,
      maxMileage: 250162,
      minRetailRating: 1,
      maxDaysToSell: 136,
      maxPreviousOwners: 15,
      serviceHistory: ['full_mixed', 'full_main_dealer', 'part', 'none', 'full_independent', 'not_due'],
    };
  });

  const updateCarWonPrice = (carId: string, wonPrice: number) => {
    // This will be handled by CarDataContext
  };

  const handleToggleUpload = () => {
    navigate('/upload');
  };

  const handleReset = () => {
    navigate('/');
  };

  const handleToggleProfitCalculator = () => {
    navigate('/profit-calculator');
  };

  const handleToggleParameters = () => {
    navigate('/bidding-parameters');
  };

  const handleToggleAllBids = () => {
    navigate('/all-bids');
  };

  const handleToggleWhatsApp = () => {
    navigate('/whatsapp');
  };

  const handleParametersChange = (newParameters: BiddingParameters) => {
    setParameters(newParameters);
    localStorage.setItem('biddingParameters', JSON.stringify(newParameters));
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <Sidebar
          onToggleUpload={handleToggleUpload}
          onReset={handleReset}
          onToggleProfitCalculator={handleToggleProfitCalculator}
          onToggleParameters={handleToggleParameters}
          onToggleAllBids={handleToggleAllBids}
          onToggleWhatsApp={handleToggleWhatsApp}
        />
        <main className="lg:ml-[200px] min-h-screen transition-all duration-300">
          <div className="container mx-auto py-8 px-4">
            <Routes>
              <Route path="/" element={
                <>
                  <Statistics />
                  <DraggableFunnel 
                    updateCarWonPrice={updateCarWonPrice} 
                    updateColumns={() => {}}
                    parameters={parameters}
                    onParametersChange={handleParametersChange}
                  />
                </>
              } />
              
              <Route path="/upload" element={
                <DataUploadPage onUploadComplete={() => setShowUploadPage(false)} />
              } />
              
              <Route path="/profit-calculator" element={<ProfitCalculatorPage />} />
              
              <Route path="/bidding-parameters" element={
                <BiddingParametersPage 
                  parameters={parameters} 
                  onParametersChange={handleParametersChange} 
                />
              } />

              <Route path="/all-bids" element={<AllBidsPage />} />
              <Route path="/whatsapp" element={<WhatsAppPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;