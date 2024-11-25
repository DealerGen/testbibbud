import React, { useState, useCallback } from 'react';
import { Upload, Download, AlertTriangle } from 'lucide-react';
import { parseCarwowCsv, parseFinalCsv, generateSimplifiedCsv, combineCarData } from '../utils/csvParser';
import { useCarData } from '../context/CarDataContext';
import { Car } from '../types';
import LoadingAnimation from './LoadingAnimation';
import { useNavigate } from 'react-router-dom';

interface DataUploadPageProps {
  onUploadComplete: () => void;
}

const DataUploadPage: React.FC<DataUploadPageProps> = ({ onUploadComplete }) => {
  const { setCars } = useCarData();
  const navigate = useNavigate();
  const [carwowData, setCarwowData] = useState<Car[] | null>(null);
  const [simplifiedCsvContent, setSimplifiedCsvContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCarwowUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const text = await file.text();
      const parsedData = await parseCarwowCsv(text);
      setCarwowData(parsedData);
      setCars(parsedData);
      const simplifiedCsv = generateSimplifiedCsv(parsedData);
      setSimplifiedCsvContent(simplifiedCsv);
    } catch (err) {
      console.error("Error processing Carwow data:", err);
      setError(`Error processing Carwow data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  }, [setCars]);

  const handleSimplifiedCsvDownload = useCallback(() => {
    if (!simplifiedCsvContent) return;

    const blob = new Blob([simplifiedCsvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'simplified_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [simplifiedCsvContent]);

  const handleFinalDataUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !carwowData) {
      if (!carwowData) {
        setError("Please upload Carwow data first before uploading the final data.");
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    const capturedWarnings: string[] = [];
    const originalWarn = console.warn;
    console.warn = (...args) => {
      capturedWarnings.push(args.join(' '));
      originalWarn.apply(console, args);
    };

    try {
      const text = await file.text();
      const parsedFinalData = await parseFinalCsv(text);
      const combined = await combineCarData(carwowData, parsedFinalData);
      setCars(combined);
      setWarnings(capturedWarnings);
      onUploadComplete();
      navigate('/');
    } catch (err) {
      console.error("Error processing final data:", err);
      setError(`Error processing final data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      console.warn = originalWarn;
      setIsLoading(false);
    }
  }, [carwowData, setCars, onUploadComplete, navigate]);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900">
      <main className="lg:ml-[200px] min-h-screen py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-white">Upload Data</h1>
        
        <div className="card p-6">
          <div className="space-y-8">
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Step 1: Upload Carwow CSV</h3>
              <label className="btn btn-primary inline-flex items-center space-x-2 cursor-pointer">
                <Upload size={20} />
                <span>Upload Carwow CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCarwowUpload}
                  className="hidden"
                  onClick={(e) => (e.target as HTMLInputElement).value = ''}
                />
              </label>
              {carwowData && <p className="text-green-400 mt-2">✅ Carwow data uploaded successfully</p>}
            </div>

            {simplifiedCsvContent && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Step 2: Download Simplified CSV</h3>
                <button
                  onClick={handleSimplifiedCsvDownload}
                  className="btn btn-primary inline-flex items-center space-x-2"
                >
                  <Download size={20} />
                  <span>Download Simplified CSV</span>
                </button>
                <p className="mt-2 text-sm text-indigo-200">
                  This CSV contains VRM and MILEAGE columns for you to fill in additional information.
                </p>
              </div>
            )}

            {simplifiedCsvContent && (
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Step 3: Upload Final CSV</h3>
                <label className="btn btn-primary inline-flex items-center space-x-2 cursor-pointer">
                  <Upload size={20} />
                  <span>Upload Final CSV</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFinalDataUpload}
                    className="hidden"
                    onClick={(e) => (e.target as HTMLInputElement).value = ''}
                  />
                </label>
              </div>
            )}

            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 p-4 rounded-lg flex items-center">
                <AlertTriangle size={20} className="text-red-500 mr-2" />
                <p className="text-red-100">{error}</p>
              </div>
            )}

            {warnings.length > 0 && (
              <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-100 mb-2 flex items-center">
                  <AlertTriangle size={16} className="mr-2" />
                  Warnings
                </h3>
                <ul className="list-disc list-inside">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-100">{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataUploadPage;