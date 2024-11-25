import React, { useState, useCallback, useEffect } from 'react';
import { useCarData } from '../context/CarDataContext';
import { Car } from '../types';
import { Calculator, PoundSterling, Truck, Wrench, Paintbrush, Shield, Target } from 'lucide-react';

interface ProfitInputs {
  delivery: number;
  mot: number;
  service: number;
  cosmetic: number;
  warrantyAndValet: number;
  desiredNetProfit: number;
}

const getCarwowFee = (price: number): number => {
  if (price <= 2499) return 199;
  if (price <= 4999) return 249;
  if (price <= 7499) return 269;
  if (price <= 9999) return 299;
  if (price <= 14999) return 319;
  if (price <= 19999) return 339;
  if (price <= 29999) return 389;
  if (price <= 39999) return 449;
  if (price <= 49999) return 499;
  if (price <= 59999) return 599;
  if (price <= 69999) return 699;
  if (price <= 79999) return 799;
  if (price <= 89999) return 899;
  if (price <= 99999) return 929;
  return 999;
};

const ProfitCalculator: React.FC = () => {
  const { cars } = useCarData();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [overriddenRetailValuation, setOverriddenRetailValuation] = useState<number | null>(null);
  const [profitInputs, setProfitInputs] = useState<ProfitInputs>({
    delivery: 0,
    mot: 0,
    service: 0,
    cosmetic: 0,
    warrantyAndValet: 0,
    desiredNetProfit: 0,
  });
  const [profitCalculation, setProfitCalculation] = useState<any>(null);

  // Filter only qualified cars
  const qualifiedCars = cars.filter(car => car.status === 'qualified');

  const calculateProfit = useCallback((car: Car, inputs: ProfitInputs, overriddenValue: number | null) => {
    const retailValuation = overriddenValue !== null ? overriddenValue : (car.retailValuation || 0);
    const carwowFee = getCarwowFee(retailValuation);

    const totalCosts = carwowFee + inputs.delivery + inputs.mot + inputs.service + 
                       inputs.cosmetic + inputs.warrantyAndValet;
    const requiredGrossProfit = inputs.desiredNetProfit * 1.2; // Account for VAT (20%)
    const bidPrice = retailValuation - (6/5) * (inputs.desiredNetProfit + totalCosts);

    const actualGrossProfit = retailValuation - bidPrice;
    const vatAmount = actualGrossProfit / 6; // VAT is 1/6 of the gross profit
    const actualNetProfit = actualGrossProfit - vatAmount - totalCosts;

    return {
      retailValuation: retailValuation.toFixed(2),
      carwowFee: carwowFee.toFixed(2),
      bidPrice: bidPrice.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      actualNetProfit: actualNetProfit.toFixed(2),
      calculation: {
        retailValuation,
        carwowFee,
        totalCosts,
        delivery: inputs.delivery,
        mot: inputs.mot,
        service: inputs.service,
        cosmetic: inputs.cosmetic,
        warrantyAndValet: inputs.warrantyAndValet,
        desiredNetProfit: inputs.desiredNetProfit,
        bidPrice,
        actualGrossProfit,
        vatAmount,
        actualNetProfit
      }
    };
  }, []);

  const handleCarSelect = (car: Car | null) => {
    console.log("handleCarSelect called with car:", car);
    setSelectedCar(car);
    setOverriddenRetailValuation(null);
    if (car) {
      setProfitCalculation(null); // Reset calculation when a new car is selected
    }
  };

  const handleInputChange = (key: keyof ProfitInputs, value: number) => {
    setProfitInputs(prev => ({ ...prev, [key]: value }));
  };

  const handleRetailValuationChange = (value: number) => {
    setOverriddenRetailValuation(value);
  };

  const handleCalculate = () => {
    if (selectedCar) {
      const result = calculateProfit(selectedCar, profitInputs, overriddenRetailValuation);
      setProfitCalculation(result);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
  };

  return (
    <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-6 rounded-lg shadow-lg text-white">
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <Calculator className="mr-2" /> Profit Calculator
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Select Qualified Vehicle</label>
          <select
            value={selectedCar?.id || ''}
            onChange={(e) => {
              const selectedCarId = e.target.value;
              console.log("Selected car ID:", selectedCarId);
              const car = qualifiedCars.find(car => car.id === selectedCarId);
              console.log("Found car:", car);
              handleCarSelect(car || null);
            }}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded"
          >
            <option value="">Select a vehicle</option>
            {qualifiedCars.map(car => (
              <option key={car.id} value={car.id}>
                {car.make} {car.model} ({car.id})
              </option>
            ))}
          </select>
        </div>
        {selectedCar && (
          <div>
            <label className="block text-sm font-medium mb-1">Retail Valuation</label>
            <div className="relative">
              <input
                type="number"
                value={overriddenRetailValuation !== null ? overriddenRetailValuation : (selectedCar.retailValuation || 0)}
                onChange={(e) => handleRetailValuationChange(Number(e.target.value))}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded"
              />
              {overriddenRetailValuation !== null && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                  Original: {formatCurrency(selectedCar.retailValuation || 0)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {selectedCar && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputField
            icon={<Truck size={20} />}
            label="Delivery"
            value={profitInputs.delivery}
            onChange={(value) => handleInputChange('delivery', value)}
          />
          <InputField
            icon={<Wrench size={20} />}
            label="MOT"
            value={profitInputs.mot}
            onChange={(value) => handleInputChange('mot', value)}
          />
          <InputField
            icon={<Wrench size={20} />}
            label="Service"
            value={profitInputs.service}
            onChange={(value) => handleInputChange('service', value)}
          />
          <InputField
            icon={<Paintbrush size={20} />}
            label="Cosmetic"
            value={profitInputs.cosmetic}
            onChange={(value) => handleInputChange('cosmetic', value)}
          />
          <InputField
            icon={<Shield size={20} />}
            label="Warranty & Valet"
            value={profitInputs.warrantyAndValet}
            onChange={(value) => handleInputChange('warrantyAndValet', value)}
          />
          <InputField
            icon={<Target size={20} />}
            label="Desired Net Profit"
            value={profitInputs.desiredNetProfit}
            onChange={(value) => handleInputChange('desiredNetProfit', value)}
          />
        </div>
      )}
      {selectedCar && (
        <div className="mt-6">
          <button
            onClick={handleCalculate}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Calculate Profit
          </button>
        </div>
      )}
      {profitCalculation && (
        <div className="mt-6">
          <h4 className="text-xl font-semibold mb-4">Calculation Results:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ResultItem label="Retail Valuation" value={formatCurrency(parseFloat(profitCalculation.retailValuation))} />
            <ResultItem label="Carwow Fee" value={formatCurrency(parseFloat(profitCalculation.carwowFee))} />
            <ResultItem label="Recommended Bid Price" value={formatCurrency(parseFloat(profitCalculation.bidPrice))} />
            <ResultItem label="VAT Amount" value={formatCurrency(parseFloat(profitCalculation.vatAmount))} />
            <ResultItem label="Actual Net Profit" value={formatCurrency(parseFloat(profitCalculation.actualNetProfit))} />
          </div>
        </div>
      )}
    </div>
  );
};

const InputField: React.FC<{ icon: React.ReactNode; label: string; value: number; onChange: (value: number) => void }> = ({ icon, label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1 flex items-center">
      {icon}
      <span className="ml-2">{label}</span>
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full bg-gray-700 text-white px-3 py-2 rounded"
    />
  </div>
);

const ResultItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-gray-700 p-3 rounded">
    <p className="text-sm text-gray-300">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

export default ProfitCalculator;