import { useState, useEffect, useRef } from 'react';

export default function Timer({ initialSeconds, onTimerStopped }) {
    const [paused, setPaused] = useState(false);
    const [seconds, setSeconds] = useState(initialSeconds);
    const timerRef = useRef(null);
    const restartCorrection = useRef(0);
    const nextSecondTs = useRef();
    const finished = seconds === null;
  
    useEffect(() => {
      return () => clearTimer;
    }, []);
  
    useEffect(() => {
      if (finished) { clearTimer(); }
    }, [finished]);
  
    useEffect(() => {
      const timerIsActive = timerRef.current !== null;
  
      if (paused && timerIsActive) {
        clearTimer();
        restartCorrection.current = nextSecondTs.current - Date.now();
      }
  
      if (!paused && !timerIsActive) {
        nextSecondTs.current = Date.now() + restartCorrection.current;
        timerRef.current = setTimeout(subtractSecond, Math.max(0, restartCorrection.current));
      }
  
      function subtractSecond() {
        const secondInMs = 1000;
        const correctionFactor = Date.now() - nextSecondTs.current;
        const msUntilNextSecond = secondInMs - correctionFactor;
  
        setSeconds(s => s <= 0 ? null : --s);
  
        nextSecondTs.current += secondInMs;
  
        timerRef.current = setTimeout(subtractSecond, msUntilNextSecond);
      }
    }, [paused])
  
  
    function handleMouseEnter() {
      if (!finished) {
        setPaused(true);
      }
    }
  
    function handleMouseLeave() {
      if (!finished) {
        setPaused(false);
      }
  
    }
  
    function clearTimer() {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  
    return (
      <div onClick={() => onTimerStopped()}>
        {finished ? <span>Done!</span> : <span
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >{seconds}</span>}
        {paused && <><br /><span>Paused...</span></>}
      </div>
    );
  }