import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/Login-form';

function App() {
  return (
    <Router>
      <div className='p-4'>
        <nav className='mb-4'>
          {/* Aquí puedes agregar enlaces de navegación si es necesario */}
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          {/* Aquí puedes agregar más rutas según sea necesario */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;