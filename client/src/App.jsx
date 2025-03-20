import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserContextProvider } from "./context/UserContext";
import { ChatContextProvider } from "./context/ChatContext"; // ✅ Ensure correct import
import Login from "./containers/login/Login";
import Home from "./containers/home/Home";
import SignUp from "./containers/sign_up/SignUp";
import ChatNavbar from "./containers/navBar/Navbar";
import Search from "./containers/search/Search";
import Cookies from "js-cookie";

function App() {
  let data = Cookies.get("all");
  let user = null;
  if (data) {
    user = JSON.parse(data);
  }

  return (
    <UserContextProvider> {/* ✅ Ensure `UserContextProvider` is wrapping */}
      <ChatContextProvider user={user}> {/* ✅ Ensure `ChatContextProvider` is wrapping */}
        <BrowserRouter>
          <ChatNavbar />
          <Routes>
            <Route path="/" element={<Login />} />
            {/* Add 'desktop-only' class to Search */}
            <Route path="/Search" element={<Search className="desktop-only" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </ChatContextProvider>
    </UserContextProvider>
  );
}

export default App;
