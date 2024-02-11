import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaLocationDot, FaIndianRupeeSign, FaLink } from "react-icons/fa6";
import { BsImage } from "react-icons/bs";
import YoutubeEmbed from "./YoutubeEmbed";
import data from '../resources/location-data.json';

// Fixing an issue with the default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const createCustomMarkerIcon = (name, isSelected) => new L.DivIcon({
  html: `
    <div style="display: flex; align-items: center; padding: 4px; border-radius: 8px;">
      <img src="${L.Icon.Default.prototype.options.iconUrl}" style="margin-right: 4px;"/>
      <span style="font-size: ${isSelected ? '12' : '11'}px; color: ${isSelected ? 'red' : 'black'}; font-weight: bold; text-align: left;">${name}</span>
    </div>
  `,
  className: 'custom-marker-icon',
  iconAnchor: [0, 41], // Adjust iconAnchor for proper positioning
  popupAnchor: [0, -34], // Adjust popupAnchor so the popup opens correctly relative to the icon
});

const MapSidePaneComponent = () => {
  const [selectedLocation, setSelectedLocation] = useState(data.locations[0]); // State to hold the selected location
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768); // Added to detect mobile view
  const [isPopupVisible, setIsPopupVisible] = useState(false); // Added to control popup visibility on mobile

  // Update isMobileView based on window width
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mapRef = useRef(null);
  
  // Side Pane Content Component
  const SidePane = ({ location, onClose }) => {
    if (!location) return null;

    const handleClose = () => {
      setIsPopupVisible(false); // Hide the popup when close button is clicked
    };

    return (
      <div className={`side-pane ${isMobileView && isPopupVisible ? 'mobile-popup' : ''}`} >
        {isMobileView && <button onClick={handleClose} style={{ position: 'absolute', top: '10px', right: '10px' }}>Close</button>}
        <h2>{location.name}</h2>
        
        <p> <FaLocationDot /> &nbsp; {location.location}</p>
        <p> <BsImage /> &nbsp; {location.landarea}</p>
        <p> <FaIndianRupeeSign/> &nbsp; {location.price}</p>
        <p> 
        { (location.links.length > 0) && 
          <>
            <FaLink/> 
            {location.links.map((link, index) => (
              <span key={index}>&nbsp; &nbsp; <a href={link} target='_blank' rel="noreferrer">Website</a>&nbsp; </span>
            ))}
          </> } 
        </p>
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
        { (location.videos.length > 0) && <span className='section'>Videos:</span>}
        
        {location.videos.map((videoId, index) => (
          <p>
          <YoutubeEmbed embedId={videoId} />
          </p>
        ))}
        
      </div>
    );
  };

  return (
    <>
     <MapContainer center={[11.09491, 77.04082]} zoom={12.5} style={{ height: '100vh', width: '100%' }}
        whenCreated={mapInstance => { mapRef.current = mapInstance; }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {data.locations.map((location, index) => (
          <Marker key={index} position={[location.lat, location.lng]} 
                  icon={createCustomMarkerIcon(location.display, selectedLocation === location)}
                  eventHandlers={{
                    click: () => {
                      setSelectedLocation(location);
                      if (isMobileView) {
                        setIsPopupVisible(true)
                      }
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
