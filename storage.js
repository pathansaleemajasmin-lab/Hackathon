const USERS_KEY = 'stride:users';
const SESSION_KEY = 'stride:session';

export function readStoredValue(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored === null ? fallback : JSON.parse(stored);
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error);
    return fallback;
  }
}

export function writeStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Unable to save ${key} to local storage.`, error);
    return false;
  }
}

export function getUsers() {
  const users = readStoredValue(USERS_KEY, []);
  return Array.isArray(users) ? users : [];
}

export function saveUsers(users) {
  return writeStoredValue(USERS_KEY, users);
}

export function getSessionEmail() {
  try {
    return window.localStorage.getItem(SESSION_KEY);
  } catch (error) {
    console.error('Unable to read the local session.', error);
    return null;
  }
}

export function saveSession(email) {
  try {
    if (email) {
      window.localStorage.setItem(SESSION_KEY, email);
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
    return true;
  } catch (error) {
    console.error('Unable to save the local session.', error);
    return false;
  }
}

export function getFitnessData(email) {
  const data = readStoredValue(`stride:data:${email}`, {});
  return {
    stepEntries: data.stepEntries && typeof data.stepEntries === 'object' ? data.stepEntries : {},
    stepGoal: Number(data.stepGoal) > 0 ? Number(data.stepGoal) : 8000,
    workoutGoalMinutes: Number(data.workoutGoalMinutes) > 0 ? Number(data.workoutGoalMinutes) : 30,
    workouts: Array.isArray(data.workouts) ? data.workouts : [],
    meals: Array.isArray(data.meals) ? data.meals : [],
    waterEntries: data.waterEntries && typeof data.waterEntries === 'object' ? data.waterEntries : {},
  };
}

export function saveFitnessData(email, data) {
  return writeStoredValue(`stride:data:${email}`, data);
}

export function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
