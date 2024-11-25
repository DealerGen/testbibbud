import React, { useState, useEffect, useCallback } from 'react';
import { Sliders, PoundSterling, Calendar, Gauge, Star, Clock, Users, FileCheck } from 'lucide-react';
import { BiddingParameters, serviceHistoryOptions } from '../types';
import { useCarData } from '../context/CarDataContext';
import { debounce } from 'lodash-es';

interface ParameterSettingsProps {
  onParametersChange: (newParameters: BiddingParameters) => void;
  initialParameters: BiddingParameters;
}

const ParameterSettings: React.FC<ParameterSettingsProps> = ({ onParametersChange, initialParameters }) => {
  const { cars } = useCarData();
  const [parameters, setParameters] = useState<BiddingParameters>(initialParameters);

  useEffect(() => {
    setParameters(initialParameters);
  }, [initialParameters]);

  const debouncedOnParametersChange = useCallback(
    debounce((newParameters: BiddingParameters) => {
      onParametersChange(newParameters);
    }, 300),
    [onParametersChange]
  );

  const handleChange = (key: keyof BiddingParameters, value: number | string[]) => {
    const newParameters = { ...parameters, [key]: value };
    setParameters(newParameters);
    debouncedOnParametersChange(newParameters);
  };

  const handleServiceHistoryChange = (option: string) => {
    const newServiceHistory = parameters.serviceHistory.includes(option)
      ? parameters.serviceHistory.filter(item => item !== option)
      : [...parameters.serviceHistory, option];
    handleChange('serviceHistory', newServiceHistory);
  };

  const maxReserveBuyNowPrice = Math.max(...cars.map(car => parseFloat(car.reserveOrBuyNowPrice) || 0));
  const currentYear = new Date().getFullYear();
  const maxAge = Math.max(...cars.map(car => currentYear - (car.carYear || currentYear)));
  const maxMileage = Math.max(...cars.map(car => car.mileage || 0));
  const minRetailRating = Math.min(...cars.map(car => car.autoTraderRetailRating || 100));
  const maxDaysToSell = Math.max(...cars.map(car => car.daysToSell || 0));
  const maxPreviousOwners = Math.max(...cars.map(car => car.previousOwnersCount || 0));

  return (
    <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-6 rounded-lg shadow-lg mb-8 text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Sliders className="mr-2" /> Bidding Parameters
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium mb-1 flex items-center">
            <PoundSterling className="mr-2" /> Maximum Price: £{parameters.maxPrice.toLocaleString()}
          </label>
          <input
            type="range"
            id="maxPrice"
            min="0"
            max={maxReserveBuyNowPrice}
            step="1000"
            value={parameters.maxPrice}
            onChange={(e) => handleChange('maxPrice', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="maxAge" className="block text-sm font-medium mb-1 flex items-center">
            <Calendar className="mr-2" /> Maximum Age: {parameters.maxAge} years
          </label>
          <input
            type="range"
            id="maxAge"
            min="0"
            max={maxAge}
            value={parameters.maxAge}
            onChange={(e) => handleChange('maxAge', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="maxMileage" className="block text-sm font-medium mb-1 flex items-center">
            <Gauge className="mr-2" /> Maximum Mileage: {parameters.maxMileage.toLocaleString()} miles
          </label>
          <input
            type="range"
            id="maxMileage"
            min="0"
            max={maxMileage}
            step="1000"
            value={parameters.maxMileage}
            onChange={(e) => handleChange('maxMileage', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="minRetailRating" className="block text-sm font-medium mb-1 flex items-center">
            <Star className="mr-2" /> Minimum Retail Rating: {parameters.minRetailRating}
          </label>
          <input
            type="range"
            id="minRetailRating"
            min={minRetailRating}
            max="100"
            value={parameters.minRetailRating}
            onChange={(e) => handleChange('minRetailRating', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="maxDaysToSell" className="block text-sm font-medium mb-1 flex items-center">
            <Clock className="mr-2" /> Maximum Days to Sell: {parameters.maxDaysToSell} days
          </label>
          <input
            type="range"
            id="maxDaysToSell"
            min="0"
            max={maxDaysToSell}
            value={parameters.maxDaysToSell}
            onChange={(e) => handleChange('maxDaysToSell', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="maxPreviousOwners" className="block text-sm font-medium mb-1 flex items-center">
            <Users className="mr-2" /> Maximum Previous Owners: {parameters.maxPreviousOwners}
          </label>
          <input
            type="range"
            id="maxPreviousOwners"
            min="0"
            max={maxPreviousOwners}
            value={parameters.maxPreviousOwners}
            onChange={(e) => handleChange('maxPreviousOwners', Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-2 flex items-center">
            <FileCheck className="mr-2" /> Service History
          </label>
          <div className="flex flex-wrap gap-2">
            {serviceHistoryOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleServiceHistoryChange(option)}
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  parameters.serviceHistory.includes(option)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {option.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParameterSettings;