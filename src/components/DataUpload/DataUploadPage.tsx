import React, { useState, useCallback } from 'react';
import { Upload, Download, AlertTriangle } from 'lucide-react';
import { parseCarwowCsv, parseFinalCsv, generateSimplifiedCsv, combineCarData } from '../../utils/csvParser';
import { useCarData } from '../../context/CarDataContext';
import { Car } from '../../types';
import LoadingAnimation from '../LoadingAnimation';
import UploadStep from './UploadStep';
import Warnings from './Warnings';

interface DataUploadPageProps {
  onUploadComplete: () => void;
}

const DataUploadPage: React.FC<DataUploadPageProps> = ({ onUploadComplete }) => {
  const { setCars } = useCarData();
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
    } catch (err) {
      console.error("Error processing final data:", err);
      setError(`Error processing final data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      console.warn = originalWarn;
      setIsLoading(false);
    }
  }, [carwowData, setCars, onUploadComplete]);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
      <main className="container mx-auto py-8 px-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Upload Data</h2>
          
          <div className="space-y-8">
            <UploadStep
              step={1}
              title="Upload Carwow CSV"
              description="Upload your Carwow export file"
              onAction={handleCarwowUpload}
              success={!!carwowData}
              buttonText="Upload Carwow CSV"
              buttonIcon="upload"
              buttonColor="bg-blue-500"
              hoverColor="hover:bg-blue-600"
            />

            {simplifiedCsvContent && (
              <UploadStep
                step={2}
                title="Download Simplified CSV"
                description="Download the simplified CSV for manual updates"
                onAction={handleSimplifiedCsvDownload}
                buttonText="Download Simplified CSV"
                buttonIcon="download"
                buttonColor="bg-green-500"
                hoverColor="hover:bg-green-600"
                isDownload
              />
            )}

            {simplifiedCsvContent && (
              <UploadStep
                step={3}
                title="Upload Final CSV"
                description="Upload your completed CSV file"
                onAction={handleFinalDataUpload}
                buttonText="Upload Final CSV"
                buttonIcon="upload"
                buttonColor="bg-purple-500"
                hoverColor="hover:bg-purple-600"
              />
            )}

            <Warnings error={error} warnings={warnings} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataUploadPage;