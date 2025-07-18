// Header.js
import React from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.png';
import { FaUserCircle } from 'react-icons/fa';
import AuthModal from './AuthModal';
import { useState } from 'react';
import ProfileModal from './ProfileModal';

const Wrapper = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  padding: 0.5rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
`;
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
`;
const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;
const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
`;
const NavLink = styled.a`
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: 500;
  font-size: 1.1rem;
  transition: color 0.18s;
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;
const UserBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const AuthButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.5rem 1.3rem;
  font-size: 1rem;
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: background 0.18s;
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

const Header = ({ user, setUser }) => {
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleAuth = (userData) => {
    setUser(userData);
    setAuthOpen(false);
  };
  const handleLogout = () => {
    setUser(null);
    setProfileOpen(false);
  };

  return (
    <Wrapper>
      <Container>
        <Logo>
          <img src={logo} alt="Kezdes" style={{ height: 36 }} />
          Kezdes
        </Logo>
        <Nav>
          <NavLink href="#events">События</NavLink>
          <NavLink href="#features">Преимущества</NavLink>
          <NavLink href="#map">Карта</NavLink>
        </Nav>
        <UserBlock>
          {user ? (
            <>
              <span style={{ color: '#0C3B2E', fontWeight: 600 }}>{user.name} ({user.personality || user.personality_type})</span>
              <AuthButton onClick={() => setProfileOpen(true)}>Профиль</AuthButton>
              <AuthButton style={{ background: '#fff', color: '#0C3B2E', border: '1.5px solid #0C3B2E' }} onClick={handleLogout}>Выйти</AuthButton>
            </>
          ) : (
            <AuthButton onClick={() => setAuthOpen(true)}>
              <FaUserCircle style={{ marginRight: 8, fontSize: 20 }} /> Войти
            </AuthButton>
          )}
        </UserBlock>
      </Container>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onAuth={handleAuth} />
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} user={user} onLogout={handleLogout} />
    </Wrapper>
  );
};

export default Header; 