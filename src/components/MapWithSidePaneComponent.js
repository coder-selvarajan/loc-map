import React, { useState, useRef } from 'react';
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
  // const [isPopupVisible, setIsPopupVisible] = useState(false); // State for controlling popup visibility
  const mapRef = useRef(null);
  
  // Check if the screen is mobile size
  // const isMobile = window.innerWidth < 768;

  // Side Pane Content Component
  const SidePane = ({ location, onClose }) => {
    if (!location) return null;

    // if (!location) return <div className="side-pane" style={{ width: '300px', height: '100vh', position: 'absolute', top: '0', right: '0', background: 'whitesmoke', opacity: 0.5, borderLeft: '1px grey solid', padding: '20px', boxSizing: 'border-box' }}>Please select a location <br/>to view the details here.</div>;

    return (
      
      // <div className={`side-pane ${isMobile ? 'mobile-popup' : ''}`} style={{ width: '300px', height: '100vh', position: 'absolute', top: '0', right: isMobile ? '0' : 'initial', background: 'whitesmoke', padding: '20px', borderLeft: '1px grey solid', boxSizing: 'border-box', textAlign: "left", zIndex: 1000 }}>
      //   {isMobile && <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', fontSize: '24px' }}><FaTimes /></button>}
      //   <h2>{location.name}</h2>

      <div className="side-pane" style={{ width: '300px', height: '100vh', position: 'absolute', top: '0', right: '0', background: 'whitesmoke', padding: '20px', borderLeft: '1px grey solid', boxSizing: 'border-box', textAlign: "left" }}>
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

  // Open popup when a location is selected on mobile
  // useEffect(() => {
  //   if (isMobile) setIsPopupVisible(true);
  // }, [selectedLocation, isMobile]);

  return (
    <>
      {/* <MapContainer center={[11.09491, 77.04082]} zoom={13.5} style={{ height: '100vh', width: isMobile ? '100%' : 'calc(100% - 300px)' }}
          whenCreated={mapInstance => { mapRef.current = mapInstance; }}> */}
      <MapContainer center={[11.09491, 77.04082]} zoom={12.5} style={{ height: '100vh', width: 'calc(100% - 300px)' }}
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
                      
                    },
                  }}>
          </Marker>
          
        ))}
      </MapContainer>
      {/* {(isMobile && isPopupVisible) && <SidePane location={selectedLocation} onClose={() => setIsPopupVisible(false)} />}
      {!isMobile && <SidePane location={selectedLocation} />} */}

      <SidePane location={selectedLocation} />
    </>
  );
};

export default MapSidePaneComponent;


