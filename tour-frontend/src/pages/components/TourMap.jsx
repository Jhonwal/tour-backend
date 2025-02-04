// import React, { useState, useEffect } from 'react';
// import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';

// const TourMap = ({ tourRoute }) => {
//   const [mapCenter, setMapCenter] = useState(tourRoute[0]);
//   const mapContainerStyle = {
//     width: '100%',
//     height: '400px',
//   };

//   // Path coordinates for polyline
//   const path = tourRoute.map(station => ({ lat: station.lat, lng: station.lng }));

//   return (
//     <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         center={mapCenter}
//         zoom={12}
//       >
//         {tourRoute.map((station, index) => (
//           <Marker
//             key={index}
//             position={{ lat: station.lat, lng: station.lng }}
//             title={station.name}
//           />
//         ))}
//         <Polyline path={path} options={{ strokeColor: '#FF0000', strokeOpacity: 1.0, strokeWeight: 2 }} />
//       </GoogleMap>
//     </LoadScript>
//   );
// };

// export default TourMap;


import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PlusCircle, Trash2 } from 'lucide-react';

const MoroccoMapViewer = () => {
  // Center coordinates for Morocco
  const [locations, setLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ name: '', type: 'city' });

  // Predefined major cities with their coordinates
  const majorCities = {
    'Casablanca': { lat: 33.5731, lng: -7.5898 },
    'Rabat': { lat: 34.0209, lng: -6.8416 },
    'Marrakech': { lat: 31.6295, lng: -7.9811 },
    'Fez': { lat: 34.0181, lng: -5.0078 },
    'Tangier': { lat: 35.7595, lng: -5.8340 },
    'Agadir': { lat: 30.4278, lng: -9.5981 },
    'Oujda': { lat: 34.6867, lng: -1.9114 },
    'Meknes': { lat: 33.8935, lng: -5.5547 }
  };

  // Add the HTML and JavaScript needed for OpenStreetMap
  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Morocco Tour Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          {/* Map Container */}
          <div className="border rounded overflow-hidden" style={{ height: '500px' }}>
            <div 
              id="map" 
              className="w-full h-full"
              dangerouslySetInnerHTML={{
                __html: `
                  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css" />
                  <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.js"></script>
                  <div id="mapContainer" style="height: 100%;"></div>
                  <script>
                    // Initialize the map
                    const map = L.map('mapContainer').setView([31.7917, -7.0926], 6);
                    
                    // Add OpenStreetMap tiles
                    L.tileLayer('AIzaSyDC8wuryEBM0YTH7XXCQZnGuc-jKY3p8Fg', {
                      maxZoom: 19,
                      attribution: '© OpenStreetMap contributors'
                    }).addTo(map);

                    // Add markers for major cities
                    const cities = ${JSON.stringify(majorCities)};
                    Object.entries(cities).forEach(([name, coords]) => {
                      L.marker([coords.lat, coords.lng])
                        .bindPopup(name)
                        .addTo(map);
                    });
                  </script>
                `
              }}
            />
          </div>

          {/* City Selection Form */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">City</label>
              <select
                value={newLocation.name}
                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a city</option>
                {Object.keys(majorCities).map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={newLocation.type}
                onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="city">City</option>
                <option value="station">Station</option>
              </select>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                if (newLocation.name && majorCities[newLocation.name]) {
                  setLocations([...locations, {
                    ...newLocation,
                    ...majorCities[newLocation.name],
                    id: Date.now()
                  }]);
                  setNewLocation({ name: '', type: 'city' });
                }
              }}
            >
              <PlusCircle className="w-4 h-4" />
              Add to Route
            </button>
          </div>

          {/* Selected Locations List */}
          <div className="space-y-2">
            <h3 className="font-medium">Tour Route</h3>
            {locations.map((loc, index) => (
              <div key={loc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>
                  {index + 1}. {loc.name} ({loc.type})
                </span>
                <button
                  onClick={() => {
                    setLocations(locations.filter(l => l.id !== loc.id));
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoroccoMapViewer;