import React, { useState, useCallback } from 'react';
import { useCarData } from '../context/CarDataContext';
import { Car } from '../types';
import { Calculator } from 'lucide-react';

interface ProfitInputs {
  delivery: number;
  mot: number;
  service: number;
  cosmetic: number;
  warrantyAndValet: number;
  desiredNetProfit: number;
}

const AdminPage: React.FC = () => {
  const { cars } = useCarData();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [profitInputs, setProfitInputs] = useState<ProfitInputs>({
    delivery: 0,
    mot: 0,
    service: 0,
    cosmetic: 0,
    warrantyAndValet: 0,
    desiredNetProfit: 0,
  });
  const [profitCalculation, setProfitCalculation] = useState<any>(null);

  const calculateProfit = useCallback((car: Car, inputs: ProfitInputs) => {
    const retailValuation = car.retailValuation || 0;
    const carwowFee = retailValuation * 0.05; // Assuming 5% Carwow fee

    // Calculate the bid price that achieves the exact desired net profit
    const totalCosts = carwowFee + inputs.delivery + inputs.mot + inputs.service + 
                       inputs.cosmetic + inputs.warrantyAndValet;
    const requiredGrossProfit = inputs.desiredNetProfit * 1.2; // Account for VAT (20%)
    const bidPrice = retailValuation - requiredGrossProfit - totalCosts;

    // Recalculate actual gross profit and VAT
    const actualGrossProfit = retailValuation - bidPrice;
    const vatAmount = actualGrossProfit / 6; // VAT is 1/6 of the gross profit (equivalent to 20% of the net amount)
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

  const handleCarSelect = (car: Car) => {
    setSelectedCar(car);
    if (car) {
      const result = calculateProfit(car, profitInputs);
      setProfitCalculation(result);
    } else {
      setProfitCalculation(null);
    }
  };

  const handleInputChange = (key: keyof ProfitInputs, value: number) => {
    setProfitInputs(prev => ({ ...prev, [key]: value }));
    if (selectedCar) {
      const result = calculateProfit(selectedCar, { ...profitInputs, [key]: value });
      setProfitCalculation(result);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
      <h2 className="text-2xl font-bold text-white mb-4">Profit Calculator</h2>

      <div className="mb-6 bg-gray-700 p-4 rounded-lg">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Calculator className="mr-2" /> Profit Calculator
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Select Vehicle</label>
            <select
              value={selectedCar?.id || ''}
              onChange={(e) => handleCarSelect(cars.find(car => car.id === e.target.value) || null)}
              className="w-full bg-gray-600 text-white px-3 py-2 rounded"
            >
              <option value="">Select a vehicle</option>
              {cars.map(car => (
                <option key={car.id} value={car.id}>
                  {car.make} {car.model} ({car.id})
                </option>
              ))}
            </select>
          </div>
        </div>
        {selectedCar && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Retail Valuation</label>
              <input
                type="number"
                value={selectedCar.retailValuation || 0}
                readOnly
                className="w-full bg-gray-600 text-white px-3 py-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Carwow Fee</label>
              <input
                type="number"
                value={(selectedCar.retailValuation || 0) * 0.05}
                readOnly
                className="w-full bg-gray-600 text-white px-3 py-2 rounded"
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(profitInputs).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-1">{key}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleInputChange(key as keyof ProfitInputs, Number(e.target.value))}
                className="w-full bg-gray-600 text-white px-3 py-2 rounded"
              />
            </div>
          ))}
        </div>
        {profitCalculation && (
          <div className="text-white mt-4">
            <h4 className="font-bold mb-2">Calculation Results:</h4>
            <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(profitCalculation.calculation, null, 2)}
            </pre>
            <p className="mt-2">Recommended Bid Price: £{profitCalculation.bidPrice}</p>
            <p className="mt-2">Actual Net Profit: £{profitCalculation.actualNetProfit}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;