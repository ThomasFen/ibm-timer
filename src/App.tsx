import { useState } from 'react';
import Timer from './Timer';
import './App.css';

function App() {
  const [activeTimer, setActiveTimer] = useState(false);
  const initialSeconds = 3;

  return (
    <div className='app'>
        <main>
          {activeTimer ? (
            <Timer initialSeconds={initialSeconds} onClose={(_) => setActiveTimer(false)} />
          ) : (
            <button type="button" onClick={() => setActiveTimer(true)}>Start Timer</button>
          )}
        </main>
    </div>
  );
}

export default App;
