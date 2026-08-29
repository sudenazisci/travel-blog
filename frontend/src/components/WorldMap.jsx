import React, { useState, useEffect } from 'react';
import API_BASE from '../api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import { Plus, Minus } from 'lucide-react';

// Custom Marker Generator
const createCustomMarker = (image, name) => {
    const imageUrl = image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=80';
    return L.divIcon({
        className: 'custom-thumbnail-marker',
        html: `
            <div class="relative flex flex-col items-center group cursor-pointer touch-manipulation">
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1A1918] border-2 border-[#A34828] shadow-md overflow-hidden hover:scale-110 transition-transform duration-200 flex items-center justify-center relative">
                    <img src="${imageUrl}" class="w-full h-full object-cover" alt="${name}" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=80'"/>
                </div>
                <div class="w-1.5 h-1.5 rounded-full bg-[#A34828] mt-0.5"></div>
                <div class="absolute bottom-9 bg-[#1A1918] text-[#FBF9F5] font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    ${name}
                </div>
            </div>
        `,
        iconSize: [32, 38],
        iconAnchor: [16, 36],
        popupAnchor: [0, -34]
    });
};

// Map Pan Controller Component
const MapPanController = ({ panTarget }) => {
    const map = useMap();
    useEffect(() => {
        if (panTarget) {
            map.setView(panTarget.coords, panTarget.zoom, { animate: true, duration: 1.2 });
        }
    }, [panTarget, map]);
    return null;
};

// Custom Zoom Controls Component
const CustomZoomControls = () => {
    const map = useMap();

    return (
        <div className="absolute bottom-4 right-4 z-[999] flex flex-col gap-1 shadow-md">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    map.zoomIn();
                }}
                className="w-8 h-8 bg-[#FBF9F5] hover:bg-[#A34828] text-[#1A1918] hover:text-white border border-[#1A1918]/20 flex items-center justify-center font-bold text-base transition-colors shadow-sm cursor-pointer"
                title="Yakınlaştır (+)"
                aria-label="Yakınlaştır"
            >
                <Plus size={16} />
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    map.zoomOut();
                }}
                className="w-8 h-8 bg-[#FBF9F5] hover:bg-[#A34828] text-[#1A1918] hover:text-white border border-[#1A1918]/20 flex items-center justify-center font-bold text-base transition-colors shadow-sm cursor-pointer"
                title="Uzaklaştır (-)"
                aria-label="Uzaklaştır"
            >
                <Minus size={16} />
            </button>
        </div>
    );
};

const WorldMap = ({ settings }) => {
    const navigate = useNavigate();
    const [destinations, setDestinations] = useState([]);
    const [panTarget, setPanTarget] = useState(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/destinations`);
                setDestinations(res.data);
            } catch (err) {
                console.error('Error fetching destinations:', err);
            }
        };
        fetchDestinations();
    }, []);

    return (
        <div className="w-full bg-[#F4F0E8] overflow-hidden border border-[#1A1918]/15 relative group h-[280px] sm:h-[320px] flex flex-col z-0">

            {/* Header Layer */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-[500] pointer-events-none">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#A34828] bg-[#FBF9F5]/90 px-2.5 py-0.5 border border-[#1A1918]/15">
                    ROTA HARİTASI • {settings?.mapVisitedCountryCount || '60'} ÜLKE
                </span>
            </div>

            {/* Leaflet Map Container */}
            <div className="w-full h-full relative z-0">
                <MapContainer
                    center={[25, 10]}
                    zoom={2}
                    scrollWheelZoom={true}
                    touchZoom={true}
                    className="w-full h-full outline-none z-0 bg-[#F4F0E8]"
                    zoomControl={false}
                    attributionControl={false}
                    minZoom={2}
                    maxZoom={12}
                    maxBounds={[[-90, -180], [90, 180]]}
                    maxBoundsViscosity={1.0}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Pan Controller */}
                    <MapPanController panTarget={panTarget} />

                    {/* Custom Zoom Buttons (+ / -) */}
                    <CustomZoomControls />

                    {destinations.map((dest) => (
                        <Marker
                            key={dest._id}
                            position={[dest.lat || 39.9, dest.lng || 32.8]}
                            icon={createCustomMarker(dest.image, dest.name)}
                        >
                            <Popup className="custom-leaflet-popup">
                                <div 
                                    className="w-48 overflow-hidden bg-[#FBF9F5] shadow-lg flex flex-col cursor-pointer border border-[#1A1918]/15"
                                    onClick={() => navigate(`/destination/${dest._id}`)}
                                >
                                    <div className="h-24 w-full overflow-hidden relative">
                                        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918]/80 via-transparent to-transparent"></div>
                                        <span className="absolute bottom-2 left-2 text.white font-serif font-normal text-sm leading-tight text-white">
                                            {dest.name}
                                        </span>
                                    </div>
                                    <div className="p-2.5 flex flex-col justify-between bg-[#FBF9F5]">
                                        <p className="text-[10px] text-[#4A4744] line-clamp-2 leading-relaxed mb-2 font-sans font-light">
                                            {dest.description || 'Destinasyon rehberini inceleyin.'}
                                        </p>
                                        <div className="flex items-center justify-between text-[#A34828] text-[10px] font-mono font-bold uppercase tracking-wider">
                                            <span>Rehberi Oku</span>
                                            <span>→</span>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Quick Destination Pills at Bottom Left */}
            <div className="absolute bottom-3 left-3 z-[500] hidden sm:flex gap-1.5 overflow-x-auto max-w-[60%] pointer-events-auto">
                {destinations.slice(0, 4).map((dest) => (
                    <button
                        key={dest._id}
                        onClick={() => setPanTarget({ coords: [dest.lat || 39.9, dest.lng || 32.8], zoom: 6 })}
                        className="flex items-center gap-1.5 bg-[#FBF9F5]/95 px-2.5 py-1 border border-[#1A1918]/15 hover:border-[#A34828] transition-colors shrink-0 cursor-pointer font-mono text-[10px] uppercase text-[#1A1918]"
                    >
                        <span>{dest.name}</span>
                    </button>
                ))}
            </div>

        </div>
    );
};

export default WorldMap;
