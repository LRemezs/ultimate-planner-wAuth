import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Footer from './components/common/Footer';
import EventDetailsPage from './components/common/EventDetailsPage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/events/:eventId/user/:userId' element={<EventDetailsPage />}></Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App;