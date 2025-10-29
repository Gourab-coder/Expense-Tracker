import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import ExpenseTrackerPage from './pages/ExpenseTrackerPage'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/expenses" element={<ExpenseTrackerPage />} />
        <Route path="/" element={<AuthPage />} />
      </Routes>
    </div>
  )
}

export default App
