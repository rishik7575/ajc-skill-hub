import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeMockData } from './lib/mockData'
import { StudentDataService } from './lib/studentData'

// Initialize mock data
initializeMockData()
StudentDataService.initializeDefaultProgress()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
