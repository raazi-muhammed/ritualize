import { useState, useEffect } from "react";

function formatSmartTime(
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
) {
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")} hours`;
  }

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")} min`;
  }

  if (seconds > 0) {
    return `${seconds}:${milliseconds.toString().padStart(2, "0")} sec`;
  }

  return `${milliseconds} ms`;
}

export const useStopwatch = () => {
  // state to store time
  const [time, setTime] = useState(0);

  // state to check stopwatch running or not
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      // Functional update so the interval doesn't need `time` as a dependency
      // -- otherwise it'd tear down and recreate the timer on every tick.
      intervalId = setInterval(() => setTime((t) => t + 10), 100);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  // Hours calculation
  const hours = Math.floor(time / 360000);

  // Minutes calculation
  const minutes = Math.floor((time % 360000) / 6000);

  // Seconds calculation
  const seconds = Math.floor((time % 6000) / 100);

  // Milliseconds calculation
  const milliseconds = time % 100;

  // Method to reset timer back to 0
  const reset = () => {
    setTime(0);
  };

  useEffect(() => {
    setIsRunning(true);
  }, []);

  return {
    time: formatSmartTime(hours, minutes, seconds, milliseconds),
    elapsedMs: time * 10,
    reset,
  };
};
