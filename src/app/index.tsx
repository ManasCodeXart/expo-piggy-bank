import { useCallback, useState } from 'react'
import GravitySavings from '../components/GravitySavings'

const DEMO_AVATAR = require('../../assets/images/Avatar.png')
const DEMO_INITIAL_SAVINGS = 3600
const SAVE_SIMULATION_DELAY = 1200

export default function GravitySavingsDemo() {
  const [currentSavings, setCurrentSavings] = useState(DEMO_INITIAL_SAVINGS)

  const handleSave = useCallback(async (amount: number) => {
    // Replace with a real deposit/payment API call.
    await new Promise<void>((resolve) => setTimeout(resolve, SAVE_SIMULATION_DELAY))
    setCurrentSavings((prev) => prev + amount)
  }, [])

  const handleError = useCallback((error: unknown) => {
    console.warn('Save failed:', error)
  }, [])

  return (
    <GravitySavings
      currentSavings={currentSavings}
      userName="ManasCodeXart"
      userAvatar={DEMO_AVATAR}
      onSave={handleSave}
      onError={handleError}
    />
  )
}