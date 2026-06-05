import LandingPage from './pages/LandingPage';
import CliLandingPage from './pages/CliLandingPage';

function isCliRoute() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return path === '/cli';
}

export default function App() {
  return isCliRoute() ? <CliLandingPage /> : <LandingPage />;
}
