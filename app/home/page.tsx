'use client';

import React, { useEffect } from 'react'  // Make sure useEffect is imported
import { env } from '../../lib/config/env';
import logger from '../../lib/logger';
import { HttpStatus, ErrorMessages } from '../../lib/constants';

const Page = () => {  // Capitalized component name (convention)
  // Use logger instead of console.log
  logger.info('Home page loaded');
  
  const fetchData = async () => {
    try {
      const res = await fetch(`${env.apiUrl}/users`);
      
      if (res.status === HttpStatus.UNAUTHORIZED) {
        logger.warn(ErrorMessages.UNAUTHORIZED);
        // Handle unauthorized
      }
      
    } catch (error) {
      logger.error('Failed to fetch', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);  // Empty dependency array = run once on mount

  return (
    <div>
      <h1>Welcome to TailBuddies!</h1>
      <h2>Data loaded</h2>
    </div>
  )
}

export default Page;