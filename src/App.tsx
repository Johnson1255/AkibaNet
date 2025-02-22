import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginForm from "./components/Login-form";
import CafeHome from "./components/Home-page";
import RoomSelection from "./components/Room-selection";
import RoomDetails from "./components/Room-details";
import BottomNavBar from "./components/bottom-nav";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <div className="min-h-screen pb-16">
      <Routes>
        <Route path="/" element={<CafeHome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/reserve" element={<RoomSelection />} />
        <Route path="/room-details" element={<RoomDetails />} />
      </Routes>
      {location.pathname !== "/login" && <BottomNavBar />}
    </div>
  );
}

export default App;