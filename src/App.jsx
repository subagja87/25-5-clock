import './App.css'
import { useState, useRef } from 'react';
import { FaArrowCircleUp, FaArrowCircleDown, FaPlay, FaPause, FaReply } from 'react-icons/fa';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const intervalRef = useRef(null);
 
  const handleStartStop = () => {
    //Pause the timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setElapsedTime(now - startTime);
      setIsRunning(false);
    } 
    //Start the timer
    else {
      setStartTime(Date.now() - elapsedTime);
      setNow(Date.now());
      intervalRef.current = setInterval(() => {
        setNow(Date.now());
      }, 1000);
      setIsRunning(true);
    }
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = Math.floor((now - startTime) / 1000);
  }
  
  const seconds = isBreak ? (breakLength * 60) : (sessionLength * 60);
  const minutes = Math.floor((seconds - secondsPassed) / 60);
  const remainingSeconds = (seconds - secondsPassed) % 60;
  const alarm = document.getElementById('beep');

  if ((seconds - secondsPassed) === 0) {
    alarm.play();
  }
  else if ((seconds - secondsPassed) < 0 && !isBreak) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsBreak(true);
    setStartTime(Date.now());
    setNow(Date.now());
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    setIsRunning(true);
  }
  else if ((seconds - secondsPassed) < 0 && isBreak) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsBreak(false);
    setStartTime(Date.now());
    setNow(Date.now());
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    setIsRunning(true);
  }

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    clearInterval(intervalRef.current);
    setStartTime(null);
    setNow(null);
    setIsRunning(false);
    setIsBreak(false);
    setElapsedTime(0);
    intervalRef.current = null;
    alarm.pause();
    alarm.currentTime = 0;
  }

  function formatTime() {
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
 
  function handleBreakIncrement() {
    if (intervalRef.current === null && isBreak) {
      setStartTime(null);
      setNow(null);
      setElapsedTime(0);
      setBreakLength(breakLength + 1);
      if (breakLength >= 60) {
        setBreakLength(60);
      }
    }
    else if (intervalRef.current === null && !isBreak) {
      setBreakLength(breakLength + 1);
      if (breakLength >= 60) {
        setBreakLength(60);
      }
    }
  }
  function handleBreakDecrement() {
    if (intervalRef.current === null && isBreak) {
      setStartTime(null);
      setNow(null);  
      setElapsedTime(0);
      setBreakLength(breakLength - 1);
      if (breakLength <= 1) {
        setBreakLength(1);
      }
    }
    else if (intervalRef.current === null && !isBreak) {
      setBreakLength(breakLength - 1);
      if (breakLength <= 1) {
        setBreakLength(1);
      }
    }
  }
  function handleSessionIncrement() {
    if (intervalRef.current === null && !isBreak) {
      setStartTime(null);
      setNow(null);
      setElapsedTime(0);
      setSessionLength(sessionLength + 1);
      if (sessionLength >= 60) {
        setSessionLength(60);
      }
    }
    else if (intervalRef.current === null && isBreak) {
      setSessionLength(sessionLength + 1);
      if (sessionLength >= 60) {
        setSessionLength(60);
      }
    }
  }
  function handleSessionDecrement() {
    if (intervalRef.current === null && !isBreak) {
      setStartTime(null);
      setNow(null);
      setElapsedTime(0);
      setSessionLength(sessionLength - 1);
      if (sessionLength <= 1) {
        setSessionLength(1);
      }
    }
    else if (intervalRef.current === null && isBreak) {
      setSessionLength(sessionLength - 1);
      if (sessionLength <= 1) {
        setSessionLength(1);
      }
    }  
  }
  
  return (
    <div id='container'>
      <h1>25 + 5 Clock</h1>
      <div id='container-break'>
        <div id='break-label'>Break Length</div>
        <div id='break-increment' onClick={handleBreakIncrement}><FaArrowCircleUp /></div>
        <div id='break-length'>{breakLength}</div>
        <div id='break-decrement' onClick={handleBreakDecrement}><FaArrowCircleDown /></div>
      </div>
      <div id='container-session'>
        <div id='session-label'>Session Length</div>
        <div id='session-increment' onClick={handleSessionIncrement}><FaArrowCircleUp /></div>
        <div id='session-length'>{sessionLength}</div>
        <div id='session-decrement' onClick={handleSessionDecrement}><FaArrowCircleDown /></div>
      </div>
      <div id='container-timer'>
        <div id='timer-label'>{isBreak ? 'Break' : 'Session'}</div>
        <div id='time-left'>{formatTime()}</div>
        <div id='timer-control'>
          <div id='start_stop' onClick={handleStartStop}>
            {isRunning ? <FaPause /> : <FaPlay />}
          </div>
          <div id='reset' onClick={handleReset}>
            <FaReply />  
          </div>
          <audio id='beep' preload='auto' src='https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav' />
        </div>
      </div>
    </div>
  )
}

export default App
