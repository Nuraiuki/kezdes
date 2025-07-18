// GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
  html, body {
    margin: 0;
    padding: 0;
    font-family: ${({ theme }) => theme.font.family};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.font.size};
    min-height: 100vh;
    scroll-behavior: smooth;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
  }
`;

export default GlobalStyle; 