import { useState } from 'react';
import Timer from './Timer';
import './App.css';

function App() {
  const [activeTimer, setActiveTimer] = useState(false);
  const initialSeconds = 10;

  return (
    <main className='parent'>
      <div className='child'>
        {activeTimer ? (
          <Timer initialSeconds={initialSeconds} onClose={(_) => setActiveTimer(false)} />
        ) : (
          <button type="button" onClick={() => setActiveTimer(true)}>Start Timer</button>
        )}
      </div>
    </main>
  );
}

export default App;
