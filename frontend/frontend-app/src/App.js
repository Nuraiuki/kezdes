import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import EventsPreview from './components/EventsPreview';
import MapSection from './components/MapSection';
import Footer from './components/Footer';
import assistImg from './assets/assist.webp';

function App() {
  const [newEvent, setNewEvent] = useState(null);
  const [user, setUser] = useState(null);
  const userId = user?.id || null;
  const [showAssistantBubble, setShowAssistantBubble] = useState(false);
  const [assistantChat, setAssistantChat] = useState([
    { from: 'assistant', text: 'Привет! Я ассистент Kezdes 👋\nЗадайте вопрос о платформе или событиях.' }
  ]);
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantLoading, setAssistantLoading] = useState(false);

  const assistantAnswers = [
    {
      q: /создать.*событие|как.*добавить.*событие/i,
      a: 'Чтобы создать событие, нажмите кнопку "Создать событие" вверху или на главной странице. Заполните форму и подтвердите.'
    },
    {
      q: /как.*работает.*rsvp|что.*такое.*rsvp/i,
      a: 'RSVP — это ваш ответ на приглашение. Выберите "Иду", "Может быть" или "Не могу" на карточке события или в подробностях.'
    },
    {
      q: /комментар|чат|написать.*сообщение/i,
      a: 'Комментировать могут только те, кто выбрал статус "Иду". После этого появится чат на карточке и в подробностях события.'
    },
    {
      q: /привет|здравствуй|hello|hi/i,
      a: 'Привет! Я ассистент Kezdes. Готов помочь по любым вопросам о платформе.'
    },
    {
      q: /событи|мероприят|ивент|event/i,
      a: 'На платформе Kezdes вы найдёте множество событий по интересам. Используйте фильтры и карту для поиска.'
    },
  ];
  const handleEventCreated = (event) => {
    setNewEvent(event);
  };
  const handleAssistantSend = async () => {
    if (!assistantInput.trim() || assistantLoading) return;
    const userMsg = { from: 'user', text: assistantInput };
    setAssistantChat(prev => [...prev, userMsg]);
    setAssistantLoading(true);
    setAssistantInput('');
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      });
      if (!res.ok) {
        throw new Error('Ошибка сервера');
      }
      const data = await res.json();
      setAssistantChat(prev => [...prev, { from: 'assistant', text: data.answer }]);
    } catch (e) {
      setAssistantChat(prev => [...prev, { from: 'assistant', text: 'Извините, не удалось получить ответ. Попробуйте позже.' }]);
    } finally {
      setAssistantLoading(false);
    }
  };
  const handleAssistantInputKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAssistantSend();
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Header user={user} setUser={setUser} />
      <HeroSection onEventCreated={handleEventCreated} />
      <FeaturesSection />
      <EventsPreview newEvent={newEvent} userId={userId} user={user} />
      <MapSection />
      <Footer />
      {/* Интерактивный ассистент */}
      <div style={{ position: 'fixed', right: 32, bottom: 32, zIndex: 4000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        {showAssistantBubble && (
          <div style={{
            marginBottom: 12,
            background: '#fff',
            color: '#0C3B2E',
            borderRadius: 18,
            boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
            padding: '1.1em 1.5em 1.1em 1.3em',
            fontSize: 17,
            maxWidth: 420,
            minWidth: 260,
            minHeight: '320px',
            maxHeight: '70vh',
            position: 'relative',
            animation: 'fadeInChat 0.5s cubic-bezier(.4,1.6,.6,1)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 0.2s',
          }}>
            <div id="assistant-chat-scroll" style={{
              maxHeight: '48vh',
              minHeight: '120px',
              overflowY: 'auto',
              marginBottom: 10,
              paddingRight: 2,
              scrollBehavior: 'smooth',
              transition: 'max-height 0.3s',
            }}>
              {assistantChat.map((msg, i) => (
                <div key={i} style={{
                  background: msg.from === 'assistant' ? 'linear-gradient(90deg, #f5f7f6 60%, #e8f5e9 100%)' : 'linear-gradient(90deg, #e0f7e9 60%, #f5f7f6 100%)',
                  color: '#222',
                  borderRadius: msg.from === 'assistant' ? '12px 12px 12px 4px' : '12px 12px 4px 12px',
                  padding: '0.7em 1.1em',
                  marginBottom: 8,
                  alignSelf: msg.from === 'assistant' ? 'flex-start' : 'flex-end',
                  fontWeight: msg.from === 'assistant' ? 500 : 600,
                  fontSize: 16,
                  maxWidth: 320,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  opacity: 0,
                  animation: 'fadeInMsg 0.5s forwards',
                  animationDelay: `${i * 0.04}s`,
                  transition: 'background 0.2s',
                }}>{msg.text}</div>
              ))}
              {assistantLoading && (
                <div style={{
                  background: 'linear-gradient(90deg, #f5f7f6 60%, #e8f5e9 100%)',
                  color: '#888',
                  borderRadius: '12px 12px 12px 4px',
                  padding: '0.7em 1.1em',
                  marginBottom: 8,
                  alignSelf: 'flex-start',
                  fontWeight: 500,
                  fontSize: 16,
                  maxWidth: 320,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  opacity: 0,
                  animation: 'fadeInMsg 0.5s forwards',
                  animationDelay: `${assistantChat.length * 0.04}s`,
                }}>
                  <span className="loader" style={{ width: 16, height: 16, border: '2.5px solid #6D9773', borderTop: '2.5px solid #fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span>
                  Печатает...
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <input
                type="text"
                placeholder="Ваш вопрос..."
                value={assistantInput}
                onChange={e => setAssistantInput(e.target.value)}
                onKeyDown={handleAssistantInputKey}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  border: '1.5px solid #e0e0e0',
                  padding: '0.7em 1.1em',
                  fontSize: 16,
                  outline: 'none',
                  background: '#f8faf9',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                  transition: 'box-shadow 0.2s',
                }}
                disabled={assistantLoading}
              />
              <button
                style={{
                  background: 'linear-gradient(90deg, #6D9773 60%, #8dc6a5 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '0.7em 1.5em',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: assistantLoading ? 'not-allowed' : 'pointer',
                  opacity: assistantLoading ? 0.7 : 1,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'background 0.2s',
                }}
                onClick={handleAssistantSend}
                disabled={assistantLoading}
              >Отправить</button>
              <button
                style={{
                  background: 'none',
                  color: '#bbb',
                  border: 'none',
                  borderRadius: 10,
                  padding: '0.7em 0.9em',
                  fontWeight: 600,
                  fontSize: 22,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                }}
                title="Свернуть"
                onClick={() => setShowAssistantBubble(false)}
              >×</button>
            </div>
            {/* Анимации и стили для скроллбара */}
            <style>{`
              @keyframes fadeInChat {
                from { opacity: 0; transform: translateY(40px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              @keyframes fadeInMsg {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              #assistant-chat-scroll::-webkit-scrollbar {
                width: 7px;
                background: #f5f7f6;
                border-radius: 8px;
              }
              #assistant-chat-scroll::-webkit-scrollbar-thumb {
                background: #e0f7e9;
                border-radius: 8px;
              }
            `}</style>
          </div>
        )}
        <img
          src={assistImg}
          alt="Ассистент Kezdes"
          style={{
            width: 200,
            height: 'auto',
            borderRadius: 32,
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            background: '#fff',
            padding: 6,
            cursor: 'pointer',
            transition: 'transform 0.18s',
            transform: showAssistantBubble ? 'scale(1.07)' : 'scale(1)',
          }}
          onClick={() => setShowAssistantBubble(v => !v)}
        />
    </div>
    </ThemeProvider>
  );
}

export default App;
