// HeroSection.js
import React, { useState } from 'react';
import styled from 'styled-components';
import heroImage from '../assets/hero-image.jpg';
import CreateEventModal from './CreateEventModal';

const Wrapper = styled.section`
  width: 100%;
  min-height: 60vh;
  background: linear-gradient(120deg, ${({ theme }) => theme.colors.primary}cc 60%, ${({ theme }) => theme.colors.secondary}cc 100%), url(${heroImage}) center/cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 0 32px 0;
`;
const Content = styled.div`
  color: #fff;
  text-align: center;
  max-width: 700px;
`;
const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;
const Subtitle = styled.p`
  font-size: 1.3rem;
  margin-bottom: 2rem;
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 2.5rem;
`;
const MainButton = styled.button`
  background: ${({ theme }) => theme.colors.yellow};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 700;
  font-size: 1.1rem;
  padding: 0.9rem 2.2rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
  }
`;
const Stats = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 2.5rem;
`;
const Stat = styled.div`
  text-align: center;
`;
const StatNumber = styled.div`
  font-size: 2.2rem;
  font-weight: 700;
`;
const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.85;
`;

const HeroSection = ({ onEventCreated }) => {
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <Wrapper>
      <Content>
        <Title>KEZDES — платформа для молодежных событий</Title>
        <Subtitle>Находи, создавай и посещай лучшие мероприятия своего города. Общайся, участвуй, развивайся!</Subtitle>
        <ButtonGroup>
          <MainButton onClick={() => window.scrollTo({top: document.getElementById('events').offsetTop-60, behavior: 'smooth'})}>Посмотреть события</MainButton>
          <MainButton style={{ background: '#fff', color: '#0C3B2E' }} onClick={() => setCreateOpen(true)}>Создать событие</MainButton>
        </ButtonGroup>
        <Stats>
          <Stat>
            <StatNumber>25+</StatNumber>
            <StatLabel>Событий</StatLabel>
          </Stat>
       
          <Stat>
            <StatNumber>5+</StatNumber>
            <StatLabel>Категорий</StatLabel>
          </Stat>
        </Stats>
        <CreateEventModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={onEventCreated} />
      </Content>
    </Wrapper>
  );
};

export default HeroSection; 