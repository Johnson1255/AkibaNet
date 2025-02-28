import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LogIn-form";
import CafeHome from "./components/Home-page";
import RoomSelection from "./components/Room-selection";
import RoomDetails from "./components/Room-details";
import AdditionalServices from "./components/Additional-services";
import AccountPage from "./components/Account-page";
import SignUpPage from "./components/SignUp-page";
import MyReservationPage from "./components/My-Reservation-page";
import HelpServicesPage from "./components/Help-Services-page";
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  return (
      <Routes>
        <Route path="/home" element={<CafeHome />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/reserve" element={<RoomSelection />} />
        <Route path="/room-details" element={<RoomDetails />} />
        <Route path="/additional-services" element={<AdditionalServices />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/my-reservation" element={<MyReservationPage />} />
        <Route path="/help-services" element={<HelpServicesPage />} />
      </Routes>
  );
}

export default App;