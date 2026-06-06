import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';
import './index.css';

if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme');
  const shouldBeDark = savedTheme !== 'light';
  document.documentElement.classList.toggle('dark', shouldBeDark);
}

export const createRoot = ViteReactSSG({ routes });
