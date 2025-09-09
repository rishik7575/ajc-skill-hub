import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize mock data in a simple way
const initializeApp = () => {
  try {
    // Import and initialize mock data
    import('./lib/mockData').then(({ initializeMockData }) => {
      initializeMockData()
      console.log('Mock data initialized')
    })

    import('./lib/studentData').then(({ StudentDataService }) => {
      StudentDataService.initializeDefaultProgress()
      console.log('Student data initialized')
    })

    // Initialize MCQ system
    import('./lib/mcqSystem').then(({ MCQService }) => {
      MCQService.initializeMCQData()
      console.log('MCQ system initialized')
    })

    // Initialize Task system
    import('./lib/taskSystem').then(({ TaskService }) => {
      TaskService.initializeTaskData()
      console.log('Task system initialized')
    })
  } catch (error) {
    console.warn('Failed to initialize some data:', error)
  }
}

// Initialize the app
initializeApp()

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found');
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
