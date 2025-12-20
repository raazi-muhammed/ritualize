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
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 10), 100);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

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
    reset,
  };
};
