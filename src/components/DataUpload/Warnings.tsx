import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface WarningsProps {
  error: string | null;
  warnings: string[];
}

const Warnings: React.FC<WarningsProps> = ({ error, warnings }) => {
  if (!error && warnings.length === 0) return null;

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 p-4 rounded-lg flex items-center">
          <AlertTriangle size={20} className="text-red-500 mr-2 flex-shrink-0" />
          <p className="text-red-100">{error}</p>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 p-4 rounded-lg">
          <h4 className="font-semibold text-yellow-100 mb-2 flex items-center">
            <AlertTriangle size={16} className="mr-2" />
            Warnings
          </h4>
          <ul className="list-disc list-inside space-y-1">
            {warnings.map((warning, index) => (
              <li key={index} className="text-yellow-100 text-sm">{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Warnings;