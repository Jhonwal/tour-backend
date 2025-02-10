import { Route, Routes } from 'react-router-dom';
import NotFound from '../components/NotFound';
import Sidebar from './components/Sidbar';
import MainContent from './components/MainContent';
import Logout from '@/admin/auth/Logout';
import MainTours from './tours/MainTours';
import AddTourForm from './tours/AddTourForm';
import TourDestinition from "@/admin/tours/tourDestinition.jsx";
import TourActivities from "@/admin/tours/TourActivites.jsx";
import TourServices from '@/admin/tours/TourServices.jsx';
import TourPrices from '@/admin/tours/TourPrices';
import DayImages from './tours/DayImages';
import Testimonials from '@/admin/testimonials/Testimonials';
import MainBook from '@/admin/booking/MainBook';
import { Page } from './sideBar/sidBar';
import TourDetails from './tours/view/TourDetails';
import UpdateTour from './tours/UpdateTour';
import UserProfileManagement from './profile/UserProfileManagement';
import CategoriesManagement from './blogs/CategoriesManagement';
import TourTypeManagement from './tours/TourTypeManagement';
import ViewTourType from './tours/view/ViewTourType';
import PostsManagement from './blogs/PostsManagement';
import AdminFAQPanel from './faqs/AdminFAQPanel';
import PromotionManagement from './promotions/PromotionManagement';
import TourRequestsManager from './tour-requests/TourRequestsManager';
import ActivityTable from './activity/ActivityTable';

function LayoutAdmin() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Sidebar/>}>
          <Route index element={<MainContent />} />
          <Route path='/tours' element={<MainTours/>} />
          <Route path='/tours/new-tours' element={<AddTourForm/>} />
          <Route path='/tours/activites' element={<TourActivities/>}/>
          <Route path='/tours/day-images' element={<DayImages/>}/>
          <Route path='/tours/destination' element={<TourDestinition/>}/>
          <Route path='/tours/prices' element={<TourPrices/>}/>
          <Route path='/tours/services' element={<TourServices/>}/>
          <Route path='/tours/tour_types/' element={<TourTypeManagement/>}/>
          <Route path="/tours/:id" element={<TourDetails />} />
          <Route path="/tours/tour-types/type/:id" element={<ViewTourType />} />
          <Route path='/testimonials' element={<Testimonials />} />
          <Route path="/bookings" element={<MainBook />} />
          <Route path="/tours/:tourId/update" element={<UpdateTour />} />
          <Route path="/profile" element={<UserProfileManagement />} />
          <Route path="/blogs" element={<CategoriesManagement />} />
          <Route path="/blogs/categories/:categoryId/posts" element={<PostsManagement />} />
          <Route path="/faqs" element={<AdminFAQPanel />} />
          <Route path="/promotions" element={<PromotionManagement />} />
          <Route path="/tour-requests" element={<TourRequestsManager />} />
          <Route path="/activities" element={<ActivityTable />} />
        </Route>
        <Route path="/pagee" element={<Page />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default LayoutAdmin;
