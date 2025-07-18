// CreateEventModal.js
import React, { useState } from 'react';
import styled from 'styled-components';
import DombraIcon from '../assets/dombra.svg';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.22);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Modal = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 2.2rem 1.5rem 1.5rem 1.5rem;
  max-width: 380px;
  width: 96vw;
  min-width: 0;
  @media (max-width: 480px) {
    padding: 1.1rem 0.5rem 0.7rem 0.5rem;
    max-width: 98vw;
  }
  position: relative;
  text-align: center;
`;
const CloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  color: #bbb;
  font-size: 1.5rem;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #0C3B2E; }
`;
const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
`;
const Input = styled.input`
  padding: 0.8rem 1rem;
  border-radius: 0.8rem;
  border: 1.5px solid #e0e0e0;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
const Textarea = styled.textarea`
  padding: 0.8rem 1rem;
  border-radius: 0.8rem;
  border: 1.5px solid #e0e0e0;
  font-size: 1rem;
  min-height: 70px;
  resize: vertical;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
const Select = styled.select`
  padding: 0.8rem 1rem;
  border-radius: 0.8rem;
  border: 1.5px solid #e0e0e0;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
const SubmitBtn = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 0.8rem;
  padding: 0.95rem 0;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;
  width: 100%;
  box-shadow: ${({ theme }) => theme.boxShadow};
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;
const ErrorMsg = styled.div`
  color: #d32f2f;
  font-size: 0.98rem;
  margin-top: -0.7rem;
`;
const categories = [
  'Музыка', 'Образование', 'Спорт', 'Волонтёрство', 'Тусовка', 'Мастер-класс', 'Кино', 'Театр', 'Национальные', 'Другое'
];
export default function CreateEventModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  if (!open) return null;
  const handleSubmit = async e => {
    e.preventDefault();
    if (!title || !desc || !date || !location || !category) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    setError('');
    const newEvent = {
      title,
      description: desc,
      date,
      location,
      category,
      image_url: image,
      lat: '51.09', // можно добавить выбор на карте позже
      lng: '71.41',
    };
    // Отправка на backend
    const res = await fetch('/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    });
    if (res.ok) {
      const created = await res.json();
      onCreate && onCreate(created);
      onClose();
    } else {
      setError('Ошибка при создании события');
    }
  };
  return (
    <Overlay>
      <Modal>
        <CloseBtn onClick={onClose} title="Закрыть">×</CloseBtn>
        <Title>Создать событие</Title>
        <Form onSubmit={handleSubmit}>
          <Input placeholder="Название" value={title} onChange={e => setTitle(e.target.value)} required />
          <Textarea placeholder="Описание" value={desc} onChange={e => setDesc(e.target.value)} required />
          <Input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
          <Input placeholder="Место" value={location} onChange={e => setLocation(e.target.value)} required />
          <Select value={category} onChange={e => setCategory(e.target.value)} required>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'Национальные' ? '🎶 ' : ''}{cat}
              </option>
            ))}
          </Select>
          <Input placeholder="Ссылка на изображение (необязательно)" value={image} onChange={e => setImage(e.target.value)} />
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <SubmitBtn type="submit">Создать</SubmitBtn>
        </Form>
      </Modal>
    </Overlay>
  );
} 