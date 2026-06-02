import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SubmitPage from './pages/SubmitPage'
import TrackPage from './pages/TrackPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import StylePreview from './pages/StylePreview'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/submit" replace />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/track/:ticketId" element={<TrackPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/style-preview" element={<StylePreview />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
