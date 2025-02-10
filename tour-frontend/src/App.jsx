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
import ForgotPassword from './admin/auth/ForgotPassword';
import ResetPassword from './admin/auth/ResetPassword';
import BlogPage from './pages/blogs/BlogPage';
import PostDetails from './pages/blogs/PostDetails';
import Promotions from './pages/components/Promotions';
import ContactForm from './pages/components/ContactForm';
import PersonaliseTour from './pages/tour/PersonaliseTour';

export default function App() {
  if (!sessionStorage.getItem("console_signature_shown")) {
    console.log("%c🚀 Made with ❤️ by %cWaguer", 
        "color: black; font-size: 18px; font-weight: bold; background: #f0f0f0; padding: 8px; border-radius: 5px;",
        "color: blue; font-size: 18px; font-weight: bold; text-decoration: underline; cursor: pointer;"
    );

    console.log("🔗 Visit my portfolio: https://your-portfolio.com");

    console.log("%c⚠ WARNING! ⚠", "color: red; font-size: 20px; font-weight: bold; text-shadow: 1px 1px 2px black;");
    console.log("%cDo not paste anything here! It may be a security risk (Self-XSS).", "color: orange; font-size: 16px; font-weight: bold;");
    console.log("%cIf someone told you to paste something here, they might be trying to steal your account!", "color: red; font-size: 14px;");
    
    // Mark as shown
    sessionStorage.setItem("console_signature_shown", "true");
}

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/tour/:id" element={<TourDetails />} />
          <Route path="/tour/types/:id" element={<TourTypesList/>} />
          <Route path='/privacy' element={<WaguerPolicy/>} />
          <Route path='/terms' element={<TermsOfService/>} />
          <Route path='/blog' element={<BlogPage/>} />
          <Route path='/blog/post/:slug' element={<PostDetails/>} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/contact-us" element={<ContactForm />} />
          <Route path="/get-quote" element={<PersonaliseTour />} />
        </Route>
        <Route path='/check-booking' element={<CheckBooking/>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset/:token" element={<ResetPassword />} />

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




