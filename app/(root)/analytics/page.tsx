import { getAnalytics } from '@/lib/api'
import React from 'react'

const Analytics = async () => {
  const analytics = await getAnalytics();
  console.log("Analytics data:", analytics);
  return (
    <div>Analytics</div>
  )
}

export default Analytics