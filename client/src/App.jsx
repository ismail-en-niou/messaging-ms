import { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './containers/login/Login';
import Home from './containers/home/Home';
import SignUp from './containers/sign_up/SignUp';
import ChatNavbar from './containers/navBar/Navbar';
import { UserContext, UserContextProvider } from './context/UserContext'; // ✅ Ensure named imports

function App() {
  const { user } = useContext(UserContext) || {}; // ✅ Prevents undefined error

  return (
    <UserContextProvider> {/* ✅ Wrap inside UserContextProvider */}
      <BrowserRouter>
        <ChatNavbar />
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
          <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
          <Route path="/signup" element={user ? <Navigate to="/home" /> : <SignUp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </UserContextProvider>
  );
}

export default App;

