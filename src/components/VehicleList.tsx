import React, { useState, useMemo, useCallback } from 'react';
import { Car } from '../types';
import { ArrowUpDown, PoundSterling, Gauge, Star, Calendar, Clock, Link as LinkIcon, Eye, Users } from 'lucide-react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import CarDetails from './CarDetails';

type SortKey = keyof Car;

interface VehicleListProps {
  cars: Car[];
}

const VehicleList: React.FC<VehicleListProps> = ({ cars }) => {
  const [sortKey, setSortKey] = useState<SortKey>('reserveOrBuyNowPrice');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const sortedCars = useMemo(() => {
    return [...cars].sort((a, b) => {
      let aValue = a[sortKey];
      let bValue = b[sortKey];

      // Convert string numbers to actual numbers for proper sorting
      if (typeof aValue === 'string' && !isNaN(Number(aValue))) {
        aValue = Number(aValue);
      }
      if (typeof bValue === 'string' && !isNaN(Number(bValue))) {
        bValue = Number(bValue);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [cars, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder(key === 'daysToSell' ? 'asc' : 'desc');
    }
  };

  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value?.toString() || 'N/A';
  };

  const formatPrice = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const car = sortedCars[index];
    return (
      <div 
        style={style} 
        className="flex items-center border-b border-gray-700 hover:bg-gray-700 cursor-pointer text-sm"
      >
        <div className="flex-1 p-2">{car.make}</div>
        <div className="flex-1 p-2" title={`${car.model}`}>{truncateText(`${car.model}`, 20)}</div>
        <div className="flex-1 p-2">{formatValue(car.carYear)}</div>
        <div className="flex-1 p-2">{formatPrice(car.reserveOrBuyNowPrice)}</div>
        <div className="flex-1 p-2">{formatValue(car.mileage)}</div>
        <div className="flex-1 p-2">{formatValue(car.autoTraderRetailRating)}</div>
        <div className="flex-1 p-2">{car.retailValuation ? formatPrice(car.retailValuation) : 'N/A'}</div>
        <div className="flex-1 p-2">{formatValue(car.daysToSell)}</div>
        <div className="flex-1 p-2">{formatValue(car.previousOwnersCount)}</div>
        <div className="flex-1 p-2 flex space-x-2">
          {car.listingUrl && (
            <a
              href={car.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              <LinkIcon size={14} className="mr-1" />
              Link
            </a>
          )}
          <button
            onClick={() => setSelectedCar(car)}
            className="text-green-400 hover:text-green-300 flex items-center"
          >
            <Eye size={14} className="mr-1" />
            View
          </button>
        </div>
      </div>
    );
  }, [sortedCars]);

  if (cars.length === 0) {
    return <div className="text-white">No vehicles to display.</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg overflow-hidden">
      <h2 className="text-2xl font-bold mb-4 text-white">Vehicles ({cars.length})</h2>
      <div className="flex border-b border-gray-700 font-bold text-white text-sm">
        <div className="flex-1 p-2 cursor-pointer" onClick={() => handleSort('make')}>
          Make <ArrowUpDown size={14} className="inline ml-1" />
        </div>
        <div className="flex-1 p-2 cursor-pointer" onClick={() => handleSort('model')}>
          Model <ArrowUpDown size={14} className="inline ml-1" />
        </div>
        <div className="flex-1 p-2 cursor-pointer" onClick={() => handleSort('carYear')}>
          Year <Calendar size={14} className="inline ml-1" />
        </div>
        <div className="flex-1 p-2 cursor-pointer" onClick={() => handleSort('reserveOrBuyNowPrice')}>
          Price <PoundSterling size={14} className="inline ml-1 text-green-400" />
        </div>
        <div className="flex-1 p-2 cursor-pointer" onClick={() => handleSort('mileage')}>
          Mileage <Gauge size={14} className="inline ml-1 text-purple-400" />
        </div>
        <div className="flex-1 p-2 cursor-pointer" onClick={() => handleSort('autoTraderRetailRating')}>
          Rating <Star size={14} className="inline ml-1 text-yellow-400" />
        </div>
        <div className="flex-1 p-2 cursor-pointer" onClick={() => handleSort('retailValuation')}>
          Retail Value <PoundSterling size={14} className="inline ml-1 text-green-400" />
        </div>
        <div className="flex-1 p-2 cursor-pointer" onClick={() => handleSort('daysToSell')}>
          Days to Sell <Clock size={14} className="inline ml-1 text-blue-400" />
        </div>
        <div className="flex-1 p-2 cursor-pointer" onClick={() => handleSort('previousOwnersCount')}>
          Owners <Users size={14} className="inline ml-1 text-orange-400" />
        </div>
        <div className="flex-1 p-2">
          Actions
        </div>
      </div>
      <div style={{ height: 'calc(100vh - 300px)' }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={sortedCars.length}
              itemSize={40}
              width={width}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>
      {selectedCar && (
        <CarDetails car={selectedCar} onClose={() => setSelectedCar(null)} />
      )}
    </div>
  );
};

export default React.memo(VehicleList);