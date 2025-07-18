// MapSection.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Wrapper = styled.section`
  background: ${({ theme }) => theme.colors.background};
  padding: 56px 0 48px 0;
`;
const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 2.2rem;
`;
const MapWrap = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

const DEFAULT_CENTER = [51.09, 71.41];

const MapSection = () => {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch('/events')
      .then(res => res.json())
      .then(data => setEvents(data.filter(ev => ev.lat && ev.lng)));
  }, []);

  const handleGoToEvent = (id) => {
    const el = document.getElementById(`event-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('map-highlight');
      setTimeout(() => el.classList.remove('map-highlight'), 1600);
    } else {
      window.location.hash = 'events';
    }
  };

  const center = events.length > 0 ? [parseFloat(events[0].lat), parseFloat(events[0].lng)] : DEFAULT_CENTER;

  return (
    <Wrapper id="map">
      <Title>Карта событий</Title>
      <MapWrap>
        <MapContainer center={center} zoom={12} style={{ height: 400, width: '100%' }} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {events.map(ev => (
            <Marker key={ev.id} position={[parseFloat(ev.lat), parseFloat(ev.lng)]}>
              <Popup>
                <div style={{minWidth:180}}>
                  <b>{ev.title}</b>
                  <br/>
                  <button style={{marginTop:8,background:'#FFBA00',color:'#0C3B2E',border:'none',borderRadius:8,padding:'4px 12px',fontWeight:600,cursor:'pointer'}} onClick={() => handleGoToEvent(ev.id)}>
                    Перейти
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </MapWrap>
    </Wrapper>
  );
};

export default MapSection; 