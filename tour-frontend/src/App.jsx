// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './pages/Layout';
import Home from './pages/Home';
import NotFound from './components/NotFound';
import LayoutAdmin from './admin/LayoutAdmin';
import AuthMiddleware from './contexts/AuthContext';
import LoginContext from './contexts/LoginContext';
import TourDetails from './pages/tour/TourDetails';
import TourTypesList from './pages/tour/TourTypesList';
import CheckBooking from './pages/CheckBooking';
import WaguerPolicy from './services/WaguerPolicy';
import TermsOfService from './services/TermsOfService';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/tour/:id" element={<TourDetails />} />
          <Route path="/tour/types/:id" element={<TourTypesList/>} />
          <Route path='/check-booking' element={<CheckBooking/>} />
          <Route path='/privacy' element={<WaguerPolicy/>} />
          <Route path='/terms' element={<TermsOfService/>} />
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




