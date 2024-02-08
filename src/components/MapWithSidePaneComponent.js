import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import data from '../resources/data.json'; // Ensure this import path is correct

const MapSidePaneComponent = () => {
  const [textSize, setTextSize] = useState(11); // Default text size
  const [selectedLocation, setSelectedLocation] = useState(null); // State to hold the selected location
  const mapRef = useRef(null);

  // Function to create a custom marker icon, remains unchanged
  const createCustomMarkerIcon = (name, textSize) => new L.DivIcon({
    html: `
      <div style="display: flex; align-items: center;">
        <img src="${L.Icon.Default.prototype.options.iconUrl}" style="margin-right: 4px;"/>
        <span style="font-size: ${textSize}px; font-weight: bold; text-align: left;">${name}</span>
      </div>
    `,
    className: 'custom-marker-icon',
    iconAnchor: [0, 41],
    popupAnchor: [0, -34],
  });

  // Side Pane Content Component
  const SidePane = ({ location }) => {
    if (!location) return <div className="side-pane" style={{ width: '250px', height: '100vh', position: 'absolute', top: '0', right: '0', background: 'white', padding: '20px', boxSizing: 'border-box' }}>Select a location</div>;

    return (
      <div className="side-pane" style={{ width: '250px', height: '100vh', position: 'absolute', top: '0', right: '0', background: 'white', padding: '20px', boxSizing: 'border-box' }}>
        <h2>{location.name}</h2>
        {location.info.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  };

  useEffect(() => {
    // The existing useEffect logic for updating label visibility, etc., can remain here.
  }, [mapRef.current]); // This ensures the effect runs when mapRef.current changes

  return (
    <>
      <MapContainer center={[11.101100, 76.990900]} zoom={13} style={{ height: '100vh', width: 'calc(100% - 250px)' }}
        whenCreated={mapInstance => { mapRef.current = mapInstance; }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.locations.map((location, index) => (
          <Marker key={index} position={[location.lat, location.lng]} 
                  icon={createCustomMarkerIcon(location.display, textSize)}
                  eventHandlers={{
                    click: () => {
                      setSelectedLocation(location);
                    },
                  }}>
          </Marker>
        ))}
      </MapContainer>
      <SidePane location={selectedLocation} />
    </>
  );
};

export default MapSidePaneComponent;