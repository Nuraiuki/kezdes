// Footer.js
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.footer`
  background: ${({ theme }) => theme.colors.secondary};
  color: #fff;
  padding: 2.2rem 0 1.2rem 0;
  text-align: center;
`;
const Links = styled.div`
  margin-bottom: 1rem;
  a {
    color: #fff;
    margin: 0 1.2rem;
    font-weight: 500;
    text-decoration: underline;
    opacity: 0.85;
    transition: opacity 0.18s;
    &:hover {
      opacity: 1;
    }
  }
`;
const Copyright = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const Footer = () => (
  <Wrapper>
    <Links>
      <a href="mailto:info@kezdes.ru">info@kezdes.ru</a>
      <a href="https://t.me/kezdes" target="_blank" rel="noopener noreferrer">Telegram</a>
      <a href="https://vk.com/kezdes" target="_blank" rel="noopener noreferrer">VK</a>
    </Links>
    <Copyright>
      &copy; {new Date().getFullYear()} Kezdes. Все права защищены.
    </Copyright>
  </Wrapper>
);

export default Footer; 