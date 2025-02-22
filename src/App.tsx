import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/Login-form";
import CafeHome from "./components/Home-page";
import RoomSelection from "./components/Room-selection";
import RoomDetails from "./components/Room-details";
import BottomNavBar from "./components/bottom-nav";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route
            path="/home"
            element={
              <>
                <CafeHome />
                <BottomNavBar />
              </>
            }
          />
          <Route
            path="/reserve"
            element={
              <>
                <RoomSelection />
                <BottomNavBar />
              </>
            }
          />
          <Route
            path="/room"
            element={
              <>
                <RoomDetails />
                <BottomNavBar />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
