import React, {useState, useEffect, useRef} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import MarkerClusterGroup from 'react-leaflet-markercluster';
// import 'react-leaflet-markercluster/dist/styles.min.css'; // Import stylesheet
import data from '../resources/data.json';

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

const MapComponent = () => {
  const [textSize, setTextSize] = useState(11); // Default text size
  const mapRef = useRef(null);
  const [visibleLabels, setVisibleLabels] = useState(locationData.map(() => true)); // Initialize all labels as visible

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current.leafletElement;

    const checkOverlap = (box1, box2) => {
      if (box1.x > box2.x + box2.width || box1.x + box1.width < box2.x || box1.y > box2.y + box2.height || box1.y + box1.height < box2.y) {
        return false;
      }
      return true;
    };

    const updateLabelVisibility = () => {
      const labelsBounds = locationData.map(location => getLabelBounds(location, map));
      const newVisibility = labelsBounds.map((bounds1, index1) => {
        return !labelsBounds.some((bounds2, index2) => index1 !== index2 && checkOverlap(bounds1, bounds2));
      });

      setVisibleLabels(newVisibility);
    };

    // Register the map event listeners
    map.on('zoomend', updateLabelVisibility);
    map.on('moveend', updateLabelVisibility);

    // Initial update for label visibility
    updateLabelVisibility();

    // Cleanup function to remove event listeners
    return () => {
      map.off('zoomend', updateLabelVisibility);
      map.off('moveend', updateLabelVisibility);
    };
  }, [mapRef.current]);

  return (
    <MapContainer center={[11.101100, 76.990900]} zoom={13} style={{ height: '100vh', width: '100%' }}
      whenCreated={mapInstance => { mapRef.current = mapInstance; }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locationData.map((location, index) => (
        visibleLabels[index] && (
          <Marker key={index} position={[location.lat, location.lng]} 
                  icon={createCustomMarkerIcon(location.display, textSize)}>
            <Popup>
              <b>{location.name}</b><br />
              {location.info.split('\n').map((line, index) => (
                <React.Fragment key={index}>{line}<br /></React.Fragment>
              ))}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
};

export default MapComponent;

function getLabelBounds(marker, map) {
  // Estimate text dimensions (simplified example)
  const averageCharWidth = 8; // Average width of a character in pixels
  const fontSize = 11; // Font size in pixels
  const padding = 4; // Additional padding around text

  const textLength = marker.name.length;
  const textWidth = textLength * averageCharWidth + padding * 2;
  const textHeight = fontSize + padding * 2;

  // Convert the marker's LatLng to a Leaflet Point
  const markerPoint = map.latLngToLayerPoint([marker.lat, marker.lng]);

  // Assuming the label is centered above the marker icon
  const labelX = markerPoint.x - textWidth / 2;
  const labelY = markerPoint.y - textHeight - 40; // Adjust based on marker icon height

  return {
    x: labelX,
    y: labelY,
    width: textWidth,
    height: textHeight
  };
}