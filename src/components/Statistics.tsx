import React from 'react';
import { useCarData } from '../context/CarDataContext';
import { BarChart, PoundSterling, TrendingUp, Clock } from 'lucide-react';

const Statistics: React.FC = () => {
  const { cars } = useCarData();

  const totalCars = cars.length;
  const qualifiedCars = cars.filter(car => car.status === 'qualified').length;
  const bidCars = cars.filter(car => car.status === 'bid').length;
  const wonCars = cars.filter(car => car.status === 'won').length;

  const averageRetailPrice = cars.length > 0
    ? cars.reduce((sum, car) => sum + (car.retailValuation || 0), 0) / cars.length
    : 0;

  const averageReservePrice = cars.length > 0
    ? cars.reduce((sum, car) => sum + (parseFloat(car.reserveOrBuyNowPrice) || 0), 0) / cars.length
    : 0;

  const averageAutoTraderRetailRating = cars.length > 0
    ? cars.reduce((sum, car) => sum + (car.autoTraderRetailRating || 0), 0) / cars.length
    : 0;

  const averageDaysToSell = cars.length > 0
    ? cars.reduce((sum, car) => sum + (car.daysToSell || 0), 0) / cars.length
    : 0;

  const winRate = bidCars > 0 ? (wonCars / bidCars) * 100 : 0;

  return (
    <div className="stats-card mb-8 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <BarChart className="mr-2" /> Bidding Statistics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="card p-6 hover:scale-102 transition-all">
          <h3 className="text-lg font-semibold mb-2">Total Cars</h3>
          <p className="text-3xl font-bold">{totalCars}</p>
          <p className="text-sm text-indigo-200">Qualified: {qualifiedCars}</p>
        </div>
        <div className="card p-6 hover:scale-102 transition-all">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <PoundSterling className="mr-1" /> Average Retail Price
          </h3>
          <p className="text-3xl font-bold">£{averageRetailPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="card p-6 hover:scale-102 transition-all">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <PoundSterling className="mr-1" /> Average Reserve Price
          </h3>
          <p className="text-3xl font-bold">£{averageReservePrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="card p-6 hover:scale-102 transition-all">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Clock className="mr-1" /> Average Days to Sell
          </h3>
          <p className="text-3xl font-bold">{averageDaysToSell.toFixed(1)} days</p>
        </div>
        <div className="card p-6 hover:scale-102 transition-all">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <TrendingUp className="mr-1" /> Win Rate
          </h3>
          <p className="text-3xl font-bold">{winRate.toFixed(1)}%</p>
          <p className="text-sm text-indigo-200">Won: {wonCars} / Bid: {bidCars}</p>
        </div>
        <div className="card p-6 hover:scale-102 transition-all">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <TrendingUp className="mr-1" /> Avg. Auto Trader Retail Rating
          </h3>
          <p className="text-3xl font-bold">{averageAutoTraderRetailRating.toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;