import React from 'react';
import { Car } from '../types';
import { X, PoundSterling, Gauge, Star, Clock, Users, Award, ExternalLink } from 'lucide-react';

interface CarDetailsProps {
  car: Car;
  onClose: () => void;
}

const CarDetails: React.FC<CarDetailsProps> = ({ car, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{car.make} {car.model}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-white">
          <DetailItem icon={<PoundSterling />} label="Reserve/Buy Now Price" value={`£${car.reserveOrBuyNowPrice.toLocaleString()}`} />
          <DetailItem icon={<PoundSterling />} label="CAP Clean" value={`£${car.capClean.toLocaleString()}`} />
          <DetailItem icon={<PoundSterling />} label="Retail Valuation" value={car.retailValuation ? `£${car.retailValuation.toLocaleString()}` : 'N/A'} />
          <DetailItem icon={<Gauge />} label="Mileage" value={`${car.mileage.toLocaleString()} miles`} />
          <DetailItem icon={<Award />} label="Condition Grade" value={car.conditionGrade.toString()} />
          <DetailItem icon={<Clock />} label="Car Age" value={`${car.carAgeYears} years`} />
          <DetailItem icon={<Users />} label="Previous Owners" value={car.previousOwnersCount.toString()} />
          <DetailItem icon={<Star />} label="Auto Trader Retail Rating" value={car.autoTraderRetailRating?.toString() || 'N/A'} />
          <DetailItem icon={<Clock />} label="Days to Sell" value={car.daysToSell?.toString() || 'N/A'} />
          <DetailItem icon={null} label="Colour" value={car.bodycolour} />
          <DetailItem icon={null} label="Fuel Type" value={car.fuelType} />
          <DetailItem icon={null} label="Transmission" value={car.transmission} />
          <DetailItem icon={null} label="Service History" value={car.serviceHistory} />
          <DetailItem icon={null} label="First Registered" value={car.firstRegistered} />
        </div>
        {car.sellerNotes && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-white mb-2">Seller Notes</h3>
            <p className="text-gray-300">{car.sellerNotes}</p>
          </div>
        )}
        {car.listingUrl && (
          <div className="mt-4">
            <a
              href={car.listingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center"
            >
              <ExternalLink size={16} className="mr-2" />
              View Full Listing
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center">
    {icon && <span className="mr-2">{icon}</span>}
    <span className="font-semibold mr-2">{label}:</span>
    <span>{value}</span>
  </div>
);

export default CarDetails;