import React, {useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'react-leaflet-markercluster/dist/styles.min.css'; // Import stylesheet


// Example JSON data
const locationData = [
  { name: "Sydney Sixers(16L)", lat: 11.101100, lng: 76.990900, info: "Nivara Avenue Group \n3.5 to 4 cents \nNorth facing \nUp & Down road route \nTidel Park back side" },
  { name: "Nivara Avenue", lat: 11.0976515, lng:76.9918195, info: "3km from Saravanampatti junction \n16L per cent \nMurugan temple near by" },

  { name: "Location 2", lat: 11.438517, lng: 77.559867, info: "Pon Parappi Amman Kovil" },
  // Add more locations as needed
];

// Fixing an issue with the default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icon using DivIcon
const createCustomMarkerIcon = (name) => new L.DivIcon({
  html: `<div class="custom-marker">${name}<br/><img src="https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"/></div>`,
  className: 'leaflet-div-icon',
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -41], // Point from which the popup should open relative to the iconAnchor
});

const MapComponent = () => {
  // const map = useMap();

  // useEffect(() => {
  //   const handleZoomEnd = () => {
  //     const currentZoom = map.getZoom();
  //     // Adjust visibility of labels based on currentZoom
  //     // This might involve adding or removing labels, or adjusting their style
  //   };

  //   map.on('zoomend', handleZoomEnd);
  //   return () => {
  //     map.off('zoomend', handleZoomEnd);
  //   };
  // }, [map]);

  return (
    <MapContainer center={[11.101100, 76.990900]} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* <MarkerClusterGroup> */}
          {locationData.map((location, index) => (
            <Marker key={index} position={[location.lat, location.lng]} icon={createCustomMarkerIcon(location.name)}>
              <Popup>
                <b>{location.name}</b><br />
                {location.info.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}<br />
                  </React.Fragment>
                ))}
              </Popup>
            </Marker>
          ))}
        {/* </MarkerClusterGroup> */}
    </MapContainer>
    );
}

export default MapComponent;
