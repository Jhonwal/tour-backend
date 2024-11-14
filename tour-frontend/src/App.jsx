// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Register from './pages/auth/Register';
import NotFound from './components/NotFound';
import LayoutAdmin from './admin/LayoutAdmin';
import AuthMiddleware from './contexts/AuthContext';
import LoginContext from './contexts/LoginContext';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        {/* <Route path="/log" element={<Logout />}/> */}
        <Route path="login" element={
            <LoginContext />
          } />
        <Route path="admin/*" element={
          <AuthMiddleware>
            <LayoutAdmin />
          </AuthMiddleware>

        } />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}




