// EventsPreview.js
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import EventModal from './EventModal';
import placeholderImg from '../assets/logo.png';
import { FaComments } from 'react-icons/fa';
import DombraIcon from '../assets/dombra.svg';

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
const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 2.5rem;
`;
const FilterBtn = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5em;
  background: ${({ $active, theme, children }) => {
    if (children === 'Национальные') {
      return $active ? `${theme.colors.ethnic}, url('data:image/svg+xml;utf8,<svg width=\'80\' height=\'40\' viewBox=\'0 0 80 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M0 40 Q40 0 80 40\' stroke=\'%23FF4E50\' stroke-width=\'6\' fill=\'none\'/></svg>') bottom/100% 40% no-repeat` : theme.colors.card;
    }
    return $active ? theme.colors.primary : theme.colors.card;
  }};
  color: ${({ $active, theme, children }) => {
    if (children === 'Национальные') {
      return $active ? '#fff' : theme.colors.secondary;
    }
    return $active ? '#fff' : theme.colors.secondary;
  }};
  border-radius: 999px;
  padding: 0.5rem 1.3rem;
  font-weight: 600;
  font-size: 1rem;
  border: 1.5px solid ${({ theme, children }) => (children === 'Национальные' ? '#FF4E50' : theme.colors.primary)};
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: background 0.18s, color 0.18s;
  &:hover {
    background: ${({ theme, children }) => (children === 'Национальные' ? theme.colors.ethnic : theme.colors.accent)};
    color: #fff;
  }
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.2rem;
  max-width: 1200px;
  margin: 0 auto;
`;
const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: box-shadow 0.18s, transform 0.18s, border 0.18s;
  &:hover {
    box-shadow: 0 8px 32px rgba(0,0,0,0.10);
    transform: translateY(-2px) scale(1.01);
  }
  &.map-highlight {
    border: 3px solid #FFBA00;
    box-shadow: 0 0 0 6px #FFBA0033;
    transition: border 0.18s, box-shadow 0.18s;
    animation: highlight-fade 1.2s;
  }
  @keyframes highlight-fade {
    0% { border-color: #FFBA00; box-shadow: 0 0 0 8px #FFBA0033; }
    100% { border-color: ${({ theme }) => theme.colors.card}; box-shadow: 0 0 0 0 #FFBA0000; }
  }
`;
const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  background: #f5f5f5;
`;
const CardContent = styled.div`
  padding: 1.2rem 1.2rem 1.5rem 1.2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;
const EventTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const EventDesc = styled.p`
  font-size: 1rem;
  color: #444;
  margin-bottom: 0.7rem;
  min-height: 2.2em;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const EventMeta = styled.div`
  font-size: 0.97rem;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 0.7rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  align-items: center;
`;
const Place = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
`;
const DateTime = styled.span`
  color: #888;
`;
const ParticipantsCount = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.98em;
  background: ${({ theme }) => theme.colors.muted};
  border-radius: 1em;
  padding: 0.1em 0.7em;
`;
const RSVPBtn = styled.button`
  background: ${({ $active, theme }) => $active ? theme.colors.primary : theme.colors.yellow};
  color: ${({ $active, theme }) => $active ? '#fff' : theme.colors.secondary};
  font-weight: 700;
  border-radius: 999px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  margin-top: auto;
  box-shadow: ${({ theme }) => theme.boxShadow};
  border: none;
  transition: background 0.18s, color 0.18s;
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
  }
`;
const Skeleton = styled.div`
  background: #eee;
  border-radius: ${({ theme }) => theme.borderRadius};
  min-height: 260px;
  width: 100%;
  animation: pulse 1.2s infinite ease-in-out;
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const EthnicOrnament = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 64px;
  height: 64px;
  background: url('data:image/svg+xml;utf8,<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32C0 14.3269 14.3269 0 32 0ZM32 4C16.536 4 4 16.536 4 32C4 47.464 16.536 60 32 60C47.464 60 60 47.464 60 32C60 16.536 47.464 4 32 4ZM32 12C39.732 12 46 18.268 46 26C46 33.732 39.732 40 32 40C24.268 40 18 33.732 18 26C18 18.268 24.268 12 32 12ZM32 16C26.4772 16 22 20.4772 22 26C22 31.5228 26.4772 36 32 36C37.5228 36 42 31.5228 42 26C42 20.4772 37.5228 16 32 16Z" fill="%23F9D423" fill-opacity="0.22"/></svg>') no-repeat center/contain;
  pointer-events: none;
`;

const categories = [
  'Все',
  'Музыка',
  'Образование',
  'Спорт',
  'Волонтёрство',
  'Национальные',
  'Другое',
];

const EventsPreview = ({ newEvent, userId, user }) => {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('Все');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [comments, setComments] = useState([]);
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [imgError, setImgError] = useState({});
  const [joinedEvents, setJoinedEvents] = useState([]); // id событий, где user RSVP = 'going'
  const [showJoinToast, setShowJoinToast] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    if (newEvent && !events.find(e => e.id === newEvent.id)) {
      setEvents(evts => [newEvent, ...evts]);
    }
  }, [newEvent]);

  const openModal = (event) => {
    setSelected(event);
    setModalOpen(true);
    fetch(`/events/${event.id}`)
      .then(res => res.json())
      .then(data => setEventDetails(data));
    fetch(`/events/${event.id}/participants`)
      .then(res => res.json())
      .then(data => setParticipants(data));
    fetch(`/events/${event.id}/comments`)
      .then(res => res.json())
      .then(data => setComments(data));
    if (userId) {
      fetch(`/events/${event.id}/my_rsvp?user_id=${userId}`)
        .then(res => res.json())
        .then(data => {
          setRsvpStatus(data.status);
          if (data.status === 'going') {
            setJoinedEvents(prev => prev.includes(event.id) ? prev : [...prev, event.id]);
          }
        });
    } else {
      setRsvpStatus(null);
    }
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
    setEventDetails(null);
    setParticipants([]);
    setComments([]);
    setRsvpStatus(null);
  };
  const handleRSVP = (status) => {
    if (!selected || !userId) return;
    fetch(`/events/${selected.id}/rsvp?user_id=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then(res => res.json())
      .then((updatedParticipants) => {
        if (Array.isArray(updatedParticipants)) {
          setParticipants(updatedParticipants);
          // После RSVP обновим свой статус и комментарии
          fetch(`/events/${selected.id}/my_rsvp?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
              setRsvpStatus(data.status);
              if (data.status === 'going' && !joinedEvents.includes(selected.id)) {
                setJoinedEvents(prev => [...prev, selected.id]);
                setShowJoinToast(true);
                setTimeout(() => setShowJoinToast(false), 2500);
              }
            });
          fetch(`/events/${selected.id}/comments`)
            .then(res => res.json())
            .then(data => setComments(data));
        }
      });
  };
  const handleComment = (text) => {
    if (!selected || !user) return;
    fetch(`/events/${selected.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: user.name, text }),
    })
      .then(res => res.json())
      .then(newComment => setComments(prev => [...prev, newComment]));
  };

  // Считаем участников по статусу для каждого события
  const getStatusCounts = (eventId) => {
    if (!participants || !participants.length || !modalOpen || !selected || selected.id !== eventId) {
      return { going: 0, maybe: 0, cant: 0 };
    }
    const counts = { going: 0, maybe: 0, cant: 0 };
    participants.forEach(p => {
      if (p.status && counts[p.status] !== undefined) counts[p.status]++;
    });
    return counts;
  };

  const filtered = category === 'Все' ? events : events.filter(e => e.category === category);

  // Обновлять данные при смене userId, если модалка открыта
  React.useEffect(() => {
    if (modalOpen && selected && userId) {
      fetch(`/events/${selected.id}/participants`)
        .then(res => res.json())
        .then(data => setParticipants(data));
      fetch(`/events/${selected.id}/my_rsvp?user_id=${userId}`)
        .then(res => res.json())
        .then(data => setRsvpStatus(data.status));
    }
    if (modalOpen && selected && !userId) {
      setRsvpStatus(null);
    }
  }, [userId]);

  return (
    <Wrapper id="events">
      {showJoinToast && (
        <div style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#6D9773',
          color: '#fff',
          padding: '0.7em 2em',
          borderRadius: 16,
          zIndex: 3000,
          fontWeight: 600,
          boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 18,
          animation: 'fadeInOut 2.5s'
        }}>
          <FaComments style={{ fontSize: 22, marginRight: 8 }} />
          Вы записались, теперь можете писать в чате
        </div>
      )}
      <Title>Актуальные события</Title>
      <FilterBar>
        {categories.map(cat => (
          <FilterBtn
            key={cat}
            $active={cat === category}
            onClick={() => setCategory(cat)}
          >
            {cat === 'Национальные' && (
              <img src={DombraIcon} alt="Домбры" style={{ width: 22, height: 22, marginRight: 4, verticalAlign: 'middle' }} />
            )}
            {cat}
          </FilterBtn>
        ))}
      </FilterBar>
      {loading ? (
        <Grid>
          {[...Array(4)].map((_, i) => <Skeleton key={i} />)}
        </Grid>
      ) : (
        <Grid>
          {filtered.map(event => {
            const counts = getStatusCounts(event.id);
            return (
              <Card key={event.id} id={`event-${event.id}`} style={{ cursor: 'pointer', position: 'relative' }}>
                {event.category === 'Национальные' && <EthnicOrnament />}
                <Image
                  src={imgError[event.id] || !event.image_url ? placeholderImg : event.image_url}
                  alt={event.title}
                  onError={() => setImgError(err => ({ ...err, [event.id]: true }))}
                />
                <CardContent>
                  <EventTitle title={event.title}>{event.title}</EventTitle>
                  <EventDesc>{event.description}</EventDesc>
                  <EventMeta>
                    <Place>{event.location}</Place>
                    <DateTime>{new Date(event.date).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</DateTime>
           
                  </EventMeta>
                  <RSVPBtn
                    $active={joinedEvents.includes(event.id)}
                    onClick={() => openModal(event)}
                  >
                    {joinedEvents.includes(event.id) ? "Вы идёте" : "Я пойду!"}
                  </RSVPBtn>
                  {joinedEvents.includes(event.id) && (
                    <span
                      title="Чат/Комментарии"
                      style={{ position: 'absolute', top: 12, right: 18, cursor: 'pointer', color: '#6D9773', fontSize: 24, zIndex: 2 }}
                      onClick={e => { e.stopPropagation(); openModal(event); }}
                    >
                      <FaComments />
                    </span>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Grid>
      )}
      <EventModal
        event={eventDetails}
        open={modalOpen}
        onClose={closeModal}
        rsvpStatus={rsvpStatus}
        onRSVP={handleRSVP}
        participants={participants}
        comments={comments}
        onComment={handleComment}
        userId={userId}
        user={user}
        onJoined={() => {
          if (selected && !joinedEvents.includes(selected.id)) {
            setJoinedEvents(prev => [...prev, selected.id]);
            setShowJoinToast(true);
            setTimeout(() => setShowJoinToast(false), 2500);
            // Принудительно обновить selected, чтобы карточка перерисовалась
            setSelected({ ...selected });
          }
        }}
      />
    </Wrapper>
  );
};

export default EventsPreview; 