import { CalorieTrackerLogo } from './CalorieTrackerLogo.jsx';

function Header() {
  return (
    <header>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        <CalorieTrackerLogo size={60} />
        <h1 style={{ margin: 0 }}>Calorie Tracker</h1>
      </div>
      <nav>
        <ul>
          <li><a href="#">Diary</a></li>
          <li><a href="#">Recipes</a></li>
          <li><a href="#">Fasting</a></li>
          <li><a href="#">Profile</a></li>
        </ul>
      </nav>
      <hr />
    </header>
  );
}

export default Header;