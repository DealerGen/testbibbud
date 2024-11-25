import React from 'react';
import { Upload, Download } from 'lucide-react';

interface UploadStepProps {
  step: number;
  title: string;
  description: string;
  buttonText: string;
  buttonIcon: 'upload' | 'download';
  buttonColor: string;
  hoverColor: string;
  onAction: (event: React.ChangeEvent<HTMLInputElement>) => void;
  success?: boolean;
  isDownload?: boolean;
}

const UploadStep: React.FC<UploadStepProps> = ({
  step,
  title,
  description,
  buttonText,
  buttonIcon,
  buttonColor,
  hoverColor,
  onAction,
  success,
  isDownload
}) => {
  const Icon = buttonIcon === 'upload' ? Upload : Download;

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
          {step}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      
      <p className="text-sm text-gray-300 ml-10">{description}</p>

      <div className="ml-10">
        {isDownload ? (
          <button
            onClick={() => onAction(null as any)}
            className={`inline-flex items-center space-x-2 ${buttonColor} ${hoverColor} text-white font-bold py-2 px-4 rounded transition-colors`}
          >
            <Icon size={20} />
            <span>{buttonText}</span>
          </button>
        ) : (
          <label className={`inline-flex items-center space-x-2 cursor-pointer ${buttonColor} ${hoverColor} text-white font-bold py-2 px-4 rounded transition-colors`}>
            <Icon size={20} />
            <span>{buttonText}</span>
            <input
              type="file"
              accept=".csv"
              onChange={onAction}
              className="hidden"
              onClick={(e) => (e.target as HTMLInputElement).value = ''}
            />
          </label>
        )}

        {success && (
          <span className="ml-2 text-green-500">✓ Upload successful</span>
        )}
      </div>
    </div>
  );
};

export default UploadStep;