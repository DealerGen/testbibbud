import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Car } from '../types';
import { CheckCircle, Gavel, XCircle, Star, Clock, PoundSterling, Gauge, ExternalLink, Users, Trophy, ThumbsDown, Download } from 'lucide-react';

interface BidFunnelProps {
  qualifiedCars: Car[];
  bidCars: Car[];
  noBidCars: Car[];
  wonCars: Car[];
  lostCars: Car[];
  onDragEnd: (result: any) => void;
  onBidPlaced: (carId: string) => void;
  onMarkAsNoBid: (carId: string) => void;
  onMarkAsWon: (carId: string, wonAmount: number) => void;
  onMarkAsLost: (carId: string) => void;
  onMarkAllAsLost: () => void;
}

const BidFunnel: React.FC<BidFunnelProps> = ({ 
  qualifiedCars, 
  bidCars, 
  noBidCars,
  wonCars,
  lostCars,
  onDragEnd, 
  onBidPlaced,
  onMarkAsNoBid,
  onMarkAsWon,
  onMarkAsLost,
  onMarkAllAsLost
}) => {
  const [wonAmount, setWonAmount] = useState<string>('');
  const [showWonPrompt, setShowWonPrompt] = useState<string | null>(null);

  const formatPrice = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return numValue.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });
  };

  const handleWonClick = (carId: string) => {
    setShowWonPrompt(carId);
  };

  const handleWonSubmit = (carId: string) => {
    const amount = parseFloat(wonAmount);
    if (!isNaN(amount)) {
      onMarkAsWon(carId, amount);
      setShowWonPrompt(null);
      setWonAmount('');
    }
  };

  const exportWonCars = () => {
    const csvContent = [
      ['Registration', 'Make', 'Model', 'Year', 'Won Price', 'Retail Price', 'Profit'],
      ...wonCars.map(car => [
        car.id,
        car.make,
        car.model,
        car.carYear,
        car.wonPrice || '',
        car.retailValuation || '',
        car.wonPrice && car.retailValuation ? (car.retailValuation - car.wonPrice).toFixed(2) : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'won_cars.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderCar = (car: Car, index: number, columnId: string) => (
    <Draggable key={car.id} draggableId={car.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-gray-800 p-2 mb-2 rounded-lg cursor-move"
        >
          <p className="text-sm font-semibold">{car.make} {car.model}</p>
          <p className="text-xs text-gray-400">{car.id}</p>
          <div className="flex flex-wrap mt-1 text-xs">
            <span className="mr-2 flex items-center text-yellow-400">
              <Star size={12} className="mr-1" />
              {car.autoTraderRetailRating || 'N/A'}
            </span>
            <span className="mr-2 flex items-center text-blue-400">
              <Clock size={12} className="mr-1" />
              {car.daysToSell || 'N/A'}d
            </span>
            <span className="mr-2 flex items-center text-green-400">
              <PoundSterling size={12} className="mr-1" />
              {formatPrice(car.reserveOrBuyNowPrice)}
            </span>
            <span className="mr-2 flex items-center text-purple-400">
              <Gauge size={12} className="mr-1" />
              {car.mileage?.toLocaleString() || 'N/A'}mi
            </span>
            <span className="flex items-center text-orange-400">
              <Users size={12} className="mr-1" />
              {car.previousOwnersCount !== undefined ? car.previousOwnersCount : 'N/A'}
            </span>
          </div>
          <div className="mt-2 flex justify-between items-center">
            {car.listingUrl && (
              <a
                href={car.listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 flex items-center text-xs"
              >
                <ExternalLink size={12} className="mr-1" />
                View
              </a>
            )}
            <div className="flex space-x-2">
              {columnId === 'qualified' && (
                <button
                  onClick={() => onBidPlaced(car.id)}
                  className="text-blue-400 hover:text-blue-300 flex items-center text-xs"
                >
                  <Gavel size={12} className="mr-1" />
                  Bid
                </button>
              )}
              {columnId === 'bid' && (
                <button
                  onClick={() => handleWonClick(car.id)}
                  className="text-green-400 hover:text-green-300 flex items-center text-xs"
                >
                  <Trophy size={12} className="mr-1" />
                  Won
                </button>
              )}
              {columnId !== 'noBid' && columnId !== 'won' && columnId !== 'lost' && (
                <button
                  onClick={() => onMarkAsNoBid(car.id)}
                  className="text-red-400 hover:text-red-300 flex items-center text-xs"
                >
                  <XCircle size={12} className="mr-1" />
                  No Bid
                </button>
              )}
            </div>
          </div>
          {showWonPrompt === car.id && (
            <div className="mt-2">
              <input
                type="number"
                value={wonAmount}
                onChange={(e) => setWonAmount(e.target.value)}
                placeholder="Enter won amount"
                className="w-full p-1 text-sm bg-gray-700 rounded"
              />
              <button
                onClick={() => handleWonSubmit(car.id)}
                className="mt-1 w-full bg-green-500 text-white text-xs py-1 rounded"
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );

  const renderColumn = (title: string, cars: Car[], id: string, icon: React.ReactNode) => (
    <div className="bg-gray-900 p-4 rounded-lg flex-1 mr-4 last:mr-0 relative">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
        <span className="ml-2 text-sm text-gray-400">({cars.length})</span>
      </h3>
      {id === 'bid' && (
        <button
          onClick={onMarkAllAsLost}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
          title="Mark All as Lost"
        >
          <ThumbsDown size={16} />
        </button>
      )}
      {id === 'won' && (
        <button
          onClick={exportWonCars}
          className="absolute top-2 right-2 bg-green-500 hover:bg-green-600 text-white p-1 rounded-full"
          title="Export Won Cars"
        >
          <Download size={16} />
        </button>
      )}
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[200px]"
          >
            {cars.map((car, index) => renderCar(car, index, id))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );

  return (
    <div className="flex mb-8 overflow-x-auto">
      {renderColumn("Qualified", qualifiedCars, "qualified", <CheckCircle className="text-green-500" />)}
      {renderColumn("Bid", bidCars, "bid", <Gavel className="text-blue-500" />)}
      {renderColumn("No Bid", noBidCars, "noBid", <XCircle className="text-red-500" />)}
      {renderColumn("Won", wonCars, "won", <Trophy className="text-yellow-500" />)}
      {renderColumn("Lost", lostCars, "lost", <ThumbsDown className="text-gray-500" />)}
    </div>
  );
};

export default BidFunnel;