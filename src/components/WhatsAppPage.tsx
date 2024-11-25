import React, { useState } from 'react';
import { useCarData } from '../context/CarDataContext';
import { Car } from '../types';
import { MessageSquare, Copy, Check } from 'lucide-react';

const WhatsAppPage: React.FC = () => {
  const { cars } = useCarData();
  const [copied, setCopied] = useState<string | null>(null);

  const generateWhatsAppMessage = (car: Car) => {
    const message = `🚗 Vehicle Details:\n
Make: ${car.make}
Model: ${car.model}
Year: ${car.carYear}
Mileage: ${car.mileage?.toLocaleString()} miles
Price: £${car.reserveOrBuyNowPrice}
Retail Value: ${car.retailValuation ? `£${car.retailValuation?.toLocaleString()}` : 'N/A'}
Auto Trader Rating: ${car.autoTraderRetailRating || 'N/A'}
Days to Sell: ${car.daysToSell || 'N/A'}
Previous Owners: ${car.previousOwnersCount}
Service History: ${car.serviceHistory}`;

    return encodeURIComponent(message);
  };

  const copyToClipboard = async (text: string, carId: string) => {
    try {
      await navigator.clipboard.writeText(decodeURIComponent(text));
      setCopied(carId);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const openWhatsApp = (message: string) => {
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900">
      <main className="lg:ml-[200px] min-h-screen py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-white">WhatsApp Messages</h1>
        <div className="grid gap-6">
          {cars.map((car) => {
            const message = generateWhatsAppMessage(car);
            return (
              <div key={car.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    {car.make} {car.model} ({car.carYear})
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(message, car.id)}
                      className="btn bg-blue-500 hover:bg-blue-600 text-white inline-flex items-center"
                    >
                      {copied === car.id ? (
                        <>
                          <Check size={16} className="mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={16} className="mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openWhatsApp(message)}
                      className="btn bg-green-500 hover:bg-green-600 text-white inline-flex items-center"
                    >
                      <MessageSquare size={16} className="mr-1" />
                      Send
                    </button>
                  </div>
                </div>
                <pre className="bg-opacity-10 backdrop-blur-sm bg-white rounded-lg p-4 text-sm text-indigo-200 whitespace-pre-wrap">
                  {decodeURIComponent(message)}
                </pre>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default WhatsAppPage;