import './App.css';
import Home from './components/Home';
import MyNav from './components/MyNav';
import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UserContextProvider from './context/UserContextProvider';

function App() {
  return (
    <UserContextProvider>
    <Router>
      <MyNav />
      <Routes>
        <Route path="/" exact element={<Home />} />
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
