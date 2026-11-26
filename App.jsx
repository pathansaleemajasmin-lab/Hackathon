import { useEffect, useState } from 'react';
import AuthScreen from './components/AuthScreen.jsx';
import Layout from './components/Layout.jsx';
import {
  Dashboard,
  DietPage,
  GoalsPage,
  HealthPage,
  ProgressPage,
  StepsPage,
  WeatherPage,
  WorkoutsPage,
} from './components/Pages.jsx';
import {
  getFitnessData,
  getSessionEmail,
  getUsers,
  saveFitnessData,
  saveSession,
  saveUsers,
} from './lib/storage.js';
import './App.css';

function initialUser() {
  const email = getSessionEmail();
  return email ? getUsers().find((user) => user.email === email) || null : null;
}

export default function App() {
  const [user, setUser] = useState(initialUser);
  const [data, setData] = useState(() => {
    const current = initialUser();
    return current ? getFitnessData(current.email) : getFitnessData('guest');
  });
  const [page, setPage] = useState('dashboard');

  useEffect(() => {
    if (user && !saveFitnessData(user.email, data)) {
      console.error('Fitness changes could not be persisted in this browser.');
    }
  }, [data, user]);

  function login({ email, password }) {
    const matchingUser = getUsers().find((account) => account.email === email && account.password === password);
    if (!matchingUser) return 'We couldn’t find that account and password. Check your details or create an account.';
    setUser(matchingUser);
    setData(getFitnessData(matchingUser.email));
    setPage('dashboard');
    saveSession(matchingUser.email);
    return '';
  }

  function signup({ name, email, password }) {
    const users = getUsers();
    if (users.some((account) => account.email === email)) return 'An account with this email already exists. Sign in instead.';
    const newUser = { name, email, password };
    if (!saveUsers([...users, newUser])) return 'This browser could not save your account. Check local storage settings and try again.';
    setUser(newUser);
    setData(getFitnessData(email));
    setPage('dashboard');
    saveSession(email);
    return '';
  }

  function logout() {
    saveSession(null);
    setUser(null);
    setData(getFitnessData('guest'));
    setPage('dashboard');
  }

  useEffect(() => {
    function handleNavigate(event) {
      setPage(event.detail);
    }
    window.addEventListener('stride:navigate', handleNavigate);
    return () => window.removeEventListener('stride:navigate', handleNavigate);
  }, []);

  if (!user) return <AuthScreen onLogin={login} onSignup={signup} />;

  const pageProps = { data, setData };
  const pages = {
    dashboard: <Dashboard user={user} data={data} onNavigate={setPage} />,
    workouts: <WorkoutsPage {...pageProps} />,
    steps: <StepsPage {...pageProps} />,
    diet: <DietPage {...pageProps} />,
    goals: <GoalsPage {...pageProps} />,
    progress: <ProgressPage {...pageProps} />,
    health: <HealthPage {...pageProps} />,
    weather: <WeatherPage />,
  };

  return <Layout user={user} page={page} onNavigate={setPage} onLogout={logout}>{pages[page] || pages.dashboard}</Layout>;
}
