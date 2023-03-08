import { useState, useEffect, useRef } from 'react';

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

  useEffect(() => {
    const timerIsActive = timerRef.current !== null;

    if (paused && timerIsActive) {
      clearTimer();
      restartCorrection.current = nextSecondTs.current! - Date.now();
    }

    if (!paused && !timerIsActive) {
      nextSecondTs.current = Date.now() + restartCorrection.current;
      timerRef.current = window.setTimeout(subtractSecond, Math.max(0, restartCorrection.current));
    }

    function subtractSecond() {
      const secondInMs = 1000;
      const correctionFactor = Date.now() - nextSecondTs.current!;
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
    <div className="parent" onClick={() => onClose && onClose(seconds || 0)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      {finished ? <span>Done!</span> :
        <span>{seconds}</span>
      }
      {paused && <>
        <br />
        <span>Paused...</span>
      </>}
    </div>
  );
}
