import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Project } from '../lib/supabase';

interface ProjectMapProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const getMarkerColor = (status: Project['status']) => {
  switch (status) {
    case 'Completed':
      return '#10b981';
    case 'In Progress':
      return '#3b82f6';
    case 'Planning':
      return '#f59e0b';
    case 'On Hold':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

const createCustomIcon = (status: Project['status']) => {
  const color = getMarkerColor(status);
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="${color}" stroke="#fff" stroke-width="2" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function ProjectMap({ projects, onProjectClick }: ProjectMapProps) {
  const nepalCenter: [number, number] = [28.3949, 84.124];

  return (
    <MapContainer
      center={nepalCenter}
      zoom={7}
      className="h-full w-full"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {projects.map((project) => (
        <Marker
          key={project.id}
          position={[project.latitude, project.longitude]}
          icon={createCustomIcon(project.status)}
          eventHandlers={{
            click: () => onProjectClick(project),
          }}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold text-sm">{project.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{project.location}</p>
              <span
                className="inline-block px-2 py-1 text-xs rounded mt-2"
                style={{ backgroundColor: getMarkerColor(project.status), color: 'white' }}
              >
                {project.status}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}