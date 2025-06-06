import React, { useState, useRef } from 'react';
import { ArrowLeft, Share, Download, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { TravelLog } from '../types/travelLog';
import html2canvas from 'html2canvas';

interface CreateTravelLogProps {
  onClose: () => void;
  onSave: (log: TravelLog) => void;
  onBack: () => void;
}

export default function CreateTravelLog({ onClose, onSave, onBack }: CreateTravelLogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const postRef = useRef<HTMLDivElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: content,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const handleDownload = async () => {
    if (!postRef.current) return;

    try {
      const canvas = await html2canvas(postRef.current);
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `travel-log-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !selectedImage) {
      alert('Please fill in all required fields');
      return;
    }

    const newLog: TravelLog = {
      id: crypto.randomUUID(),
      title,
      content,
      imageUrl: selectedImage,
      createdAt: new Date().toISOString()
    };

    onSave(newLog);
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Create Post</h1>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-[57px] px-4 py-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div ref={postRef} className="space-y-6">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full px-4 py-2 text-lg font-semibold border-b focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="relative">
              {selectedImage ? (
                <div className="relative aspect-video">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-sm text-gray-500">Click to add image</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                required
              />
            </div>

            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your travel story..."
                className="w-full h-40 px-4 py-3 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Post
          </button>
        </form>
      </main>
    </div>
  );
}