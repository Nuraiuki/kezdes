// EventModal.js
import React from 'react';
import styled from 'styled-components';
import placeholderImg from '../assets/logo.png';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.32);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Modal = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  max-width: 540px;
  width: 100%;
  padding: 2.2rem 2rem 1.5rem 2rem;
  position: relative;
`;
const CloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.7rem;
  border: none;
  cursor: pointer;
`;
const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 1.2rem;
`;
const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 0.5rem;
`;
const Meta = styled.div`
  color: ${({ theme }) => theme.colors.accent};
  font-size: 1rem;
  margin-bottom: 0.7rem;
`;
const Desc = styled.p`
  color: #444;
  font-size: 1.05rem;
  margin-bottom: 1.2rem;
`;
const RSVPBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.2rem;
`;
const RSVPBtn = styled.button`
  background: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.yellow)};
  color: ${({ active, theme }) => (active ? '#fff' : theme.colors.secondary)};
  font-weight: 700;
  border-radius: 999px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  border: none;
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: background 0.18s, color 0.18s;
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
  }
`;
const SectionTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  margin: 1.2rem 0 0.5rem 0;
`;
const Participants = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
`;
const DateTime = styled.div`
  color: #888;
  font-size: 1.05rem;
  margin-bottom: 0.7rem;
`;
const Avatar = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  margin-right: 0.5rem;
`;
const Participant = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.muted};
  color: ${({ theme }) => theme.colors.secondary};
  border-radius: 999px;
  padding: 0.3rem 1rem 0.3rem 0.3rem;
  font-size: 0.98rem;
`;
const Comments = styled.div`
  max-height: 120px;
  overflow-y: auto;
  margin-bottom: 0.7rem;
`;
const Comment = styled.div`
  background: ${({ theme }) => theme.colors.muted};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.5rem 0.8rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 0.97rem;
  word-break: break-word;
`;
const AddComment = styled.form`
  display: flex;
  gap: 0.7rem;
`;
const Input = styled.input`
  flex: 1;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  padding: 0.5rem 1rem;
  font-size: 1rem;
`;
const SubmitBtn = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  border: none;
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: background 0.18s;
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

const RSVP_STATUSES = [
  { key: 'going', label: 'Иду', emoji: '✅' },
  { key: 'maybe', label: 'Может быть', emoji: '🤔' },
  { key: 'cant', label: 'Не могу', emoji: '❌' },
];

const StatusTabs = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-bottom: 1.1rem;
`;
const StatusTab = styled.button`
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.muted)};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.secondary)};
  border-radius: 999px;
  padding: 0.4rem 1.1rem;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: background 0.18s, color 0.18s;
  cursor: pointer;
`;
const StatusList = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-bottom: 0.7rem;
`;
const StatusCount = styled.div`
  background: ${({ theme }) => theme.colors.muted};
  color: ${({ theme }) => theme.colors.secondary};
  border-radius: 1em;
  padding: 0.2em 0.9em;
  font-size: 0.98em;
  display: flex;
  align-items: center;
  gap: 0.4em;
`;

const EventModal = ({ event, open, onClose, rsvpStatus, onRSVP, participants, comments, onComment, userId, onJoined }) => {
  const [comment, setComment] = React.useState('');
  const [localRsvp, setLocalRsvp] = React.useState(rsvpStatus);
  const [showToast, setShowToast] = React.useState(false);
  // Считаем участников по статусу
  const statusLists = { going: [], maybe: [], cant: [] };
  (participants || []).forEach(u => {
    if (u.status && statusLists[u.status]) statusLists[u.status].push(u);
  });
  // обновлять участников и комментарии после RSVP/коммента
  const refresh = () => {
    if (!event) return;
    fetch(`/events/${event.id}/participants`).then(r=>r.json()).then(setParticipants=>{});
    fetch(`/events/${event.id}/comments`).then(r=>r.json()).then(setComments=>{});
  };
  React.useEffect(() => {
    setLocalRsvp(rsvpStatus);
  }, [rsvpStatus]);
  const handleRSVPClick = (status) => {
    if (localRsvp !== status) {
      onRSVP(status);
      setLocalRsvp(status);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1500);
      setTimeout(refresh, 400);
      if (status === 'going' && typeof onJoined === 'function') {
        onJoined();
      }
    }
  };
  if (!open || !event) return null;
  return (
    <Overlay>
      <Modal>
        <CloseBtn onClick={onClose} title="Закрыть">×</CloseBtn>
        {showToast && (
          <div style={{position:'fixed',top:24,left:'50%',transform:'translateX(-50%)',background:'#6D9773',color:'#fff',padding:'0.7em 1.5em',borderRadius:12,zIndex:3000,fontWeight:600,boxShadow:'0 4px 24px rgba(0,0,0,0.12)'}}>Статус обновлён!</div>
        )}
        <Image src={!event.image_url ? placeholderImg : event.image_url} alt={event.title} onError={e => { e.target.onerror = null; e.target.src = placeholderImg; }} />
        <Title>{event.title}</Title>
        <DateTime>{new Date(event.date).toLocaleString('ru-RU', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })} · {event.category}</DateTime>
        <Meta>{event.location}</Meta>
        <Desc>{event.description}</Desc>
        <StatusTabs>
          {RSVP_STATUSES.map(r => (
            <StatusTab
              key={r.key}
              $active={localRsvp === r.key}
              onClick={() => { onRSVP(r.key); }}
            >
              {r.emoji} {r.label}
            </StatusTab>
          ))}
        </StatusTabs>
        <StatusList>
          {RSVP_STATUSES.map(r => (
            <StatusCount key={r.key} title={r.label}>
              {r.emoji} {statusLists[r.key]?.length || 0}
            </StatusCount>
          ))}
        </StatusList>
        <SectionTitle>Участники</SectionTitle>
        <Participants>
          {RSVP_STATUSES.map(r => (
            <div key={r.key} style={{marginBottom:6}}>
              <span style={{fontWeight:600,color:'#6D9773'}}>{r.label}:</span>
              {statusLists[r.key]?.length > 0 ? statusLists[r.key].map(u => (
                <Participant key={u.id}>
                  <Avatar>{u.name ? u.name[0].toUpperCase() : '?'}</Avatar>{u.name}
                </Participant>
              )) : <span style={{ color: '#bbb',marginLeft:8 }}>—</span>}
            </div>
          ))}
        </Participants>
        <SectionTitle>Комментарии</SectionTitle>
        {localRsvp === 'going' ? (
          <>
            <Comments>
              {comments && comments.length > 0 ? comments.map(c => (
                <Comment key={c.id}><b>{c.user_name || c.author}:</b> {c.text}</Comment>
              )) : <span style={{ color: '#888' }}>Пока нет комментариев</span>}
            </Comments>
            <AddComment onSubmit={e => { e.preventDefault(); onComment(comment); setComment(''); }}>
              <Input
                type="text"
                placeholder="Ваш комментарий..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                required
              />
              <SubmitBtn type="submit">Отправить</SubmitBtn>
            </AddComment>
          </>
        ) : (
          <div style={{ color: '#888', margin: '1.2rem 0', textAlign: 'center' }}>
            Комментарии доступны только участникам события
          </div>
        )}
      </Modal>
    </Overlay>
  );
};

export default EventModal; 