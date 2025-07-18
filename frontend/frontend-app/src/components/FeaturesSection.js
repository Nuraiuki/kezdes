// FeaturesSection.js
import React from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaUsers, FaComments, FaMapMarkedAlt, FaSearch, FaPlusCircle } from 'react-icons/fa';

const Wrapper = styled.section`
  background: ${({ theme }) => theme.colors.muted};
  padding: 64px 0 48px 0;
`;
const Title = styled.h2`
  text-align: center;
  font-size: 2.3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 2.5rem;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
`;
const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  padding: 2.2rem 1.5rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const IconWrap = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.2rem;
`;
const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.7rem;
  color: ${({ theme }) => theme.colors.secondary};
`;
const CardDesc = styled.p`
  font-size: 1rem;
  color: #444;
`;

const features = [
  {
    icon: <FaCalendarAlt />,
    title: 'Лента событий',
    desc: 'Следи за актуальными мероприятиями и не пропусти ничего интересного.'
  },
  {
    icon: <FaPlusCircle />,
    title: 'Создание событий',
    desc: 'Организуй собственные встречи и собирай единомышленников.'
  },
  {
    icon: <FaUsers />,
    title: 'Участники',
    desc: 'Записывайся на события, смотри кто еще идет и общайся с участниками.'
  },
  {
    icon: <FaComments />,
    title: 'Чат и комментарии',
    desc: 'Обсуждай детали, делись впечатлениями и заводи новые знакомства.'
  },
  {
    icon: <FaMapMarkedAlt />,
    title: 'Карта событий',
    desc: 'Находи мероприятия рядом с собой и открывай новые места.'
  },
  {
    icon: <FaSearch />,
    title: 'Умный поиск',
    desc: 'Фильтруй события по интересам, дате и другим параметрам.'
  },
];

const FeaturesSection = () => (
  <Wrapper id="features">
    <Title>Возможности Kezdes</Title>
    <Grid>
      {features.map((f, i) => (
        <Card key={i}>
          <IconWrap>{f.icon}</IconWrap>
          <CardTitle>{f.title}</CardTitle>
          <CardDesc>{f.desc}</CardDesc>
        </Card>
      ))}
    </Grid>
  </Wrapper>
);

export default FeaturesSection; 