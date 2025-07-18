import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(12, 59, 46, 0.18);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Modal = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 400px;
  width: 100%;
  position: relative;
  text-align: center;
`;
const CloseBtn = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #bbb;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #0C3B2E; }
`;
const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
`;
const Info = styled.div`
  text-align: left;
  margin: 0 auto 1.2rem auto;
  max-width: 320px;
`;
const Label = styled.div`
  font-size: 0.98rem;
  color: #888;
  margin-bottom: 0.1rem;
`;
const Value = styled.div`
  font-size: 1.13rem;
  font-weight: 500;
  margin-bottom: 0.7rem;
`;
const Personality = styled.div`
  display: inline-block;
  background: ${({ theme }) => theme.green || '#E6F4EA'};
  color: #0C3B2E;
  border-radius: 1rem;
  padding: 0.3rem 1.1rem;
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1.1rem;
`;
const AnswersBlock = styled.div`
  background: #f9faf9;
  border-radius: 1rem;
  padding: 1rem 1rem 0.7rem 1rem;
  margin-bottom: 1.2rem;
`;
const LogoutBtn = styled.button`
  background: #eee;
  color: #0C3B2E;
  border: none;
  border-radius: 0.8rem;
  padding: 0.95rem 0;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background: ${({ theme }) => theme.brown};
    color: #fff;
  }
`;

const questions = [
  "Вам больше нравятся проводить время в больших компаниях или в узком кругу друзей?",
  "Оказавшись на новом мероприятии, что делаете в первые 10 минут?",
  "Три часа активного общения позади. Ваше состояние?"
];

export default function ProfileModal({ open, onClose, user, onLogout }) {
  if (!open || !user) return null;
  return (
    <Overlay>
      <Modal>
        <CloseBtn onClick={onClose} title="Закрыть">×</CloseBtn>
        <Title>Профиль</Title>
        <Info>
          <Label>Имя</Label>
          <Value>{user.name}</Value>
          <Label>Email</Label>
          <Value>{user.email}</Value>
          <Label>Тип личности</Label>
          <Personality>{user.personality || "-"}</Personality>
        </Info>
        {user.answers && (
          <AnswersBlock>
            <div style={{fontWeight:600,marginBottom:8}}>Ответы на тест:</div>
            {user.answers.map((a, i) => (
              <div key={i} style={{marginBottom:4}}>
                <span style={{color:'#6D9773'}}>{questions[i]}</span><br/>
                <span style={{fontWeight:500}}>{a === "A" ? "A" : "Б"}</span>
              </div>
            ))}
          </AnswersBlock>
        )}
        <LogoutBtn onClick={onLogout}>Выйти</LogoutBtn>
      </Modal>
    </Overlay>
  );
} 