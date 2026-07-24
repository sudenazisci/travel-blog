import React, { useState, useEffect } from 'react';
import API_BASE from '../api';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

// Custom Marker Icon Generator using DivIcon
const createCustomMarker = (image, name) => {
    const imageUrl = image || 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
    return L.divIcon({
        className: 'custom-thumbnail-marker',
        html: `
            <div class="relative flex flex-col items-center group cursor-pointer animate-fade-in">
                <!-- Outer Glowing Circle -->
                <div class="w-10 h-10 rounded-full bg-white border-2 border-primary shadow-xl overflow-hidden hover:scale-110 hover:border-accent hover:shadow-2xl transition-all duration-300 flex items-center justify-center">
                    <img src="${imageUrl}" class="w-full h-full object-cover" alt="${name}" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=80'"/>
                </div>
                <!-- Triangle Pin Pointer -->
                <div class="w-2.5 h-2.5 bg-primary rotate-45 -mt-1 shadow-md border-r border-b border-primary group-hover:bg-accent group-hover:border-accent transition-all duration-300"></div>
                
                <!-- Micro-Tooltip on hover -->
                <div class="absolute bottom-12 bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-sans font-bold px-2 py-0.5 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    ${name}
                </div>
            </div>
        `,
        iconSize: [40, 46],
        iconAnchor: [20, 44],
        popupAnchor: [0, -42]
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
        <div className="w-full bg-slate-50 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-slate-200 relative group h-[320px] md:h-[480px] flex flex-col z-0">

            {/* Header/Title Layer (Left Aligned Gallery Style) */}
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-[500] pointer-events-none">
                <div className="flex flex-col items-start text-left">
                    <h2 className="text-2xl md:text-4xl font-serif italic text-slate-900 tracking-tight drop-shadow-sm">
                        Keşif Haritası
                    </h2>
                    <p className="text-[8px] md:text-[10px] font-medium text-slate-500 uppercase tracking-[0.3em] mt-1 md:mt-2 bg-white/70 backdrop-blur-sm px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/40 shadow-sm">
                        Dünyayı Geziyorum
                    </p>
                </div>
            </div>

            {/* Map Container */}
            <div className="w-full h-full relative z-0">
                <MapContainer
                    center={[25, 10]}
                    zoom={2}
                    scrollWheelZoom={true}
                    className="w-full h-full outline-none z-0 bg-[#f8f9fa]"
                    zoomControl={false}
                    attributionControl={false}
                    minZoom={2}
                    maxBounds={[[-90, -180], [90, 180]]}
                    maxBoundsViscosity={1.0}
                >
                    {/* CartoDB Voyager Tile Layer */}
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    {/* Zoom Control at Bottom Right */}
                    <ZoomControl position="bottomright" />

                    {/* Custom Pan Controller */}
                    <MapPanController panTarget={panTarget} />

                    {destinations.map((dest) => (
                        <Marker
                            key={dest._id}
                            position={[dest.lat, dest.lng]}
                            icon={createCustomMarker(dest.image, dest.name)}
                        >
                            <Popup className="custom-leaflet-popup">
                                <div 
                                    className="w-56 overflow-hidden rounded-xl bg-white shadow-xl flex flex-col cursor-pointer transition-transform hover:scale-[1.02]"
                                    onClick={() => navigate(`/destination/${dest._id}`)}
                                >
                                    <div className="h-28 w-full overflow-hidden relative">
                                        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                                        <span className="absolute bottom-2 left-3 text-white font-serif font-bold text-sm leading-tight drop-shadow-md">
                                            {dest.name}
                                        </span>
                                    </div>
                                    <div className="p-3 flex flex-col justify-between flex-grow bg-white">
                                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2 font-sans">
                                            {dest.description || 'Bu muhteşem destinasyonu ve gezi yazılarını keşfedin.'}
                                        </p>
                                        <div className="flex items-center justify-between text-accent text-xs font-semibold hover:underline">
                                            <span>Yazıları Oku</span>
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Bottom Panel - Stats (Left Aligned Floating Pill) */}
            <div className="absolute bottom-8 left-8 z-[500] hidden md:flex pointer-events-none">
                <div className="flex items-center gap-8 bg-white/80 backdrop-blur-md px-8 py-3 rounded-full shadow-lg border border-white/50 ring-1 ring-black/5">
                    {/* Total Miles */}
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Toplam Mil</span>
                        <span className="text-xl font-serif italic text-slate-900 leading-none">{settings?.mileCount || '0'}</span>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-6 bg-slate-300 transform rotate-12"></div>

                    {/* Country Count */}
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Ülke</span>
                        <span className="text-xl font-serif italic text-slate-900 leading-none">{settings?.countryCount || '0'}</span>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-6 bg-slate-300 transform rotate-12"></div>

                    {/* City Count */}
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Şehir</span>
                        <span className="text-xl font-serif italic text-slate-900 leading-none">{settings?.cityCount || '0'}</span>
                    </div>
                </div>
            </div>

            {/* Floating Destination Quick-Selector */}
            <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:right-8 md:left-auto z-[500] flex gap-2 overflow-x-auto no-scrollbar py-2 px-1 max-w-full md:max-w-[50%] pointer-events-auto">
                {destinations.map((dest) => (
                    <button
                        key={dest._id}
                        onClick={() => setPanTarget({ coords: [dest.lat, dest.lng], zoom: 6 })}
                        className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/40 hover:bg-white transition-all shrink-0 hover:scale-105 active:scale-95 cursor-pointer animate-fade-in"
                    >
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                            <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=40'" />
                        </div>
                        <span className="text-[11px] font-sans font-semibold text-slate-800">{dest.name}</span>
                    </button>
                ))}
            </div>

        </div>
    );
};

export default WorldMap;
