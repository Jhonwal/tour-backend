// src/admin/LayoutAdmin.jsx
import { Route, Routes } from 'react-router-dom';
import NotFound from '../components/NotFound';
import Sidebar from './components/Sidbar';
import MainContent from './components/MainContent';
import Logout from '@/pages/auth/Logout';
import MainTours from './tours/MainTours';
import AddTourForm from './tours/AddTourForm';
import TourDestinition from "@/admin/tours/tourDestinition.jsx";
import TourActivities from "@/admin/tours/TourActivites.jsx";

function LayoutAdmin() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Sidebar/>}>
          <Route index element={<MainContent />} />
          <Route path='/tours' element={<MainTours/>} />
          <Route path='/tours/new-tours' element={<AddTourForm/>} />
          <Route path='/tours/activites' element={<TourActivities/>}/>
          <Route path='/tours/destination' element={<TourDestinition/>}/>
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default LayoutAdmin;
