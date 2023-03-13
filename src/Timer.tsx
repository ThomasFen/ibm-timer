import { useState, useEffect, useRef } from 'react';
import './Timer.css';

interface Props {
  initialSeconds: number;
  onClose?: (remainingSeconds: number) => void;
}

export default function Timer({ initialSeconds, onClose }: Props) {
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState<number | null>(initialSeconds);
  const timerRef = useRef<number | null>(null);
  const restartCorrection = useRef(1);
  const nextSecondTs = useRef<number>();
  const finished = seconds === null;
  const hideNotifcation = !paused && !finished;

  useEffect(() => {
    const timerIsActive = timerRef.current !== null;

    if (paused && timerIsActive) {
      clearTimer();
      restartCorrection.current = nextSecondTs.current! - performance.now();
    }

    if (!paused && !timerIsActive) {
      nextSecondTs.current = performance.now() + restartCorrection.current;
      timerRef.current = window.setTimeout(subtractSecond, Math.max(0, restartCorrection.current));
    }

    function subtractSecond() {
      const secondInMs = 1000;
      const correctionFactor = performance.now() - nextSecondTs.current!;
      const msUntilNextSecond = secondInMs - correctionFactor;

      setSeconds(s => (!s || s <= 0) ? null : --s);

      nextSecondTs.current! += secondInMs;

      timerRef.current = window.setTimeout(subtractSecond, msUntilNextSecond);
    }
  }, [paused]);

  useEffect(() => {
    if (initialSeconds < 0) {
      console.warn("Can't start from a negative initial seconds value and count down to zero");
    }
  }, [initialSeconds]);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  useEffect(() => {
    if (finished) {
      clearTimer();
    }
  }, [finished]);

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
    clearTimeout(timerRef.current!);
    timerRef.current = null;
  }

  return (
    <div className='timer'>
      <div className='seconds-wrapper'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClose && onClose(seconds || 0)}
        title="Click to stop timer">
        <span className='seconds' aria-atomic aria-live="polite">
          {seconds || 0}
        </span>
      </div>
      <div className={'notification' + (hideNotifcation && ' hide')}>
        <hr className='divider'></hr>
        <p className='label'>
          {finished ? 'Done!' : 'Paused...'}
        </p>
      </div>
    </div>
  );
}
