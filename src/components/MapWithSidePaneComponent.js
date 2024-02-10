import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaLocationDot, FaIndianRupeeSign, FaHouse } from "react-icons/fa6";
import { BsImage } from "react-icons/bs";
import YoutubeEmbed from "./YoutubeEmbed";

// import data from '../resources/data.json'; // Ensure this import path is correct
import data from '../resources/location-data.json'; // Ensure this import path is correct

// Example JSON data
const locationData = data.locations;

// Fixing an issue with the default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const createCustomMarkerIcon = (name, textSize) => new L.DivIcon({
  html: `
    <div style="display: flex; align-items: center;">
      <img src="${L.Icon.Default.prototype.options.iconUrl}" style="margin-right: 4px;"/>
      <span style="font-size: ${textSize}px; font-weight: bold; text-align: left;">${name}</span>
    </div>
  `,
  className: 'custom-marker-icon',
  iconAnchor: [0, 41], // Adjust iconAnchor for proper positioning
  popupAnchor: [0, -34], // Adjust popupAnchor so the popup opens correctly relative to the icon
});

const MapSidePaneComponent = () => {
  const [textSize, setTextSize] = useState(11); // Default text size
  const [selectedLocation, setSelectedLocation] = useState(null); // State to hold the selected location
  const mapRef = useRef(null);

  // Side Pane Content Component
  const SidePane = ({ location }) => {
    if (!location) return <div className="side-pane" style={{ width: '300px', height: '100vh', position: 'absolute', top: '0', right: '0', background: 'whitesmoke', opacity: 0.5, borderLeft: '1px grey solid', padding: '20px', boxSizing: 'border-box' }}>Please select a location <br/>to view the details here.</div>;

    return (
      <div className="side-pane" style={{ width: '300px', height: '100vh', position: 'absolute', top: '0', right: '0', background: 'whitesmoke', padding: '20px', borderLeft: '1px grey solid', boxSizing: 'border-box', textAlign: "left" }}>
        <h2>{location.name}</h2>
        <p> <FaLocationDot /> &nbsp; {location.location}</p>
        <p> <BsImage /> &nbsp; {location.landarea}</p>
        <p> <FaIndianRupeeSign/> &nbsp; {location.price}</p>
        <hr />
        <span className='section'>Amenities:</span>
        <ul>
        {location.amenities.map((amenity, index) => (
          <li key={index}>{amenity}</li>
        ))}
        </ul>
        <span className='section'>Notes:</span>
        <ul>
        {location.notes.split('\n').map((line, index) => (
          <li key={index}>{line}</li>
        ))}
        </ul>
        <span className='section'>Photos & Videos:</span>
        {location.videos.map((videoId, index) => (
          <p>
          <YoutubeEmbed embedId={videoId} />
          </p>
        ))}
        
      </div>
    );
  };

  useEffect(() => {
    // The existing useEffect logic for updating label visibility, etc., can remain here.
  }, [mapRef.current]); // This ensures the effect runs when mapRef.current changes

  return (
    <>
      <MapContainer center={[11.09491, 77.04082]} zoom={13.5} style={{ height: '100vh', width: 'calc(100% - 300px)' }}
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