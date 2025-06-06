import React, { useState, useEffect, useRef } from 'react';
import { X, FileText } from 'lucide-react';
import TermsOfUseModal from './TermsOfUseModal';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  showMarkerTitles: boolean;
  onToggleMarkerTitles: (show: boolean) => void;
}

export default function Settings({ 
  isOpen, 
  onClose, 
  showMarkerTitles,
  onToggleMarkerTitles
}: SettingsProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Reset Terms modal state when Settings modal is closed
  useEffect(() => {
    if (!isOpen) {
      setIsTermsOpen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
        <div 
          ref={modalRef}
          className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Settings</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Show Marker Titles</h3>
                  <p className="text-xs text-gray-500">
                    Display location names above map markers
                  </p>
                </div>
                <button
                  onClick={() => onToggleMarkerTitles(!showMarkerTitles)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    showMarkerTitles ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                  role="switch"
                  aria-checked={showMarkerTitles}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showMarkerTitles ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <button
                onClick={() => setIsTermsOpen(true)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Terms of Use
              </button>
            </div>
          </div>
        </div>
      </div>

      <TermsOfUseModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </>
  );
}