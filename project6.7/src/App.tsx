import React, { useState, useRef, useEffect } from 'react';
import Map from './components/Map';
import CategoryFilter from './components/CategoryFilter';
import WeatherModal from './components/WeatherModal';
import SearchModal from './components/SearchModal';
import Settings from './components/Settings';
import FeedbackModal from './components/FeedbackModal';
import FavoritesModal from './components/FavoritesModal';
import RentalCarsModal from './components/RentalCarsModal';
import TravelLogs from './components/TravelLogs';
import SplashScreen from './components/SplashScreen';
import WelcomeModal from './components/WelcomeModal';
import { MapPin, Cloud, Search, Settings as SettingsIcon, MessageCircle, Heart, LogIn, Car, BookOpen } from 'lucide-react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useWindowSize } from './hooks/useWindowSize';
import { Location } from './types/location';
import { validateEnv } from './utils/envValidation';
import { exchangeCodeForTokens, parseJwt, getFavorites, checkAndRefreshTokens } from './utils/auth';

const LOGIN_URL = "https://ap-southeast-2usngbi9wi.auth.ap-southeast-2.amazoncognito.com/login?client_id=12nf22nqg8mpcq1q77nm5uqbls&response_type=code&scope=email+openid&redirect_uri=https%3A%2F%2Fmop-okinawa.com";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage('hasSeenWelcome', false);
  const env = validateEnv();
  const [geojsonUrl] = useLocalStorage('geojsonUrl', env.VITE_GEOJSON_URL);
  const [selectedCategories, setSelectedCategories] = useLocalStorage('selectedCategories', ['1', '2', '3', '5', '6', '9']);
  const [showMarkerTitles, setShowMarkerTitles] = useLocalStorage('showMarkerTitles', false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isRentalCarsOpen, setIsRentalCarsOpen] = useState(false);
  const [isTravelLogsOpen, setIsTravelLogsOpen] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const mapRef = useRef<any>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [favorites, setFavorites] = useState<Location[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshFavorites = async () => {
    if (isAuthenticated && locations.length > 0) {
      try {
        const favoritePinIds = await getFavorites();
        const favoriteLocations = locations.filter(location => 
          favoritePinIds.includes(location.properties.pin_id)
        );
        setFavorites(favoriteLocations);
        return favoritePinIds;
      } catch (error) {
        console.error('Error refreshing favorites:', error);
        return [];
      }
    }
    return [];
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      exchangeCodeForTokens(code)
        .then(tokens => {
          localStorage.setItem('access_token', tokens.access_token);
          localStorage.setItem('id_token', tokens.id_token);
          localStorage.setItem('refresh_token', tokens.refresh_token);
          localStorage.setItem('token_expiry', (Date.now() + tokens.expires_in * 1000).toString());
          
          const decodedToken = parseJwt(tokens.id_token);
          if (decodedToken?.sub) {
            localStorage.setItem('sub', decodedToken.sub);
          }
          
          setIsAuthenticated(true);
          
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        })
        .catch(error => {
          console.error('Authentication error:', error);
        });
    } else {
      const checkAuth = async () => {
        const isValid = await checkAndRefreshTokens();
        setIsAuthenticated(isValid);
      };
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && locations.length > 0) {
      refreshFavorites();
    }
  }, [isAuthenticated, locations]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  const handleLocationSelect = (location: Location) => {
    if (mapRef.current) {
      const { current: map } = mapRef;
      map.flyTo(
        [location.geometry.coordinates[1], location.geometry.coordinates[0]],
        16,
        {
          duration: 1.5,
        }
      );
      
      setTimeout(() => {
        map.openPopup(
          [location.geometry.coordinates[1], location.geometry.coordinates[0]]
        );
      }, 1600);
    }
  };

  const handleWelcomeClose = () => {
    setHasSeenWelcome(true);
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#aad3df]">
      <div className="p-3 md:p-6 relative z-[9999]">
        <div className="mb-3">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">MOP Okinawa</h1>
            </div>
            <a
              href={LOGIN_URL}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-400 text-white rounded-lg shadow-sm hover:bg-blue-500 transition-colors whitespace-nowrap text-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log in / Sign up</span>
            </a>
          </div>
          
          <div className={`${isMobile ? 'overflow-x-auto hide-scrollbar' : ''} -mx-3 md:-mx-6 px-3 md:px-6`}>
            <div 
              ref={scrollContainerRef}
              className={`flex gap-2 ${isMobile ? 'w-max pb-2 snap-x snap-mandatory' : 'flex-wrap'}`}
            >
              <div className={`${isMobile ? 'snap-center' : ''}`}>
                <CategoryFilter
                  selectedCategories={selectedCategories}
                  onCategoryToggle={handleCategoryToggle}
                  isMobile={isMobile}
                />
              </div>
              
              <div className={`${isMobile ? 'snap-center' : ''}`}>
                <button
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/30 hover:bg-white/95 transition-colors whitespace-nowrap text-sm min-h-[36px]"
                  onClick={() => setIsWeatherModalOpen(!isWeatherModalOpen)}
                >
                  <Cloud className="w-4 h-4 text-gray-500" />
                  <span>Weather</span>
                </button>
              </div>

              <div className={`${isMobile ? 'snap-center' : ''}`}>
                <button
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/30 hover:bg-white/95 transition-colors whitespace-nowrap text-sm min-h-[36px]"
                  onClick={() => setIsFavoritesOpen(true)}
                >
                  <Heart className="w-4 h-4 text-gray-500" />
                  <span>Favorites</span>
                </button>
              </div>

              <div className={`${isMobile ? 'snap-center' : ''}`}>
                <button
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/30 hover:bg-white/95 transition-colors whitespace-nowrap text-sm min-h-[36px]"
                  onClick={() => setIsTravelLogsOpen(true)}
                >
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span>Travel Logs</span>
                </button>
              </div>

              <div className={`${isMobile ? 'snap-center' : ''}`}>
                <button
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/30 hover:bg-white/95 transition-colors whitespace-nowrap text-sm min-h-[36px]"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <Search className="w-4 h-4 text-gray-500" />
                  <span>Search</span>
                </button>
              </div>

              <div className={`${isMobile ? 'snap-center' : ''}`}>
                <button
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/30 hover:bg-white/95 transition-colors whitespace-nowrap text-sm min-h-[36px]"
                  onClick={() => setIsFeedbackOpen(true)}
                >
                  <MessageCircle className="w-4 h-4 text-gray-500" />
                  <span>Feedback</span>
                </button>
              </div>

              <div className={`${isMobile ? 'snap-center' : ''}`}>
                <button
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/30 hover:bg-white/95 transition-colors whitespace-nowrap text-sm min-h-[36px]"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                >
                  <SettingsIcon className="w-4 h-4 text-gray-500" />
                  <span>Settings</span>
                </button>
              </div>

              <div className={`${isMobile ? 'snap-center' : ''}`}>
                <button
                  className="flex items-center gap-1.5 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm border border-white/30 hover:bg-white/95 transition-colors whitespace-nowrap text-sm min-h-[36px]"
                  onClick={() => setIsRentalCarsOpen(true)}
                >
                  <Car className="w-4 h-4 text-gray-500" />
                  <span>Rental Cars</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <Map 
          ref={mapRef}
          geojsonUrl={geojsonUrl}
          selectedCategories={selectedCategories}
          onLocationsLoad={setLocations}
          showMarkerTitles={showMarkerTitles}
          onFavoritesChange={refreshFavorites}
        />
      </div>

      <WelcomeModal
        isOpen={!hasSeenWelcome}
        onClose={handleWelcomeClose}
      />

      <WeatherModal
        isOpen={isWeatherModalOpen}
        onClose={() => setIsWeatherModalOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        locations={locations}
        onLocationSelect={handleLocationSelect}
      />

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        showMarkerTitles={showMarkerTitles}
        onToggleMarkerTitles={setShowMarkerTitles}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />

      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onFavoritesChange={refreshFavorites}
        onLocationSelect={handleLocationSelect}
      />

      <RentalCarsModal
        isOpen={isRentalCarsOpen}
        onClose={() => setIsRentalCarsOpen(false)}
      />

      {isTravelLogsOpen && (
        <TravelLogs onClose={() => setIsTravelLogsOpen(false)} />
      )}
    </div>
  );
}

export default App;