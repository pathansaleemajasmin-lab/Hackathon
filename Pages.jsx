import { useEffect, useState } from 'react';
import { formatDate, getTodayKey } from '../lib/storage.js';

const today = getTodayKey();
const todaySteps = (data) => Number(data.stepEntries[today]) || 0;
const todayWorkouts = (data) => data.workouts.filter((item) => item.date === today);
const todayMeals = (data) => data.meals.filter((item) => item.date === today);
const todayWorkoutMinutes = (data) => todayWorkouts(data).reduce((sum, item) => sum + Number(item.duration), 0);
const todayBurned = (data) => todayWorkouts(data).reduce((sum, item) => sum + Number(item.calories), 0);
const todayIntake = (data) => todayMeals(data).reduce((sum, item) => sum + Number(item.calories), 0);
const percent = (value, goal) => goal > 0 ? Math.min(100, Math.round((value / goal) * 100)) : 0;

function PageHeading({ kicker, title, description, action }) {
  return <div className="page-heading"><div><span className="eyebrow">{kicker}</span><h1>{title}</h1><p className="muted">{description}</p></div>{action}</div>;
}

function ProgressBar({ value, goal, color = 'green' }) {
  return <div className={`progress-track ${color}`} role="progressbar" aria-valuenow={percent(value, goal)} aria-valuemin="0" aria-valuemax="100" aria-label={`${percent(value, goal)}% complete`}><span style={{ width: `${percent(value, goal)}%` }} /></div>;
}

function MetricCard({ label, value, unit, symbol, tone = 'mint', footnote }) {
  return <article className={`metric-card ${tone}`}><div className="metric-top"><span className="metric-label">{label}</span><span className="metric-symbol" aria-hidden="true">{symbol}</span></div><div className="metric-value">{value}<span>{unit}</span></div>{footnote && <div className="metric-footnote">{footnote}</div>}</article>;
}

function EmptyState({ children }) {
  return <div className="empty-state"><span className="empty-icon">✳</span><p>{children}</p></div>;
}

export function Dashboard({ user, data, onNavigate }) {
  const workouts = todayWorkouts(data);
  const meals = todayMeals(data);
  const stepCount = todaySteps(data);
  const stepsPercent = percent(stepCount, data.stepGoal);
  const firstName = user.name.split(' ')[0];

  return (
    <>
      <PageHeading kicker={new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} title={`Good to see you, ${firstName}.`} description="A fresh day to move, refuel, and feel good." />
      <section className="welcome-banner">
        <div className="welcome-copy"><span className="banner-kicker">TODAY IS YOURS</span><h2>Every little bit<br />of movement counts.</h2><p>Keep your own pace. You’re building something good.</p><button className="button button-light" onClick={() => onNavigate('workouts')}>Log a workout <span aria-hidden="true">→</span></button></div>
        <div className="banner-art" aria-hidden="true"><div className="art-sun" /><div className="art-hill art-hill-back" /><div className="art-hill art-hill-front" /><div className="art-path" /><span className="art-spark art-spark-one">✳</span><span className="art-spark art-spark-two">✦</span></div>
        <div className="banner-date"><span>YOUR DAILY CHECK-IN</span><strong>{new Date().toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}</strong></div>
      </section>

      <div className="section-title-row"><div><span className="eyebrow">YOUR DAY, AT A GLANCE</span><h2>Today’s snapshot</h2></div><button className="text-button" onClick={() => onNavigate('progress')}>View progress <span aria-hidden="true">↗</span></button></div>
      <div className="metric-grid">
        <MetricCard label="Steps logged" value={stepCount.toLocaleString()} unit="steps" symbol="⌁" tone="mint" footnote={`${stepsPercent}% of ${data.stepGoal.toLocaleString()} goal`} />
        <MetricCard label="Calories burned" value={todayBurned(data).toLocaleString()} unit="kcal" symbol="↗" tone="peach" footnote="Estimated from logged workouts" />
        <MetricCard label="Workouts" value={workouts.length} unit={workouts.length === 1 ? 'session' : 'sessions'} symbol="✳" tone="lavender" footnote={`${todayWorkoutMinutes(data)} min of movement`} />
        <MetricCard label="Food logged" value={meals.length} unit={meals.length === 1 ? 'meal' : 'meals'} symbol="◉" tone="butter" footnote={`${todayIntake(data).toLocaleString()} kcal recorded`} />
      </div>

      <div className="dashboard-lower">
        <section className="panel goal-panel"><div className="panel-heading"><div><span className="eyebrow">DAILY MOVEMENT</span><h3>Your step goal</h3></div><span className="goal-emoji">✺</span></div><div className="step-count-row"><strong>{stepCount.toLocaleString()}</strong><span> / {data.stepGoal.toLocaleString()} steps</span></div><ProgressBar value={stepCount} goal={data.stepGoal} /><div className="goal-progress-copy"><span>{stepsPercent}% completed</span><span>{Math.max(data.stepGoal - stepCount, 0).toLocaleString()} to go</span></div><button className="button button-outline" onClick={() => onNavigate('steps')}>Update steps <span aria-hidden="true">→</span></button></section>
        <section className="panel quick-panel"><div className="panel-heading"><div><span className="eyebrow">MAKE IT COUNT</span><h3>Quick actions</h3></div></div><div className="quick-action-list"><button onClick={() => onNavigate('workouts')}><span className="quick-icon quick-green">↗</span><span><strong>Add a workout</strong><small>Log movement from today</small></span><span className="quick-arrow">→</span></button><button onClick={() => onNavigate('diet')}><span className="quick-icon quick-peach">◉</span><span><strong>Log a meal</strong><small>Keep track of what you eat</small></span><span className="quick-arrow">→</span></button><button onClick={() => onNavigate('goals')}><span className="quick-icon quick-purple">◎</span><span><strong>Check your goals</strong><small>Small wins add up</small></span><span className="quick-arrow">→</span></button></div></section>
      </div>
      <p className="data-disclaimer"><span aria-hidden="true">ⓘ</span> Your steps are manually entered. Workout calories are illustrative estimates, not sensor measurements.</p>
    </>
  );
}

export function StepsPage({ data, setData }) {
  const [steps, setSteps] = useState(String(todaySteps(data)));
  const [message, setMessage] = useState('');
  function submit(event) {
    event.preventDefault();
    const value = Number(steps);
    if (!Number.isInteger(value) || value < 0 || value > 200000) {
      setMessage('Enter a whole number between 0 and 200,000 steps.');
      return;
    }
    setData((current) => ({ ...current, stepEntries: { ...current.stepEntries, [today]: value } }));
    setMessage('Your step count has been updated.');
  }
  const count = todaySteps(data);
  const progress = percent(count, data.stepGoal);
  return <>
    <PageHeading kicker="MOVE AT YOUR OWN PACE" title="Steps & calories" description="Keep an eye on your movement. Steps here are manually entered, not measured by a sensor." />
    <section className="steps-hero panel"><div className="steps-hero-copy"><span className="eyebrow">TODAY’S STEPS</span><div className="large-step-count">{count.toLocaleString()}<span>steps</span></div><p>You’ve completed <strong>{progress}%</strong> of your daily target.</p><ProgressBar value={count} goal={data.stepGoal} /></div><div className="step-illustration" aria-hidden="true"><span className="step-sun">☼</span><span className="step-shoe">◒</span><span className="step-dot dot-one" /><span className="step-dot dot-two" /><span className="step-dot dot-three" /></div></section>
    <div className="two-column-grid">
      <section className="panel"><div className="panel-heading"><div><span className="eyebrow">MANUAL ENTRY</span><h3>Update today’s steps</h3></div></div><form className="form-stack" onSubmit={submit}><label className="field-label">Step count<input type="number" min="0" max="200000" step="1" value={steps} onChange={(event) => setSteps(event.target.value)} required /></label><button className="button button-primary">Save step count <span aria-hidden="true">→</span></button>{message && <p className={message.startsWith('Enter') ? 'form-error' : 'form-success'} role="status">{message}</p>}</form></section>
      <section className="panel"><div className="panel-heading"><div><span className="eyebrow">ESTIMATED ENERGY</span><h3>Calories burned</h3></div><span className="metric-symbol peach-symbol">↗</span></div><div className="calorie-highlight">{todayBurned(data).toLocaleString()} <span>kcal</span></div><p className="muted">Illustrative estimate based on your logged workouts. It is not a measurement from a wearable device.</p><button className="button button-outline" onClick={() => window.dispatchEvent(new CustomEvent('stride:navigate', { detail: 'workouts' }))}>View workouts <span aria-hidden="true">→</span></button></section>
    </div>
  </>;
}

export function WorkoutsPage({ data, setData }) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');
  function addWorkout(event) {
    event.preventDefault();
    const minutes = Number(duration);
    if (!name.trim() || !Number.isInteger(minutes) || minutes < 1 || minutes > 1440) {
      setMessage('Add a workout name and a duration between 1 and 1,440 minutes.');
      return;
    }
    const workout = { id: crypto.randomUUID(), name: name.trim(), duration: minutes, calories: Math.round(minutes * 5.2), date: getTodayKey() };
    setData((current) => ({ ...current, workouts: [workout, ...current.workouts] }));
    setName('');
    setDuration('');
    setMessage('Workout added to your history.');
  }
  function removeWorkout(id) {
    setData((current) => ({ ...current, workouts: current.workouts.filter((item) => item.id !== id) }));
  }
  return <>
    <PageHeading kicker="SHOW UP, FEEL GOOD" title="Your workouts" description="Log a session, celebrate the effort, and build a history you can look back on." />
    <section className="panel form-panel"><div className="panel-heading"><div><span className="eyebrow">ADD TO YOUR DAY</span><h3>Log a workout</h3></div><span className="metric-symbol mint-symbol">✳</span></div><form className="workout-form" onSubmit={addWorkout}><label className="field-label">Workout name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Evening walk, yoga" maxLength="60" required /></label><label className="field-label">Duration (minutes)<input type="number" value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="30" min="1" max="1440" step="1" required /></label><button className="button button-primary">Add workout <span aria-hidden="true">→</span></button></form>{message && <p className={message.startsWith('Add') ? 'form-error' : 'form-success'} role="status">{message}</p>}<p className="form-hint">Calories are illustrative estimates (duration × 5.2 kcal/min), not measured values.</p></section>
    <section className="panel history-panel"><div className="panel-heading"><div><span className="eyebrow">YOUR MOVEMENT</span><h3>Workout history <span className="count-pill">{data.workouts.length}</span></h3></div></div>{data.workouts.length === 0 ? <EmptyState>Your first workout is waiting to be logged. Start with any movement that feels good.</EmptyState> : <div className="record-list">{data.workouts.map((item) => <article className="record-item" key={item.id}><span className="record-icon">↗</span><div className="record-main"><strong>{item.name}</strong><small>{formatDate(item.date)} · {item.duration} min</small></div><span className="record-calories">~{item.calories} <small>kcal</small></span><button className="icon-button delete-button" onClick={() => removeWorkout(item.id)} aria-label={`Delete ${item.name}`}>×</button></article>)}</div>}</section>
  </>;
}

export function DietPage({ data, setData }) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [category, setCategory] = useState('Breakfast');
  const [message, setMessage] = useState('');
  function addMeal(event) {
    event.preventDefault();
    const value = Number(calories);
    if (!name.trim() || !Number.isInteger(value) || value < 1 || value > 10000) {
      setMessage('Add a food name and a calorie value between 1 and 10,000.');
      return;
    }
    const meal = { id: crypto.randomUUID(), name: name.trim(), calories: value, category, date: getTodayKey() };
    setData((current) => ({ ...current, meals: [meal, ...current.meals] }));
    setName('');
    setCalories('');
    setMessage('Meal added to today’s food log.');
  }
  function removeMeal(id) {
    setData((current) => ({ ...current, meals: current.meals.filter((item) => item.id !== id) }));
  }
  const meals = todayMeals(data);
  return <>
    <PageHeading kicker="EAT WELL, FEEL WELL" title="Food & nutrition" description="A simple record of what you’ve eaten today. Nutrition is personal—use this as a guide, not a prescription." />
    <section className="nutrition-summary"><div><span className="eyebrow">TODAY’S RECORDED INTAKE</span><div className="calorie-highlight">{todayIntake(data).toLocaleString()} <span>kcal</span></div><p>Calories from foods you manually entered.</p></div><span className="nutrition-art" aria-hidden="true">◉</span></section>
    <section className="panel form-panel"><div className="panel-heading"><div><span className="eyebrow">KEEP A GENTLE RECORD</span><h3>Add food or a meal</h3></div></div><form className="meal-form" onSubmit={addMeal}><label className="field-label">Food name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Oatmeal with berries" maxLength="80" required /></label><label className="field-label">Meal type<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select></label><label className="field-label">Calories (kcal)<input type="number" value={calories} onChange={(event) => setCalories(event.target.value)} placeholder="320" min="1" max="10000" step="1" required /></label><button className="button button-primary">Add food <span aria-hidden="true">→</span></button></form>{message && <p className={message.startsWith('Add') ? 'form-error' : 'form-success'} role="status">{message}</p>}</section>
    <section className="panel history-panel"><div className="panel-heading"><div><span className="eyebrow">TODAY’S RECORD</span><h3>Meals & snacks <span className="count-pill">{meals.length}</span></h3></div></div>{meals.length === 0 ? <EmptyState>Nothing logged yet. Add your first meal or snack whenever you’re ready.</EmptyState> : <div className="record-list">{meals.map((item) => <article className="record-item" key={item.id}><span className="record-icon meal-record-icon">◉</span><div className="record-main"><strong>{item.name}</strong><small>{item.category} · {formatDate(item.date)}</small></div><span className="record-calories">{item.calories} <small>kcal</small></span><button className="icon-button delete-button" onClick={() => removeMeal(item.id)} aria-label={`Delete ${item.name}`}>×</button></article>)}</div>}</section>
  </>;
}

export function GoalsPage({ data, setData }) {
  const [stepGoal, setStepGoal] = useState(String(data.stepGoal));
  const [workoutGoal, setWorkoutGoal] = useState(String(data.workoutGoalMinutes));
  const [message, setMessage] = useState('');
  function saveGoals(event) {
    event.preventDefault();
    const steps = Number(stepGoal);
    const minutes = Number(workoutGoal);
    if (!Number.isInteger(steps) || steps < 100 || steps > 100000 || !Number.isInteger(minutes) || minutes < 1 || minutes > 1440) {
      setMessage('Set steps between 100 and 100,000, and workout minutes between 1 and 1,440.');
      return;
    }
    setData((current) => ({ ...current, stepGoal: steps, workoutGoalMinutes: minutes }));
    setMessage('Your daily goals are saved.');
  }
  const stepValue = todaySteps(data);
  const minuteValue = todayWorkoutMinutes(data);
  const complete = percent(stepValue, data.stepGoal) >= 100 && percent(minuteValue, data.workoutGoalMinutes) >= 100;
  return <>
    <PageHeading kicker="AIM FOR WHAT FEELS RIGHT" title="Goals that fit you" description="Choose achievable daily targets, then let small, consistent steps do their thing." />
    <div className="goal-cards">
      <article className="panel personal-goal"><div className="goal-icon large-goal-icon">⌁</div><span className="eyebrow">DAILY STEP GOAL</span><h3>{stepValue.toLocaleString()} <small>/ {data.stepGoal.toLocaleString()}</small></h3><ProgressBar value={stepValue} goal={data.stepGoal} /><div className="goal-progress-copy"><span>{percent(stepValue, data.stepGoal)}% complete</span><span>{Math.max(data.stepGoal - stepValue, 0).toLocaleString()} steps left</span></div></article>
      <article className="panel personal-goal"><div className="goal-icon large-goal-icon purple-goal-icon">↗</div><span className="eyebrow">DAILY MOVEMENT GOAL</span><h3>{minuteValue} <small>/ {data.workoutGoalMinutes} min</small></h3><ProgressBar value={minuteValue} goal={data.workoutGoalMinutes} color="purple" /><div className="goal-progress-copy"><span>{percent(minuteValue, data.workoutGoalMinutes)}% complete</span><span>{Math.max(data.workoutGoalMinutes - minuteValue, 0)} min left</span></div></article>
    </div>
    <section className="goal-message"><span className="goal-message-icon">{complete ? '✦' : '✳'}</span><div><strong>{complete ? 'You showed up for yourself today.' : stepValue + minuteValue > 0 ? 'You’re already making progress.' : 'Your goals are a starting point, not a finish line.'}</strong><p>{complete ? 'Both daily targets are complete. Take a moment to enjoy that win.' : 'Even one small action can move you closer. Adjust these targets whenever life changes.'}</p></div></section>
    <section className="panel form-panel"><div className="panel-heading"><div><span className="eyebrow">MAKE THEM YOURS</span><h3>Adjust daily goals</h3></div></div><form className="workout-form" onSubmit={saveGoals}><label className="field-label">Step target<input type="number" value={stepGoal} onChange={(event) => setStepGoal(event.target.value)} min="100" max="100000" step="100" required /></label><label className="field-label">Workout minutes target<input type="number" value={workoutGoal} onChange={(event) => setWorkoutGoal(event.target.value)} min="1" max="1440" step="5" required /></label><button className="button button-primary">Save my goals <span aria-hidden="true">→</span></button></form>{message && <p className={message.startsWith('Set') ? 'form-error' : 'form-success'} role="status">{message}</p>}</section>
  </>;
}

const wellnessTips = [
  { icon: '◌', title: 'Sip a little more', text: 'Keep water nearby and drink regularly. Your needs vary with activity, climate, and health.' },
  { icon: '☾', title: 'Give rest its place', text: 'A consistent sleep routine can support recovery, energy, and overall wellbeing.' },
  { icon: '↗', title: 'Find movement you enjoy', text: 'Walking, stretching, dancing, and everyday activity all count. Start at a comfortable pace.' },
  { icon: '◉', title: 'Aim for a varied plate', text: 'A mix of foods can help provide a range of nutrients. There’s no single perfect meal.' },
];

export function HealthPage({ data, setData }) {
  const count = Number(data.waterEntries[today]) || 0;
  function updateWater(value) {
    setData((current) => ({ ...current, waterEntries: { ...current.waterEntries, [today]: Math.max(0, Math.min(20, value)) } }));
  }
  return <>
    <PageHeading kicker="CARE IS A DAILY PRACTICE" title="A little more wellbeing" description="Gentle reminders for the basics. These general tips are not medical advice." />
    <section className="water-panel"><div><span className="eyebrow">HYDRATION CHECK-IN</span><h2>Have you had some water?</h2><p>Keep a simple count of glasses today. This is a personal reminder, not a prescribed target.</p><div className="water-counter"><button type="button" className="button button-water" onClick={() => updateWater(count - 1)} disabled={count === 0} aria-label="Remove one glass">−</button><strong>{count}</strong><span>{count === 1 ? 'glass logged' : 'glasses logged'}</span><button type="button" className="button button-water" onClick={() => updateWater(count + 1)} disabled={count >= 20} aria-label="Add one glass">+</button></div></div><div className="water-art" aria-hidden="true"><span>◡</span></div></section>
    <div className="section-title-row wellness-title"><div><span className="eyebrow">SMALL, STEADY HABITS</span><h2>Everyday wellness</h2></div></div>
    <div className="wellness-grid">{wellnessTips.map((tip, index) => <article className={`panel wellness-card wellness-${index}`} key={tip.title}><span className="wellness-icon">{tip.icon}</span><h3>{tip.title}</h3><p>{tip.text}</p></article>)}</div>
    <p className="data-disclaimer"><span aria-hidden="true">ⓘ</span> If you have health concerns or need personalized advice, speak with a qualified healthcare professional.</p>
  </>;
}

export function ProgressPage({ data }) {
  const stepTotal = Object.values(data.stepEntries).reduce((sum, value) => sum + (Number(value) || 0), 0);
  const workoutTotal = data.workouts.length;
  const burnedTotal = data.workouts.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
  const intakeToday = todayIntake(data);
  const recentDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = getTodayKey(date);
    return { key, label: date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2), value: Number(data.stepEntries[key]) || 0 };
  });
  const peak = Math.max(data.stepGoal, ...recentDays.map((day) => day.value), 1);
  return <>
    <PageHeading kicker="NOTICE HOW FAR YOU’VE COME" title="Your progress" description="A clear look at the activity and meals you’ve recorded in Stride." />
    <div className="metric-grid progress-metrics"><MetricCard label="Workouts logged" value={workoutTotal} unit="sessions" symbol="✳" tone="mint" footnote="Across your saved history" /><MetricCard label="Steps recorded" value={stepTotal.toLocaleString()} unit="steps" symbol="⌁" tone="lavender" footnote="Sum of manually entered days" /><MetricCard label="Calories burned" value={burnedTotal.toLocaleString()} unit="kcal" symbol="↗" tone="peach" footnote="Illustrative workout estimates" /><MetricCard label="Today’s food log" value={intakeToday.toLocaleString()} unit="kcal" symbol="◉" tone="butter" footnote="Calories entered for today" /></div>
    <section className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">LAST SEVEN DAYS</span><h3>Your step rhythm</h3></div><span className="chart-legend"><i /> Steps logged</span></div><div className="bar-chart" role="img" aria-label="Bar chart showing manually entered steps over the last seven days">{recentDays.map((day) => <div className="chart-column" key={day.key} title={`${day.key}: ${day.value.toLocaleString()} steps`}><span className="bar-value">{day.value ? (day.value >= 1000 ? `${(day.value / 1000).toFixed(1)}k` : day.value) : ''}</span><div className="bar-track"><span className={day.key === today ? 'bar-fill current-bar' : 'bar-fill'} style={{ height: `${day.value ? Math.max(7, (day.value / peak) * 100) : 0}%` }} /></div><small>{day.label}</small></div>)}</div><p className="chart-note">Step entries are manual. An empty bar means no step count has been logged for that day.</p></section>
    <div className="two-column-grid"><section className="panel progress-detail"><span className="eyebrow">MOVEMENT HISTORY</span><h3>Workout minutes by day</h3>{data.workouts.length === 0 ? <EmptyState>Log workouts to start building your history.</EmptyState> : <div className="mini-record-list">{data.workouts.slice(0, 5).map((item) => <div className="mini-record" key={item.id}><span className="mini-record-dot" /><span><strong>{item.name}</strong><small>{formatDate(item.date)}</small></span><b>{item.duration} min</b></div>)}</div>}</section><section className="panel progress-detail"><span className="eyebrow">A QUICK REMINDER</span><h3>Estimates, not measurements</h3><p className="muted">Calories burned are estimated from the duration of workouts you log. Food calories reflect your own entries. Neither value is a medical measurement or a complete picture of your health.</p></section></div>
  </>;
}

const weatherDescription = (code) => {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return code === 1 ? 'Mainly clear' : code === 2 ? 'Partly cloudy' : 'Overcast';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'Rain showers';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'Snowfall';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';
  return 'Mixed conditions';
};
const weatherSymbol = (code) => code === 0 ? '☀' : code <= 2 ? '⛅' : code <= 3 ? '☁' : [45, 48].includes(code) ? '〰' : [71, 73, 75, 77, 85, 86].includes(code) ? '❄' : [95, 96, 99].includes(code) ? 'ϟ' : '☂';

export function WeatherPage() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadWeather(city) {
    const trimmed = city.trim();
    if (!trimmed) {
      setError('Enter a city name to look up its weather.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const locationResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`);
      if (!locationResponse.ok) throw new Error('The location service is unavailable. Try again in a moment.');
      const locationData = await locationResponse.json();
      const location = locationData.results?.[0];
      if (!location) throw new Error(`We couldn’t find “${trimmed}”. Check the spelling and try again.`);
      const params = new URLSearchParams({
        latitude: location.latitude,
        longitude: location.longitude,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
        timezone: 'auto',
        forecast_days: '5',
      });
      const forecastResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
      if (!forecastResponse.ok) throw new Error('The weather service is unavailable. Please try again later.');
      const forecast = await forecastResponse.json();
      setWeather({ location, forecast });
      setQuery(location.name);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Weather could not be loaded. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadWeather('Hyderabad'); }, []);

  function submit(event) {
    event.preventDefault();
    loadWeather(query);
  }

  const current = weather?.forecast.current;
  const daily = weather?.forecast.daily;
  return <>
    <PageHeading kicker="A LITTLE CONTEXT FOR YOUR DAY" title="Weather outside" description="Check the local forecast before heading out for a walk or workout." />
    <section className="weather-search-panel panel"><form className="weather-search" onSubmit={submit}><label className="field-label" htmlFor="weather-city">Find a city</label><div className="weather-search-controls"><input id="weather-city" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try London, Tokyo, or Hyderabad" maxLength="80" /><button className="button button-primary" disabled={loading}>{loading ? 'Checking…' : 'Search weather'} <span aria-hidden="true">⌕</span></button></div></form>{error && <p className="form-error weather-error" role="alert">{error}</p>}</section>
    {loading && !weather && <div className="weather-loading panel"><span className="loading-dot" /> Looking up the local forecast…</div>}
    {weather && current && daily && <><section className="weather-current"><div className="weather-main-copy"><span className="eyebrow eyebrow-light">CURRENT CONDITIONS</span><p className="weather-location">{weather.location.name}{weather.location.admin1 ? `, ${weather.location.admin1}` : ''}<span>{weather.location.country}</span></p><div className="weather-temp-row"><span className="weather-current-symbol" aria-hidden="true">{weatherSymbol(current.weather_code)}</span><strong>{Math.round(current.temperature_2m)}°</strong><span className="weather-condition">{weatherDescription(current.weather_code)}</span></div><p className="weather-feels">Feels like {Math.round(current.apparent_temperature)}°</p></div><div className="weather-facts"><div><span>HUMIDITY</span><strong>{current.relative_humidity_2m}%</strong></div><div><span>WIND</span><strong>{Math.round(current.wind_speed_10m)} <small>km/h</small></strong></div><div><span>HIGH / LOW</span><strong>{Math.round(daily.temperature_2m_max[0])}° / {Math.round(daily.temperature_2m_min[0])}°</strong></div></div><div className="weather-decoration" aria-hidden="true"><span className="weather-deco-sun">☼</span><span className="weather-deco-cloud">☁</span></div></section>
    <section className="panel forecast-panel"><div className="panel-heading"><div><span className="eyebrow">AHEAD OF YOU</span><h3>5-day outlook</h3></div><span className="forecast-unit">°C</span></div><div className="forecast-grid">{daily.time.map((day, index) => <article className="forecast-day" key={day}><span className="forecast-date">{index === 0 ? 'Today' : new Date(`${day}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short' })}</span><span className="forecast-symbol" aria-hidden="true">{weatherSymbol(daily.weather_code[index])}</span><span className="forecast-desc">{weatherDescription(daily.weather_code[index])}</span><strong>{Math.round(daily.temperature_2m_max[index])}° <small>{Math.round(daily.temperature_2m_min[index])}°</small></strong><span className="forecast-rain">☂ {daily.precipitation_probability_max[index] ?? 0}%</span></article>)}</div></section>
    <p className="weather-attribution">Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>. Forecasts are provided for general planning only.</p></>}
  </>;
}
