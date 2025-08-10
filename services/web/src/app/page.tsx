"use client";

import { useState, useEffect } from 'react';

function ApiHealthCheck() {
  const [apiStatus, setApiStatus] = useState<string>('Loading...');
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('http://localhost:8001/health')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(data => {
        if (data.ok) {
          setApiStatus('Online');
          setIsOnline(true);
        } else {
          setApiStatus('Offline');
          setIsOnline(false);
        }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setApiStatus('Offline');
        setIsOnline(false);
      });
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span>API Status:</span>
      <span className={`font-mono font-semibold ${isOnline === true ? 'text-green-500' : isOnline === false ? 'text-red-500' : 'text-gray-500'}`}>
        {apiStatus}
      </span>
      {isOnline !== null && (
        <span className={`h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to the future of app building.
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
           <ApiHealthCheck />
        </div>
      </div>

      <div className="relative z-[-1] flex place-items-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-center">
          No-code Builder
        </h1>
      </div>
    </main>
  );
}
