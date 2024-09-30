import './App.css';
import Home from './components/Home';
import MyNav from './components/MyNav';
import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UserContextProvider from './context/UserContextProvider';
import New from './components/New';
import Profile from './components/Profile';
import BookingList from './components/BookingList';
import SingleBooking from './components/SingleBooking';

function App() {
  return (
    <UserContextProvider>
    <Router>
      <MyNav />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/new" element={<New />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route path="/booking/:id" element={<SingleBooking />} />
        {/* <Route path="/blog/:id" element={<Blog />} />
        <Route path="/new" element={<NewBlogPost />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/*" element={<Navigate to="/404" />}/> */}
        {/* <Route path="/blogPosts/:id" element={<SingleBlogPost />} /> */}
        {  /* <Route path="/authors" element={<AuthorList />} /> da creare */}
        {  /* <Route path="/authors/:id" element={<SingleAuthor />} /> da creare */}
      </Routes>
      {/* <Footer /> */}
    </Router>
    </UserContextProvider>
  );
}

export default App;
