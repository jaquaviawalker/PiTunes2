import { useState } from 'react';
import {
  Music,
  Radio,
  Disc,
  Settings,
  Activity,
  LogOut,
  Plus,
  Search,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Trash2,
  Edit,
  Check,
  X,
  RefreshCw,
  Volume2,
  Home,
} from 'lucide-react';

export default function RFIDSpotifyPlayer() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black p-6 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-green-500">
            <Music size={32} />
            <h1 className="text-xl font-bold">RFID Player</h1>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'dashboard'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('mappings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'mappings'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Disc size={20} />
            <span>Card Mappings</span>
          </button>

          <button
            onClick={() => setCurrentView('devices')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'devices'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Volume2 size={20} />
            <span>Devices</span>
          </button>

          <button
            onClick={() => setCurrentView('activity')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'activity'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Activity size={20} />
            <span>Activity</span>
          </button>

          <button
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              currentView === 'settings'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="border-t border-gray-800 pt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">Spotify Connected</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">RFID Reader Active</span>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white transition">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-gray-800 px-8 py-4 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-2xl font-semibold">
            {currentView === 'dashboard' && 'Dashboard'}
            {currentView === 'mappings' && 'Card Mappings'}
            {currentView === 'devices' && 'Spotify Devices'}
            {currentView === 'activity' && 'Activity Log'}
            {currentView === 'settings' && 'Settings'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold">
              U
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              {/* Status Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Total Mapped Cards</span>
                    <Disc className="text-green-500" size={24} />
                  </div>
                  <div className="text-3xl font-bold">12</div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Scans Today</span>
                    <Activity className="text-blue-500" size={24} />
                  </div>
                  <div className="text-3xl font-bold">47</div>
                </div>

                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Active Device</span>
                    <Volume2 className="text-purple-500" size={24} />
                  </div>
                  <div className="text-lg font-semibold">Living Room</div>
                </div>
              </div>

              {/* Now Playing */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold">Now Playing</h3>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-700 rounded-full transition">
                      <SkipBack size={20} />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-full transition bg-green-500">
                      <Pause size={20} />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-full transition">
                      <SkipForward size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <img
                    src="https://via.placeholder.com/150/1DB954/FFFFFF?text=Album"
                    alt="Album"
                    className="w-32 h-32 rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold mb-2">
                      Bohemian Rhapsody
                    </h4>
                    <p className="text-gray-400 mb-4">
                      Queen · A Night at the Opera
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>2:34</span>
                        <span>5:55</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: '43%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Music size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Card #A3F2 scanned</p>
                        <p className="text-sm text-gray-400">
                          Playing Abbey Road by The Beatles
                        </p>
                      </div>
                      <span className="text-sm text-gray-400">2 min ago</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mappings View */}
          {currentView === 'mappings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search mappings..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition font-medium"
                >
                  <Plus size={20} />
                  Add Mapping
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                  <div
                    key={item}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-green-500 transition"
                  >
                    <img
                      src="https://via.placeholder.com/300/1DB954/FFFFFF?text=Album"
                      alt="Album"
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-bold mb-1 truncate">Abbey Road</h4>
                      <p className="text-sm text-gray-400 mb-2 truncate">
                        The Beatles
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                          Card: #A3F2
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded transition text-sm">
                          Test
                        </button>
                        <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 bg-red-600 hover:bg-red-700 rounded transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Devices View */}
          {currentView === 'devices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Available Spotify devices</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                  <RefreshCw size={18} />
                  Refresh
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: 'Living Room Speaker',
                    type: 'Speaker',
                    active: true,
                  },
                  { name: 'Bedroom Echo', type: 'Speaker', active: false },
                  { name: 'Desktop Computer', type: 'Computer', active: false },
                  { name: 'iPhone', type: 'Smartphone', active: false },
                ].map((device, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800 p-6 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <Volume2 size={24} className="text-green-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{device.name}</h4>
                          {device.active && (
                            <span className="flex items-center gap-1 text-xs bg-green-500 px-2 py-1 rounded">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{device.type}</p>
                      </div>
                    </div>
                    {!device.active && (
                      <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition">
                        Set Active
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-blue-900 border border-blue-700 p-4 rounded-lg">
                <p className="text-sm text-blue-200">
                  💡 Make sure Spotify is open on at least one device to see it
                  here.
                </p>
              </div>
            </div>
          )}

          {/* Activity View */}
          {currentView === 'activity' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-500 rounded-lg">
                    All
                  </button>
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                    Scans
                  </button>
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                    Playback
                  </button>
                  <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                    Errors
                  </button>
                </div>
                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                  Clear Logs
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left p-4">Time</th>
                      <th className="text-left p-4">Event</th>
                      <th className="text-left p-4">Details</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                      <tr
                        key={item}
                        className="border-t border-gray-700 hover:bg-gray-750"
                      >
                        <td className="p-4 text-gray-400">10:23:45 AM</td>
                        <td className="p-4">Card Scanned</td>
                        <td className="p-4">Card #A3F2 → Abbey Road</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-xs bg-green-900 text-green-300 px-2 py-1 rounded">
                            <Check size={12} />
                            Success
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings View */}
          {currentView === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold mb-4">Spotify Settings</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Client ID
                  </label>
                  <input
                    type="text"
                    value="your_client_id_here"
                    readOnly
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Redirect URI
                  </label>
                  <input
                    type="text"
                    value="http://localhost:8888/callback"
                    readOnly
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  />
                </div>
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition">
                  Re-authenticate
                </button>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold mb-4">RFID Settings</h3>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Reader Type
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-700 rounded-lg">
                    <option>RC522</option>
                    <option>PN532</option>
                    <option>MFRC522</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Serial Port
                  </label>
                  <input
                    type="text"
                    placeholder="/dev/ttyUSB0"
                    className="w-full px-4 py-2 bg-gray-700 rounded-lg"
                  />
                </div>
                <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
                  Test Connection
                </button>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                <h3 className="text-xl font-semibold mb-4">
                  Playback Settings
                </h3>
                <div className="flex items-center justify-between">
                  <span>Auto-play on scan</span>
                  <button className="w-12 h-6 bg-green-500 rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shuffle mode</span>
                  <button className="w-12 h-6 bg-gray-700 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>

              <button className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg transition font-semibold">
                Save Settings
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add Mapping Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Add New Mapping</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-700 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Step 1: Scan Card */}
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
                <Radio size={48} className="text-green-500 animate-pulse" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Scan Your Card</h4>
              <p className="text-gray-400 mb-6">
                Hold your RFID card near the reader
              </p>
              <div className="inline-block px-4 py-2 bg-gray-700 rounded-lg">
                <span className="text-gray-400">Card ID: </span>
                <span className="font-mono text-green-500">Waiting...</span>
              </div>
            </div>

            {/* Step 2: Search Album (shown after card is scanned) */}
            <div className="hidden">
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Search for Album
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Enter album name or artist..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 max-h-96 overflow-y-auto">
                {[1, 2, 3, 4].map((item) => (
                  <button
                    key={item}
                    className="bg-gray-700 p-4 rounded-lg hover:ring-2 hover:ring-green-500 transition text-left"
                  >
                    <img
                      src="https://via.placeholder.com/150/1DB954/FFFFFF?text=Album"
                      alt="Album"
                      className="w-full aspect-square object-cover rounded mb-3"
                    />
                    <h5 className="font-semibold truncate">Abbey Road</h5>
                    <p className="text-sm text-gray-400 truncate">
                      The Beatles
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
                  Cancel
                </button>
                <button className="flex-1 py-3 bg-green-500 hover:bg-green-600 rounded-lg transition font-semibold">
                  Save Mapping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
