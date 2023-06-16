// A container to move Stopwatch.js to a higher-level component so that stopwatch will still
// run when navigating to other screens
import React, { useState, useEffect } from 'react';
import Stopwatch from './Stopwatch';

const StopwatchContainer = () => {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <Stopwatch
      isRunning={isRunning}
      setIsRunning={setIsRunning}
    />
  );
};

export default StopwatchContainer;
