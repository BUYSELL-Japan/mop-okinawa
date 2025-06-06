import React, { useState, useEffect } from 'react';
import { Home, Plus, ArrowLeft } from 'lucide-react';
import CreateTravelLog from './CreateTravelLog';
import { TravelLog } from '../types/travelLog';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TravelLogsProps {
  onClose: () => void;
}

export default function TravelLogs({ onClose }: TravelLogsProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [travelLogs, setTravelLogs] = useLocalStorage<TravelLog[]>('travel-logs', []);

  if (isCreating) {
    return (
      <CreateTravelLog 
        onClose={() => setIsCreating(false)}
        onBack={() => setIsCreating(false)}
        onSave={(newLog) => {
          setTravelLogs(prev => [newLog, ...prev]);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[9999]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Travel Logs</h1>
          <div className="w-9"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-[57px] mb-[64px] px-2 py-4 overflow-y-auto">
        <div className="grid grid-cols-3 gap-2">
          {travelLogs.map((log) => (
            <div
              key={log.id}
              className="aspect-square relative overflow-hidden rounded-lg"
            >
              <img
                src={log.imageUrl}
                alt={log.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {travelLogs.length === 0 && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-gray-500">
            <p className="text-center">No travel logs yet</p>
            <p className="text-sm mt-2">Start sharing your memories!</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="flex justify-around items-center h-16">
          <button
            onClick={onClose}
            className="flex flex-col items-center justify-center gap-1 p-2"
          >
            <Home className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">Home</span>
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="flex flex-col items-center justify-center gap-1 p-2"
          >
            <Plus className="w-6 h-6 text-gray-600" />
            <span className="text-xs text-gray-600">Create</span>
          </button>
        </div>
      </nav>
    </div>
  );
}