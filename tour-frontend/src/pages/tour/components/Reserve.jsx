import { useEffect, useState } from "react";
import countryRegionData from 'country-region-data/dist/data-umd';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useApi from "@/services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2, User, Mail, Phone, MapPin, Users, Bed, Calendar, Star, MessageCircle } from "lucide-react";

export function Reserve({ tourId, name }) {
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const api = useApi();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    country: "",
    region: "",
    number_of_adults: 1,
    number_of_children: 0,
    number_of_rooms: 1,
    arrival_date: "",
    tour_level: "",
    special_requests: "",
    tour_id: tourId,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableRegions, setAvailableRegions] = useState([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);
    const handleChange = () => setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "country") {
      const selectedCountry = countryRegionData.find(c => c.countryName === value);
      const regions = selectedCountry ? selectedCountry.regions.map(r => r.name) : [];
      setAvailableRegions(regions);
      
      setFormData((prevState) => ({ 
        ...prevState, 
        [name]: value,
        region: "" 
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post('/api/bookings', formData);
      if (response.data.reference_code) {
        localStorage.setItem('bookingReference', response.data.reference_code);
        localStorage.setItem('bookingMessage',`Booking successful! Your reference code is:`);
        window.location.href = '/';
        setIsSubmitting(false);
      } else {
        toast.error("Booking failed. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error occurred during booking:", error);
      toast.error("There was an error while booking. Please try again.");
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.full_name) errors.full_name = "Full name is required.";
    if (!formData.email) errors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email address.";
    if (!formData.phone) errors.phone = "Phone number is required.";
    if (!formData.country) errors.country = "Country is required.";
    if (!formData.region) errors.region = "Region is required.";
    if (formData.number_of_adults < 1) errors.number_of_adults = "At least 1 adult is required.";
    if (formData.number_of_children < 0) errors.number_of_children = "Number of children cannot be negative.";
    if (formData.number_of_rooms < 1) errors.number_of_rooms = "At least 1 room is required.";
    if (!formData.arrival_date) errors.arrival_date = "Arrival date is required.";
    if (!formData.tour_level) errors.tour_level = "Please select a tour level.";
    return errors;
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen} inert={open ? "false" : "true"}>
        <DialogTrigger asChild>
          <Button variant="waguer2">Book Tour</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Book Your Tour: {name}</DialogTitle>
            <DialogDescription>
              Fill out the details below to book your tour. We'll get back to you soon!
            </DialogDescription>
          </DialogHeader>
          <BookingFormContent
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            errors={errors}
            isSubmitting={isSubmitting}
            availableRegions={availableRegions}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="waguer2">Book Tour</Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="text-center">Book Your Tour: {name}</DrawerTitle>
          <DrawerDescription>
            Fill out the details below to book your tour. We'll get back to you soon!
          </DrawerDescription>
        </DrawerHeader>
        <BookingFormContent
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          errors={errors}
          isSubmitting={isSubmitting}
          availableRegions={availableRegions}
        />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function BookingFormContent({ 
  formData, 
  onChange, 
  onSubmit, 
  errors, 
  isSubmitting, 
  availableRegions 
}) {
  const today = new Date();
  today.setDate(today.getDate() + 2);
  const minDate = today.toISOString().split("T")[0];

  return (
    <form className="grid lg:grid-cols-2 gap-4 p-4 overflow-auto" onSubmit={onSubmit}>
      {/* Previous form fields remain the same */}
      <div className="grid gap-2">
        <Label htmlFor="full_name">Full Name</Label>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-orange-600" />
          <Input 
            id="full_name" 
            name="full_name" 
            value={formData.full_name} 
            onChange={(e) => {
              onChange(e);
              if (errors.full_name && e.target.value.trim()) {
                delete errors.full_name;
              }
            }} 
            placeholder="Enter your full name" 
            variant="orange" 
          />
        </div>
        {errors.full_name && <p className="text-red-500">{errors.full_name}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-orange-600" />
          <Input 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={(e) => {
              onChange(e);
              if (errors.email && /\S+@\S+\.\S+/.test(e.target.value)) {
                delete errors.email;
              }
            }} 
            placeholder="Enter your email address" 
            variant="orange" 
          />
        </div>
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-orange-600" />
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={(e) => {
              onChange(e);
              if (errors.phone && e.target.value.trim()) {
                delete errors.phone;
              }
            }} 
            placeholder="Enter your phone number" 
            variant="orange" 
          />
        </div>
        {errors.phone && <p className="text-red-500">{errors.phone}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="country">Country</Label>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-600" />
          <select 
            id="country" 
            name="country" 
            value={formData.country} 
            onChange={onChange} 
            className='block w-full px-4 py-3 border rounded-lg text-sm bg-white text-orange-700 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 border-orange-600'
          >
            <option value="">Select Country</option>
            {countryRegionData.map(country => (
              <option key={country.countryName} value={country.countryName}>
                {country.countryName}
              </option>
            ))}
          </select>
        </div>
        {errors.country && <p className="text-red-500">{errors.country}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="region">Region</Label>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-600" />
          <select 
            id="region" 
            name="region" 
            value={formData.region} 
            onChange={onChange} 
            disabled={!formData.country}
            className={`
              block w-full px-4 py-3 border rounded-lg text-sm bg-white text-orange-700 
              font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 
              focus:ring-orange-500 border-orange-600
              ${!formData.country ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <option value="">
              {formData.country ? "Select Region" : "Select Country First"}
            </option>
            {availableRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        {errors.region && <p className="text-red-500">{errors.region}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="number_of_adults">Number of Adults</Label>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-600" />
          <Input 
            id="number_of_adults" 
            name="number_of_adults" 
            type="number" 
            value={formData.number_of_adults} 
            onChange={onChange} 
            placeholder="Enter number of adults" 
            min="1" 
            variant="orange" 
          />
        </div>
        {errors.number_of_adults && <p className="text-red-500">{errors.number_of_adults}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="number_of_children">Number of Children</Label>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-orange-600" />
          <Input 
            id="number_of_children" 
            name="number_of_children" 
            type="number" 
            value={formData.number_of_children} 
            onChange={onChange} 
            placeholder="Enter number of children" 
            min="0" 
            variant="orange" 
          />
        </div>
        {errors.number_of_children && <p className="text-red-500">{errors.number_of_children}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="number_of_rooms">Number of Rooms</Label>
        <div className="flex items-center gap-2">
          <Bed className="w-5 h-5 text-orange-600" />
          <Input 
            id="number_of_rooms" 
            name="number_of_rooms" 
            type="number" 
            value={formData.number_of_rooms} 
            onChange={onChange} 
            placeholder="Enter number of rooms" 
            min="1" 
            variant="orange" 
          />
        </div>
        {errors.number_of_rooms && <p className="text-red-500">{errors.number_of_rooms}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="arrival_date">Arrival Date</Label>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-600" />
          <Input 
            id="arrival_date" 
            name="arrival_date" 
            type="date" 
            value={formData.arrival_date} 
            onChange={(e) => {
              onChange(e);
              if (errors.arrival_date && e.target.value.trim()) {
                delete errors.arrival_date;
              }
            }} 
            placeholder="Select your arrival date" 
            min={minDate} 
            variant="orange" 
          />
        </div>
        {errors.arrival_date && <p className="text-red-500">{errors.arrival_date}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="tour_level">Tour Level</Label>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-orange-600" />
          <select 
            id="tour_level" 
            name="tour_level" 
            value={formData.tour_level} 
            onChange={(e) => {
              onChange(e);
              if (errors.tour_level && e.target.value.trim()) {
                delete errors.tour_level;
              }
            }} 
            className='block w-full px-4 py-3 border rounded-lg text-sm bg-white text-orange-700 font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 border-orange-600'
          >
            <option disabled value="">Select Level</option>
            <option value="3-stars">3 Stars</option>
            <option value="4-stars">4 Stars</option>
            <option value="4&5-stars">4 & 5 Stars</option>
            <option value="5-stars">5 Stars</option>
          </select>
        </div>
        {errors.tour_level && <p className="text-red-500">{errors.tour_level}</p>}
      </div>

      {/* Rest of the form fields */}
      <div className="grid gap-2 lg:col-span-2">
        <Label htmlFor="special_requests">Special Requests</Label>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-orange-600" />
          <Textarea 
            variant='orange'
            id="special_requests" 
            name="special_requests" 
            value={formData.special_requests} 
            onChange={onChange} 
            placeholder="Enter any special requests or preferences" 
          ></Textarea>
        </div>
      </div>

      <Button 
        type="submit" 
        variant='waguer2' 
        disabled={isSubmitting} 
        className="lg:col-span-2"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </span>
        ) : "Submit Booking"}
      </Button>

      <ToastContainer position="bottom-right" />
    </form>
  );
}