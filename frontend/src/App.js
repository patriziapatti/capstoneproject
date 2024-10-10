import './App.css';
import Home from './components/Home';
import MyNav from './components/MyNav';
import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UserContextProvider from './context/UserContextProvider';
import New from './components/New';
import Profile from './components/Profile';
import BookingList from './components/BookingList';
import SingleBooking from './components/SingleBooking';
import Guests from './components/Guests';
import SingleGuest from './components/SingleGuest';
import Settings from './components/Settings';
import Footer from './components/Footer';


function App() {

  return (
    <UserContextProvider>
      <div className="d-flex flex-column min-vh-100">
        <Router>
          <MyNav />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/new" element={<New />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookings" element={<BookingList />} />
              <Route path="/booking/:id" element={<SingleBooking />} />
              <Route path="/guests" element={<Guests />} />
              <Route path="/guests/:id" element={<SingleGuest />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </div>
    </UserContextProvider>
  );
}

export default App;
