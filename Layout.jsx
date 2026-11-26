const navigation = [
  { id: 'dashboard', label: 'Overview', symbol: '⌂', group: 'TRACK' },
  { id: 'workouts', label: 'Workouts', symbol: '↗' },
  { id: 'steps', label: 'Steps & calories', symbol: '⌁' },
  { id: 'diet', label: 'Nutrition', symbol: '◉' },
  { id: 'goals', label: 'My goals', symbol: '◎', group: 'YOUR SPACE' },
  { id: 'progress', label: 'Progress', symbol: '▥' },
  { id: 'health', label: 'Wellness', symbol: '♡' },
  { id: 'weather', label: 'Weather', symbol: '☼', group: 'DISCOVER' },
];

export default function Layout({ user, page, onNavigate, onLogout, children }) {
  const initials = user.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); onNavigate('dashboard'); }}>
          <span className="brand-mark">s</span><span>stride</span>
        </a>
        <div className="sidebar-caption">YOUR PERSONAL SPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <div key={item.id}>
              {item.group && <div className="nav-group">{item.group}</div>}
              <button type="button" className={`nav-item ${page === item.id ? 'selected' : ''}`} onClick={() => onNavigate(item.id)} aria-current={page === item.id ? 'page' : undefined}>
                <span className="nav-symbol" aria-hidden="true">{item.symbol}</span>
                <span>{item.label}</span>
                {page === item.id && <span className="nav-active-dot" />}
              </button>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="side-quote">
            <span className="quote-star">✳</span>
            <p>Progress isn’t always loud. Sometimes it’s just showing up.</p>
            <span className="quote-byline">A NOTE TO YOURSELF</span>
          </div>
          <button type="button" className="profile-button" onClick={onLogout} title="Log out">
            <span className="avatar">{initials}</span>
            <span className="profile-copy"><strong>{user.name}</strong><small>Log out</small></span>
            <span className="logout-icon" aria-hidden="true">↗</span>
          </button>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">s</span> stride</div>
          <div className="breadcrumb"><span>My space</span><span className="breadcrumb-slash">/</span><strong>{navigation.find((item) => item.id === page)?.label || 'Overview'}</strong></div>
          <div className="topbar-right">
            <span className="today-label">{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            <button type="button" className="topbar-avatar" onClick={onLogout} aria-label={`Log out ${user.name}`} title="Log out">{initials}</button>
          </div>
        </header>
        <main className="page-content">{children}</main>
        <footer className="app-footer"><span>STRIDE · YOUR PERSONAL WELLNESS COMPANION</span><span>Made for progress, not perfection.</span></footer>
      </div>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.map((item) => (
          <button type="button" key={item.id} className={page === item.id ? 'active' : ''} onClick={() => onNavigate(item.id)} aria-label={item.label}>
            <span aria-hidden="true">{item.symbol}</span><small>{({ dashboard: 'Home', workouts: 'Workout', steps: 'Steps', diet: 'Food', goals: 'Goals', progress: 'Progress', health: 'Wellness', weather: 'Weather' })[item.id]}</small>
          </button>
        ))}
      </nav>
    </div>
  );
}
