import React, { useEffect, useState } from 'react';

import LoadingDots from './ui/LoadingDots';

import { useTourContext } from '../context/TourContext';

function TravelTime({ className, ...props }) {
  const { travelTimeSeconds } = useTourContext();
  const [etaDisplay, setEtaDisplay] = useState(null);
  const [travelTimeDisplay, setTravelTimeDisplay] = useState(null);

  useEffect(() => {
    if (!travelTimeSeconds) return;

    // Travel time display calculation
    const travelHours = Math.floor(travelTimeSeconds / 3600);
    const travelMinutes = Math.floor((travelTimeSeconds % 3600) / 60);
    const travelSeconds = travelTimeSeconds % 60;

    let timeString = '';
    if (travelHours > 0) timeString += `${travelHours}h `;
    if (travelMinutes > 0) timeString += `${travelMinutes}m `;
    timeString += `${travelSeconds}s`;

    setTravelTimeDisplay(timeString);

    // ETA calculation
    const now = new Date();
    const eta = new Date(now.getTime() + travelTimeSeconds * 1000);

    const padZero = (num) => (num < 10 ? `0${num}` : num);

    let etaHours = eta.getHours();
    const etaMinutes = padZero(eta.getMinutes());
    const ampm = etaHours >= 12 ? 'PM' : 'AM';

    etaHours = etaHours % 12;
    etaHours = etaHours ? etaHours : 12; // the hour '0' should be '12' TODO: Account for larger travel times

    const etaString = `${etaHours}:${etaMinutes} ${ampm}`;
    setEtaDisplay(etaString);
  }, [travelTimeSeconds]);


  return (
    <div className="flex-col">
      <div className={`flex bg-blue-500 text-white rounded-lg shadow-2xl p-10 m-6 ${travelTimeDisplay ? '' : 'justify-center'}`}>
        {travelTimeDisplay ? (
          <div className='flex-col'>
            <div className='font-semibold'>Total Travel Time</div>
            <div>{travelTimeDisplay}</div>
          </div>
        ) : (
          <LoadingDots color="white" />
        )}
      </div>
      <div className="flex bg-white rounded-lg shadow-2xl p-10 m-6">
        {travelTimeDisplay ? (
          <div className='flex-col'>
            <div className='font-semibold'>ETA</div>
            <div>{etaDisplay}</div>
          </div>
        ) : (
          <LoadingDots />
        )}
      </div>
    </div>
  );
}

export default TravelTime;
