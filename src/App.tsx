import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ReservationProvider } from '@/context/ReservationContext';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext'; // Importar ThemeProvider
import { PrivateRoute, PublicRoute } from '@/components/PrivateRoute';

import LogInPage from "@/components/auth/LogInPage";
import Home from "@/components/HomePage/index";
import RoomSelection from "@/components/RoomsPage/index";
import RoomDetails from "@/components/RoomDetailsPage/index";
import AdditionalServices from "@/components/AdditionalServicesPage/index";
import AccountPage from "@/components/AccountPage/index";
import SignUpPage from "@/components/auth/SignUpPage";
import Confirmation from "@/components/Confirmation/index";
import HelpServicesPage from "@/components/HelpPage/index";
import FoodPage from "@/components/FoodPage/index";
import ActiveReservationPage from '@/components/ActiveReservationPage/index';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ReservationProvider>
            <AppRoutes />
          </ReservationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Ruta raíz que redirige a home o login según autenticación */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Rutas públicas - solo accesibles si NO está autenticado */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LogInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>
      
      {/* Rutas privadas - solo accesibles si está autenticado */}
      <Route element={<PrivateRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/reserve" element={<RoomSelection />} />
        <Route path="/room-details/:roomId" element={<RoomDetails />} />
        <Route path="/additional-services" element={<AdditionalServices />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/help-services" element={<HelpServicesPage />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/food" element={<FoodPage/>} />
        <Route path="/active-reservation" element={<ActiveReservationPage />} />
      </Route>
    </Routes>
  );
}

export default App;