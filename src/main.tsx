import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import './index.css';

const savedTheme = localStorage.getItem('theme');
const shouldBeDark = savedTheme !== 'light';
document.documentElement.classList.toggle('dark', shouldBeDark);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
);
