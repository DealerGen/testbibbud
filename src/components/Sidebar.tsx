import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Calculator, Sliders, Upload, RotateCcw, List, MessageSquare } from 'lucide-react';

interface SidebarProps {
  onToggleUpload: () => void;
  onReset: () => void;
  onToggleProfitCalculator: () => void;
  onToggleParameters: () => void;
  onToggleAllBids: () => void;
  onToggleWhatsApp: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onToggleUpload,
  onReset,
  onToggleProfitCalculator,
  onToggleParameters,
  onToggleAllBids,
  onToggleWhatsApp,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-indigo-900 text-white"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-[200px] bg-gradient-to-b from-indigo-900 to-purple-900 transform transition-transform duration-300 ease-in-out z-40 
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 border-b border-indigo-800 bg-gradient-to-r from-indigo-900 to-purple-900">
          <Link to="/" className="text-2xl font-bold text-white" onClick={closeSidebar}>
            BidBuddy🤖
          </Link>
          <p className="text-xs text-indigo-200">Powered by DealerGen.AI</p>
        </div>

        <nav className="flex-1 py-4">
          <Link
            to="/"
            className={`flex items-center px-4 py-3 text-white hover:bg-indigo-800 transition-colors ${
              isActive('/') ? 'bg-indigo-800' : ''
            }`}
            onClick={closeSidebar}
          >
            <Home size={20} className="mr-3" />
            Home
          </Link>

          <button
            onClick={() => {
              onToggleProfitCalculator();
              closeSidebar();
            }}
            className={`w-full flex items-center px-4 py-3 text-white hover:bg-indigo-800 transition-colors ${
              isActive('/profit-calculator') ? 'bg-indigo-800' : ''
            }`}
          >
            <Calculator size={20} className="mr-3" />
            Calculator
          </button>

          <button
            onClick={() => {
              onToggleParameters();
              closeSidebar();
            }}
            className={`w-full flex items-center px-4 py-3 text-white hover:bg-indigo-800 transition-colors ${
              isActive('/bidding-parameters') ? 'bg-indigo-800' : ''
            }`}
          >
            <Sliders size={20} className="mr-3" />
            Parameters
          </button>

          <button
            onClick={() => {
              onToggleAllBids();
              closeSidebar();
            }}
            className={`w-full flex items-center px-4 py-3 text-white hover:bg-indigo-800 transition-colors ${
              isActive('/all-bids') ? 'bg-indigo-800' : ''
            }`}
          >
            <List size={20} className="mr-3" />
            All Bids
          </button>

          <button
            onClick={() => {
              onToggleWhatsApp();
              closeSidebar();
            }}
            className={`w-full flex items-center px-4 py-3 text-white hover:bg-indigo-800 transition-colors ${
              isActive('/whatsapp') ? 'bg-indigo-800' : ''
            }`}
          >
            <MessageSquare size={20} className="mr-3" />
            WhatsApp
          </button>

          <button
            onClick={() => {
              onToggleUpload();
              closeSidebar();
            }}
            className="w-full flex items-center px-4 py-3 text-white hover:bg-indigo-800 transition-colors"
          >
            <Upload size={20} className="mr-3" />
            Upload
          </button>

          <button
            onClick={() => {
              onReset();
              closeSidebar();
            }}
            className="w-full flex items-center px-4 py-3 text-white hover:bg-indigo-800 transition-colors"
          >
            <RotateCcw size={20} className="mr-3" />
            Reset
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;