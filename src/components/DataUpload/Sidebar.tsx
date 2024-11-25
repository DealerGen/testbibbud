import React from 'react';
import { Home, Calculator, Sliders, Upload, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  onReset: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onReset }) => {
  return (
    <div className="fixed top-0 left-0 h-full w-[200px] bg-gray-900 text-white">
      <div className="p-4 border-b border-gray-800">
        <Link to="/" className="text-2xl font-bold">BidBuddy🤖</Link>
        <p className="text-xs text-gray-400">Data Upload</p>
      </div>

      <nav className="p-4 space-y-2">
        <Link to="/" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link to="/calculator" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
          <Calculator size={20} />
          <span>Calculator</span>
        </Link>

        <Link to="/parameters" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
          <Sliders size={20} />
          <span>Parameters</span>
        </Link>

        <button className="w-full flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors">
          <Upload size={20} />
          <span>Upload</span>
        </button>

        <button 
          onClick={onReset}
          className="w-full flex items-center space-x-2 p-2 rounded hover:bg-gray-800 transition-colors"
        >
          <RotateCcw size={20} />
          <span>Reset</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;