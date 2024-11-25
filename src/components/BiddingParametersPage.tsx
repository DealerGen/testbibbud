import React from 'react';
import { useNavigate } from 'react-router-dom';
import ParameterSettings from './ParameterSettings';
import { BiddingParameters } from '../types';
import { Save } from 'lucide-react';

interface BiddingParametersPageProps {
  parameters: BiddingParameters;
  onParametersChange: (newParameters: BiddingParameters) => void;
}

const BiddingParametersPage: React.FC<BiddingParametersPageProps> = ({ parameters, onParametersChange }) => {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Bidding Parameters</h1>
      <ParameterSettings
        onParametersChange={onParametersChange}
        initialParameters={parameters}
      />
      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Save size={20} className="mr-2" />
          Save and Return
        </button>
      </div>
    </div>
  );
};

export default BiddingParametersPage;