import React, { useState } from 'react';
import {
  Music,
  Plus,
  Trash2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
} from 'lucide-react';

export default function RFIDSpotifyPlayer() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [scanStep, setScanStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Music className="text-green-500" size={40} />
          <h1 className="text-4xl font-bold">RFID Spotify Player</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Scan a card to play your favorite albums
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Now Playing Section */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Now Playing</h2>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Album Art */}
            <div className="flex-shrink-0">
              <img
                src="https://via.placeholder.com/200/1DB954/FFFFFF?text=Album+Art"
                alt="Album"
                className="w-48 h-48 rounded-lg shadow-lg"
              />
            </div>

            {/* Song Info and Controls */}
            <div className="flex-1 w-full">
              <h3 className="text-3xl font-bold mb-2">Song Title</h3>
              <p className="text-xl text-gray-400 mb-1">Artist Name</p>
              <p className="text-lg text-gray-500 mb-6">Album Name</p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>2:34</span>
                  <span>4:12</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: '60%' }}
                  ></div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center gap-4">
                <button className="p-3 hover:bg-gray-700 rounded-full transition">
                  <SkipBack size={24} />
                </button>
                <button className="p-4 bg-green-500 hover:bg-green-600 rounded-full transition">
                  <Pause size={28} />
                </button>
                <button className="p-3 hover:bg-gray-700 rounded-full transition">
                  <SkipForward size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card Mappings Section */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Card Mappings</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg transition font-semibold text-lg"
            >
              <Plus size={24} />
              Add Mapping
            </button>
          </div>

          {/* Mappings Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Mapping Card 1 */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="bg-gray-700 rounded-lg overflow-hidden hover:ring-2 hover:ring-green-500 transition group"
              >
                <img
                  src={`https://via.placeholder.com/300/1DB954/FFFFFF?text=Album+${item}`}
                  alt="Album"
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-1 truncate">
                    Abbey Road
                  </h4>
                  <p className="text-sm text-gray-400 mb-3 truncate">
                    The Beatles
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-600 px-3 py-1 rounded-full font-mono">
                      Card: #A3F2
                    </span>
                    <button className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State (show when no mappings) */}
          {/* <div className="text-center py-16">
            <Music className="mx-auto text-gray-600 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No mappings yet</h3>
            <p className="text-gray-500 mb-6">Click "Add Mapping" to map your first RFID card to an album</p>
          </div> */}
        </div>
      </div>

      {/* Add Mapping Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-8 max-w-3xl w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-bold">Add New Mapping</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setScanStep(1);
                }}
                className="text-gray-400 hover:text-white text-4xl"
              >
                ×
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    scanStep === 1 ? 'bg-green-500' : 'bg-gray-600'
                  } font-bold`}
                >
                  1
                </div>
                <div className="w-16 h-1 bg-gray-600"></div>
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    scanStep === 2 ? 'bg-green-500' : 'bg-gray-600'
                  } font-bold`}
                >
                  2
                </div>
              </div>
            </div>

            {/* Step 1: Search and Select Album */}
            {scanStep === 1 && (
              <div>
                <div className="mb-6">
                  <label className="block text-lg font-semibold mb-3">
                    Search for Album
                  </label>
                  <input
                    type="text"
                    placeholder="Enter album name or artist..."
                    className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                  />
                </div>

                {/* Search Results */}
                <div className="mb-6">
                  <p className="text-gray-400 mb-4">Search results:</p>
                  <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <button
                        key={item}
                        onClick={() => setScanStep(2)}
                        className="bg-gray-700 p-4 rounded-lg hover:ring-2 hover:ring-green-500 transition text-left"
                      >
                        <img
                          src={`https://via.placeholder.com/150/1DB954/FFFFFF?text=Album+${item}`}
                          alt="Album"
                          className="w-full aspect-square object-cover rounded mb-3"
                        />
                        <h5 className="font-semibold truncate">
                          Album Name {item}
                        </h5>
                        <p className="text-sm text-gray-400 truncate">
                          Artist Name
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cancel Button */}
                <div>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setScanStep(1);
                    }}
                    className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition font-semibold text-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Scan Card */}
            {scanStep === 2 && (
              <div>
                {/* Selected Album Display */}
                <div className="mb-8 p-6 bg-gray-700 rounded-lg">
                  <p className="text-gray-400 mb-3">Selected Album:</p>
                  <div className="flex items-center gap-4">
                    <img
                      src="https://via.placeholder.com/80/1DB954/FFFFFF?text=Album"
                      alt="Selected Album"
                      className="w-20 h-20 rounded"
                    />
                    <div>
                      <h5 className="font-bold text-lg">Album Name</h5>
                      <p className="text-gray-400">Artist Name</p>
                    </div>
                  </div>
                </div>

                {/* Scan Card Section */}
                <div className="text-center py-12">
                  <div className="w-32 h-32 mx-auto mb-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <Music size={64} className="text-green-500 animate-pulse" />
                  </div>
                  <h4 className="text-2xl font-semibold mb-3">
                    Scan Your RFID Card
                  </h4>
                  <p className="text-gray-400 text-lg mb-8">
                    Hold your card near the reader...
                  </p>
                  <div className="inline-block px-6 py-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-400 text-lg">Card ID: </span>
                    <span className="font-mono text-green-500 text-lg">
                      Waiting...
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setScanStep(1)}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition font-semibold text-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setScanStep(1);
                    }}
                    className="flex-1 py-3 bg-green-500 hover:bg-green-600 rounded-lg transition font-semibold text-lg"
                  >
                    Save Mapping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
