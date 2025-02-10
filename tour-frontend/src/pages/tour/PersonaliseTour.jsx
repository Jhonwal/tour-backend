import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { allCountries } from 'country-region-data';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useApi from '@/services/api';

const PersonaliseTour = () => {
  const api = useApi();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // User Information
    fullName: '',
    email: '',
    phone: '',
    country: '',
    
    // Trip Details
    travelers: '',
    hasChildren: false,
    childrenCount: '',
    childrenAges: '',
    duration: '',
    arrivalDate: null,
    departureDate: null,
    
    // Experience Preferences
    experienceTypes: [],
    destinations: [],
    accommodationType: [],
    activities: [],
    
    // Budget & Transportation
    budgetRange: [],
    customBudget: '',
    transportation: [],
    
    // Special Requests
    dietaryPreferences: [],
    additionalServices: [],
    additionalActivities: [],
    otherRequests: ''
  });
  useEffect(
    () => {
      window.scrollTo(0, 0);
    }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter(item => item !== value)
        : [...prev[name], value]
    }));
  };

  const handleDateChange = (field, date) => {
    setFormData(prev => ({ ...prev, [field]: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      travelers: formData.travelers,
      has_children: formData.hasChildren,
      children_count: formData.childrenCount || 0,
      children_ages: formData.childrenAges ? formData.childrenAges.split(',').map(age => age.trim()) : [],
      duration: formData.duration,
      arrival_date: formData.arrivalDate?.toISOString().split('T')[0], 
      departure_date: formData.departureDate?.toISOString().split('T')[0], 
      experience_types: formData.experienceTypes,
      destinations: formData.destinations,
      accommodation_type: formData.accommodationType,
      budget_range: formData.budgetRange,
      custom_budget: formData.customBudget || null,
      transportation: formData.transportation,
      dietary_preferences: formData.dietaryPreferences,
      additional_services: formData.additionalServices,
      additional_activities: formData.additionalActivities,
      other_requests: formData.otherRequests || null,
    };

    try {
      // Send the form data to the Laravel backend
      const response = await api.post('/api/tour-requests', payload);

      // Show success notification
      toast.success('Tour request submitted successfully!', {
        position: "top-center",
        autoClose: 3000,
      });

      // Reset the form after successful submission
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        country: '',
        travelers: '',
        hasChildren: false,
        childrenCount: '',
        childrenAges: '',
        duration: '',
        arrivalDate: null,
        departureDate: null,
        experienceTypes: [],
        destinations: [],
        accommodationType: [],
        activities: [],
        budgetRange: [],
        customBudget: '',
        transportation: [],
        dietaryPreferences: [],
        additionalServices: [],
        additionalActivities: [],
        otherRequests: ''
      });

      // Reset to Step 1
      setStep(1);

    } catch (error) {

      toast.error('There was an error submitting the form. Please try again.', {
        position: "top-center",
        autoClose: 3000,
      });

    }
  };
  const renderStep1 = () => (
    <div className="space-y-4">
      <div className='space-y-2'>
        <Label htmlFor="fullName">Full Name</Label>
        <Input variant='orange'
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="mt-1"
          placeholder="Enter your full name"
        />
      </div>
      
      <div className='space-y-2'>
        <Label htmlFor="email">Email</Label>
        <Input variant='orange'
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1"
          placeholder="your@email.com"
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor="phone">Phone Number</Label>
        <Input variant='orange'
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="mt-1"
          placeholder="+1 (234) 567-8900"
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor="country">Country of Residence</Label>
        <Select
          value={formData.country}
          onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            {allCountries.map((country) => (
              <SelectItem key={country[0]} value={country[0]}>
                {country[0]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const handleChildAgeChange = (index, value) => {
      const newAges = [...formData.childrenAges.split(',').map(age => age.trim())];
      newAges[index] = value;
      setFormData(prev => ({ ...prev, childrenAges: newAges.join(',') }));
    };
  
    return (
      <div className="space-y-4">
        <div className='space-y-2'>
          <Label htmlFor="travelers">Number of Travelers</Label>
          <Select
            value={formData.travelers}
            onValueChange={(value) => setFormData(prev => ({ ...prev, travelers: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select number of travelers" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30].map(num => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
  
        <div className="flex items-center space-x-2">
          <Switch
            id="hasChildren"
            checked={formData.hasChildren}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, hasChildren: checked }))}
          />
          <Label htmlFor="hasChildren">Traveling with children?</Label>
        </div>
  
        {formData.hasChildren && (
          <div className="space-y-2">
            <div className='space-y-2'>
              <Label htmlFor="childrenCount">Number of Children</Label>
              <Input variant='orange'
                id="childrenCount"
                name="childrenCount"
                type="number"
                value={formData.childrenCount}
                onChange={(e) => {
                  const count = e.target.value;
                  setFormData(prev => ({
                    ...prev,
                    childrenCount: count,
                    childrenAges: Array(Number(count)).fill('').join(','), // Initialize ages array
                  }));
                }}
                className="mt-1"
                min="1"
              />
            </div>
  
            {formData.childrenCount > 0 && (
              <>
                <Label>Children's Ages</Label>
              <div className='flex flex-wrap space-x-2'>
                {Array.from({ length: formData.childrenCount }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`childAge-${index}`}>Child {index + 1} Age</Label>
                    <Input variant='orange'
                      id={`childAge-${index}`}
                      type="number"
                      value={formData.childrenAges.split(',')[index] || ''}
                      onChange={(e) => handleChildAgeChange(index, e.target.value)}
                      className="mt-1"
                      min="0"
                      placeholder={`Enter age for child ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              </>
            )}
          </div>
        )}
  
        <div className='space-y-2'>
          <Label htmlFor="duration">Trip Duration (Days)</Label>
          <Input variant='orange'
            id="duration"
            name="duration"
            type="number"
            value={formData.duration}
            onChange={handleInputChange}
            className="mt-1"
            min="1"
          />
        </div>
  
        <div className="space-y-2">
          <Label>Travel Dates</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='space-y-2'>
              <Label>Arrival Date</Label>
              <Calendar
                mode="single"
                selected={formData.arrivalDate}
                onSelect={(date) => handleDateChange('arrivalDate', date)}
                disabled={(date) => date < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
                className="rounded-md border"
              />
            </div>
            <div className='space-y-2'>
              <Label>Departure Date</Label>
              <Calendar
                mode="single"
                selected={formData.departureDate}
                onSelect={(date) => handleDateChange('departureDate', date)}
                disabled={(date) => date < (formData.arrivalDate || new Date())}
                className="rounded-md border"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    const handleOtherExperienceChange = (value) => {
      setFormData(prev => {
        const filteredTypes = prev.experienceTypes.filter(item => 
          ['Romantic / Honeymoon', 'Adventure', 'Cultural', 'Relaxation',
           'Family-Friendly Activities', 'others'].includes(item)
        );
        
        // Find existing custom value
        const customValue = prev.experienceTypes.find(item => 
          !['Romantic / Honeymoon', 'Adventure', 'Cultural', 'Relaxation',
           'Family-Friendly Activities', 'others'].includes(item)
        );
        
        // If there's no custom value yet, add the new value
        if (!customValue) {
          return {
            ...prev,
            experienceTypes: [...filteredTypes, value]
          };
        }
        
        // Replace existing custom value with new value
        return {
          ...prev,
          experienceTypes: [...filteredTypes, value]
        };
      });
    };
  
    const handleOtherDestinationChange = (value) => {
      setFormData(prev => {
        const defaultDestinations = [
          'Marrakech', 'Fes', 'Chefchaouen', 'Sahara Desert', 'Casablanca',
          'Rabat', 'Essaouira', 'Ouarzazate', 'Meknes', 'Tangier', 'Tetouan',
          'Agadir', 'Merzouga', 'other destination'
        ];
        
        const filteredDestinations = prev.destinations.filter(item => 
          defaultDestinations.includes(item)
        );
        
        return {
          ...prev,
          destinations: [...filteredDestinations, value]
        };
      });
    };
  
    const handleOtherAccommodationChange = (value) => {
      setFormData(prev => {
        const defaultTypes = [
          'Luxury Hotel', 'Riad', 'Desert Camp', 'Budget Stay',
          'Boutique Hotel', 'other'
        ];
        
        const filteredTypes = prev.accommodationType.filter(item => 
          defaultTypes.includes(item)
        );
        
        return {
          ...prev,
          accommodationType: [...filteredTypes, value]
        };
      });
    };
  
    const handleCheckboxChange = (name, value) => {
      setFormData(prev => {
        // If unchecking, remove both the checkbox value and any custom value
        if (prev[name].includes(value)) {
          let defaultValues;
          if (name === 'experienceTypes') {
            defaultValues = ['Romantic / Honeymoon', 'Adventure', 'Cultural', 'Relaxation',
                            'Family-Friendly Activities', 'others'];
          } else if (name === 'destinations') {
            defaultValues = ['Marrakech', 'Fes', 'Chefchaouen', 'Sahara Desert', 'Casablanca',
                            'Rabat', 'Essaouira', 'Ouarzazate', 'Meknes', 'Tangier', 'Tetouan',
                            'Agadir', 'Merzouga', 'other destination'];
          } else {
            defaultValues = ['Luxury Hotel', 'Riad', 'Desert Camp', 'Budget Stay',
                            'Boutique Hotel', 'other'];
          }
          return {
            ...prev,
            [name]: prev[name].filter(item => defaultValues.includes(item) && item !== value)
          };
        }
        
        // If checking, just add the checkbox value
        return {
          ...prev,
          [name]: [...prev[name], value]
        };
      });
    };
  
    // Get custom values for inputs
    const getCustomExperience = () => {
      return formData.experienceTypes.find(item => 
        !['Romantic / Honeymoon', 'Adventure', 'Cultural', 'Relaxation',
          'Family-Friendly Activities', 'others'].includes(item)
      ) || '';
    };
  
    const getCustomDestination = () => {
      return formData.destinations.find(item => 
        !['Marrakech', 'Fes', 'Chefchaouen', 'Sahara Desert', 'Casablanca',
          'Rabat', 'Essaouira', 'Ouarzazate', 'Meknes', 'Tangier', 'Tetouan',
          'Agadir', 'Merzouga', 'other destination'].includes(item)
      ) || '';
    };
  
    const getCustomAccommodation = () => {
      return formData.accommodationType.find(item => 
        !['Luxury Hotel', 'Riad', 'Desert Camp', 'Budget Stay',
          'Boutique Hotel', 'other'].includes(item)
      ) || '';
    };
  
    return (
      <div className="space-y-6">
        {/* Type of Experience */}
        <div className='space-y-2'>
          <Label className="text-lg font-semibold">Type of Experience</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {[
              'Romantic / Honeymoon',
              'Adventure',
              'Cultural',
              'Relaxation',
              'Family-Friendly Activities',
              'others',
            ].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={formData.experienceTypes.includes(type)}
                  onCheckedChange={() => handleCheckboxChange('experienceTypes', type)}
                />
                <Label htmlFor={type}>{type}</Label>
              </div>
            ))}
          </div>
  
          {/* Show input for "other" experience */}
          {formData.experienceTypes.includes('others') && (
            <div className="mt-4">
              <Label htmlFor="otherExperience">Specify Other Experience</Label>
              <Input
                variant="orange"
                id="otherExperience"
                name="otherExperience"
                value={getCustomExperience()}
                onChange={(e) => handleOtherExperienceChange(e.target.value)}
                placeholder="Enter your other experience"
                className="mt-1"
              />
            </div>
          )}
        </div>
  
        {/* Preferred Destinations */}
        <div className='space-y-2'>
          <Label className="text-lg font-semibold">Preferred Destinations</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {[
              'Marrakech', 'Fes', 'Chefchaouen', 'Sahara Desert', 'Casablanca',
              'Rabat', 'Essaouira', 'Ouarzazate', 'Meknes', 'Tangier', 'Tetouan',
              'Agadir', 'Merzouga', 'other destination',
            ].map((destination) => (
              <div key={destination} className="flex items-center space-x-2">
                <Checkbox
                  id={destination}
                  checked={formData.destinations.includes(destination)}
                  onCheckedChange={() => handleCheckboxChange('destinations', destination)}
                />
                <Label htmlFor={destination}>{destination}</Label>
              </div>
            ))}
          </div>
  
          {/* Show input for "other" destination */}
          {formData.destinations.includes('other destination') && (
            <div className="mt-4">
              <Label htmlFor="otherDestination">Specify Other Destination</Label>
              <Input
                variant="orange"
                id="otherDestination"
                name="otherDestination"
                value={getCustomDestination()}
                onChange={(e) => handleOtherDestinationChange(e.target.value)}
                placeholder="Enter your other destination"
                className="mt-1"
              />
            </div>
          )}
        </div>
  
        {/* Preferred Accommodation Type */}
        <div className='space-y-2'>
          <Label className="text-lg font-semibold">Preferred Accommodation Type</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {[
              'Luxury Hotel',
              'Riad',
              'Desert Camp',
              'Budget Stay',
              'Boutique Hotel',
              'other',
            ].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={formData.accommodationType.includes(type)}
                  onCheckedChange={() => handleCheckboxChange('accommodationType', type)}
                />
                <Label htmlFor={type}>{type}</Label>
              </div>
            ))}
          </div>
  
          {/* Show input for "other" accommodation type */}
          {formData.accommodationType.includes('other') && (
            <div className="mt-4">
              <Label htmlFor="otherAccommodation">Specify Other Accommodation Type</Label>
              <Input
                variant="orange"
                id="otherAccommodation"
                name="otherAccommodation"
                value={getCustomAccommodation()}
                onChange={(e) => handleOtherAccommodationChange(e.target.value)}
                placeholder="Enter your other accommodation type"
                className="mt-1"
              />
            </div>
          )}
        </div>
      </div>
    );
  };
  const renderStep4 = () => {
    const handleOtherTransportationChange = (value) => {
      setFormData(prev => {
        const defaultModes = [
          'Private Driver & Car',
          'Shared Group Tour Bus',
          'Domestic Flights',
          'Train & Public Transport',
          'others'
        ];
        
        const filteredModes = prev.transportation.filter(item => 
          defaultModes.includes(item)
        );
        
        return {
          ...prev,
          transportation: [...filteredModes, value]
        };
      });
    };
  
    const handleCheckboxChange = (name, value) => {
      setFormData(prev => {
        // If unchecking, remove both the checkbox value and any custom value
        if (prev[name].includes(value)) {
          if (name === 'transportation') {
            const defaultModes = [
              'Private Driver & Car',
              'Shared Group Tour Bus',
              'Domestic Flights',
              'Train & Public Transport',
              'others'
            ];
            return {
              ...prev,
              [name]: prev[name].filter(item => defaultModes.includes(item) && item !== value)
            };
          }
          // For budget range, keep original behavior
          return {
            ...prev,
            [name]: prev[name].filter(item => item !== value)
          };
        }
        
        // If checking, just add the checkbox value
        return {
          ...prev,
          [name]: [...prev[name], value]
        };
      });
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    // Helper function to get custom transportation value
    const getCustomTransportation = () => {
      const defaultModes = [
        'Private Driver & Car',
        'Shared Group Tour Bus',
        'Domestic Flights',
        'Train & Public Transport',
        'others'
      ];
      
      return formData.transportation.find(item => 
        !defaultModes.includes(item)
      ) || '';
    };
  
    return (
      <div className="space-y-6">
        <div className='space-y-4'>
          <Label className="text-lg font-semibold">Budget Range</Label>
          <RadioGroup
            value={formData.budgetRange}
            onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2"
          >
            {['Economy (💲)', 'Mid-Range (💲💲)', 'Luxury (💲💲💲)'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <RadioGroupItem value={type} id={`accommodation-${type}`} />
                <Label htmlFor={`accommodation-${type}`}>{type}</Label>
              </div>
            ))}
          </RadioGroup>
           <div className="mt-4">
            <Label htmlFor="customBudget">Custom Budget (Optional)</Label>
            <Input
              variant='orange'
              id="customBudget"
              name="customBudget"
              value={formData.customBudget}
              onChange={handleInputChange}
              placeholder="Enter your specific budget"
              className="mt-1"
            />
          </div>
        </div>
  
        <div className='space-y-2'>
          <Label className="text-lg font-semibold">Preferred Mode of Transportation</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {[
              'Private Driver & Car',
              'Shared Group Tour Bus',
              'Domestic Flights',
              'Train & Public Transport',
              'others'
            ].map((mode) => (
              <div key={mode} className="flex items-center space-x-2">
                <Checkbox
                  id={mode}
                  checked={formData.transportation.includes(mode)}
                  onCheckedChange={() => handleCheckboxChange('transportation', mode)}
                />
                <Label htmlFor={mode}>{mode}</Label>
              </div>
            ))}
          </div>
  
          {/* Show input for "other" transportation */}
          {formData.transportation.includes('others') && (
            <div className="mt-4">
              <Label htmlFor="otherTransportation">Specify Other Transportation Mode</Label>
              <Input
                variant="orange"
                id="otherTransportation"
                name="otherTransportation"
                value={getCustomTransportation()}
                onChange={(e) => handleOtherTransportationChange(e.target.value)}
                placeholder="Enter your other transportation mode"
                className="mt-1"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStep5 = () => {
    const handleOtherDietaryPreferenceChange = (value) => {
      setFormData(prev => {
        const defaultPreferences = [
          'Vegetarian',
          'Vegan',
          'Halal',
          'Gluten-Free',
          'No Restrictions',
          'others'
        ];
        
        const filteredPreferences = prev.dietaryPreferences.filter(item => 
          defaultPreferences.includes(item)
        );
        
        return {
          ...prev,
          dietaryPreferences: [...filteredPreferences, value]
        };
      });
    };
  
    const handleOtherAdditionalServiceChange = (value) => {
      setFormData(prev => {
        const defaultServices = [
          'Private Guide',
          'Professional Photography',
          'Special Occasion',
          'Customized Itinerary Planning',
          'others'
        ];
        
        const filteredServices = prev.additionalServices.filter(item => 
          defaultServices.includes(item)
        );
        
        return {
          ...prev,
          additionalServices: [...filteredServices, value]
        };
      });
    };
  
    const handleOtherAdditionalActivityChange = (value) => {
      setFormData(prev => {
        const defaultActivities = [
          'Hiking',
          'Scuba Diving',
          'Cultural Tours',
          'Cooking Classes',
          'others'
        ];
        
        const filteredActivities = prev.additionalActivities.filter(item => 
          defaultActivities.includes(item)
        );
        
        return {
          ...prev,
          additionalActivities: [...filteredActivities, value]
        };
      });
    };
  
    const getCustomDietaryPreference = () => {
      const defaultPreferences = [
        'Vegetarian',
        'Vegan',
        'Halal',
        'Gluten-Free',
        'No Restrictions',
        'others'
      ];
      
      return formData.dietaryPreferences.find(item => 
        !defaultPreferences.includes(item)
      ) || '';
    };
  
    const getCustomAdditionalService = () => {
      const defaultServices = [
        'Private Guide',
        'Professional Photography',
        'Special Occasion',
        'Customized Itinerary Planning',
        'others'
      ];
      
      return formData.additionalServices.find(item => 
        !defaultServices.includes(item)
      ) || '';
    };
  
    const getCustomAdditionalActivity = () => {
      const defaultActivities = [
        'Hiking',
        'Scuba Diving',
        'Cultural Tours',
        'Cooking Classes',
        'others'
      ];
      
      return formData.additionalActivities.find(item => 
        !defaultActivities.includes(item)
      ) || '';
    };
  
    return (
      <div className="space-y-6">
        <div className='space-y-2'>
          <Label className="text-lg font-semibold">Dietary Preferences</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {[
              'Vegetarian',
              'Vegan',
              'Halal',
              'Gluten-Free',
              'No Restrictions',
              'others'
            ].map((pref) => (
              <div key={pref} className="flex items-center space-x-2">
                <Checkbox
                  id={pref}
                  checked={formData.dietaryPreferences.includes(pref)}
                  onCheckedChange={() => handleCheckboxChange('dietaryPreferences', pref)}
                />
                <Label htmlFor={pref}>{pref}</Label>
              </div>
            ))}
          </div>
  
          {/* Show input for "other" dietary preference */}
          {formData.dietaryPreferences.includes('others') && (
            <div className="mt-4">
              <Label htmlFor="otherDietaryPreference">Specify Other Dietary Preference</Label>
              <Input
                variant="orange"
                id="otherDietaryPreference"
                name="otherDietaryPreference"
                value={getCustomDietaryPreference()}
                onChange={(e) => handleOtherDietaryPreferenceChange(e.target.value)}
                placeholder="Enter your other dietary preference"
                className="mt-1"
              />
            </div>
          )}
        </div>
  
        <div className='space-y-2'>
          <Label className="text-lg font-semibold">Additional Services</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {[
              'Private Guide',
              'Professional Photography',
              'Special Occasion',
              'Customized Itinerary Planning',
              'others'
            ].map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={service}
                  checked={formData.additionalServices.includes(service)}
                  onCheckedChange={() => handleCheckboxChange('additionalServices', service)}
                />
                <Label htmlFor={service}>{service}</Label>
              </div>
            ))}
          </div>
  
          {/* Show input for "other" additional service */}
          {formData.additionalServices.includes('others') && (
            <div className="mt-4">
              <Label htmlFor="otherAdditionalService">Specify Other Additional Service</Label>
              <Input
                variant="orange"
                id="otherAdditionalService"
                name="otherAdditionalService"
                value={getCustomAdditionalService()}
                onChange={(e) => handleOtherAdditionalServiceChange(e.target.value)}
                placeholder="Enter your other additional service"
                className="mt-1"
              />
            </div>
          )}
        </div>
  
        {/* Additional Activities Section */}
        <div className='space-y-2'>
          <Label className="text-lg font-semibold">Additional Activities</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {[
              'Hiking',
              'Scuba Diving',
              'Cultural Tours',
              'Cooking Classes',
              'others'
            ].map((activity) => (
              <div key={activity} className="flex items-center space-x-2">
                <Checkbox
                  id={activity}
                  checked={formData.additionalActivities.includes(activity)}
                  onCheckedChange={() => handleCheckboxChange('additionalActivities', activity)}
                />
                <Label htmlFor={activity}>{activity}</Label>
              </div>
            ))}
          </div>
  
          {/* Show input for "other" additional activity */}
          {formData.additionalActivities.includes('others') && (
            <div className="mt-4">
              <Label htmlFor="otherAdditionalActivity">Specify Other Additional Activity</Label>
              <Input
                variant="orange"
                id="otherAdditionalActivity"
                name="otherAdditionalActivity"
                value={getCustomAdditionalActivity()}
                onChange={(e) => handleOtherAdditionalActivityChange(e.target.value)}
                placeholder="Enter your other additional activity"
                className="mt-1"
              />
            </div>
          )}
        </div>
  
        <div className='space-y-2'>
          <Label htmlFor="otherRequests">Other Requests or Special Requirements</Label>
          <Textarea variant='orange'
            id="otherRequests"
            name="otherRequests"
            value={formData.otherRequests}
            onChange={handleInputChange}
            className="mt-1"
            placeholder="Please share any other requests or requirements..."
            rows={4}
          />
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  const stepTitles = [
    'Personal Information',
    'Trip Details',
    'Travel Preferences',
    'Budget & Transportation',
    'Special Requests'
  ];

  return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-8">
      <ToastContainer /> {/* Add Toastify container */}
      <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-orange-800">
          Design Your Moroccan Adventure
        </CardTitle>
        <p className="text-orange-600 mt-2">
          Create your perfect Moroccan journey with our customized travel planner
        </p>
        
        {/* Progress Steps */}
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            {stepTitles.map((title, index) => (
              <div 
                key={index} 
                className={`flex-1 text-center ${
                  index < stepTitles.length - 1 ? 'border-r border-orange-200' : ''
                }`}
              >
                <span className={`text-sm font-medium ${
                  step === index + 1 ? 'text-orange-600' : 'text-gray-500'
                }`}>
                  {title}
                </span>
              </div>
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="relative pt-4">
            <div className="flex mb-2 items-center justify-between">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((step - 1) / (stepTitles.length - 1)) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              {stepTitles.map((_, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    step > index + 1
                      ? 'bg-orange-500 border-orange-500'
                      : step === index + 1
                      ? 'border-orange-500 bg-white'
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  {step > index + 1 && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Current Step Content */}
          <div className="transition-all duration-300">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className="bg-white hover:bg-orange-50 border-orange-200 text-orange-600 hover:text-orange-700"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous Step
            </Button>

            {step < stepTitles.length && (
              <Button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Next Step
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) }
            {(step == 5 &&
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Submit Your Travel Request
              </Button>
            )}
          </div>

          {/* Step Description */}
          <div className="text-center text-sm text-gray-500 mt-4">
            {step === 1 && "Let's start with your basic information"}
            {step === 2 && "Tell us about your travel group and dates"}
            {step === 3 && "Choose your preferred experiences and destinations"}
            {step === 4 && "Select your budget and transportation preferences"}
            {step === 5 && "Finally, let us know about any special requirements"}
          </div>
        </form>
      </CardContent>
    </Card>
    </div>
  );
};

export default PersonaliseTour;