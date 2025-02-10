import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Clock, MapPin, Calendar, Search, Filter, Gift } from 'lucide-react';
import TourDet from '../tour/TourDet';
import useApi from '@/services/api';

const Promotions = () => {
    const api = useApi();
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        minDiscount: '',
        maxDiscount: '',
        startDate: '',
    });
    
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const response = await api.get('/api/promotions/front');
            setPromotions(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const filteredPromotions = promotions.filter(promo => {
        const matchesSearch = promo.tours.some(tour => 
            tour.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            tour.depart_city.toLowerCase().includes(filters.search.toLowerCase())
        );
        const matchesDiscount = (!filters.minDiscount || promo.discount_value >= Number(filters.minDiscount)) &&
                               (!filters.maxDiscount || promo.discount_value <= Number(filters.maxDiscount));
        const matchesDate = !filters.startDate || new Date(promo.start_date) >= new Date(filters.startDate);
        
        return matchesSearch && matchesDiscount && matchesDate;
    });

    const SkeletonLoader = () => (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-6 bg-orange-50">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
            </div>
        </div>
    );

    if (loading) return (
        <div className="container mx-auto  py-4">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl shadow-lg">
                Special Offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => <SkeletonLoader key={i} />)}
            </div>
        </div>
    );

    if (error) return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-red-50 rounded-xl shadow-lg p-8 text-center">
                <div className="text-red-600 text-xl">Error: {error}</div>
                <Button 
                    className="mt-4 bg-red-500 hover:bg-red-600 text-white"
                    onClick={fetchPromotions}
                >
                    Try Again
                </Button>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl shadow-lg">
                Special Offers
            </h2>

            <div className="mb-8 bg-white p-6 rounded-xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Input
                        variant='orange'
                        type="number"
                        min='0'
                        step='0.2'
                        placeholder="Min discount %"
                        value={filters.minDiscount}
                        onChange={e => setFilters({...filters, minDiscount: e.target.value})}
                    />
                    <Input
                        variant='orange'
                        type="number"
                        min='0'
                        step='0.2'
                        placeholder="Max discount %"
                        value={filters.maxDiscount}
                        onChange={e => setFilters({...filters, maxDiscount: e.target.value})}
                    />
                    <Input
                        variant='orange'
                        type="date"
                        value={filters.startDate}
                        onChange={e => setFilters({...filters, startDate: e.target.value})}
                    />
                </div>
            </div>

            {filteredPromotions.length === 0 ? (
                <div className="bg-orange-50 rounded-xl shadow-lg p-12 text-center">
                    <Gift className="w-16 h-16 mx-auto mb-6 text-orange-500" />
                    <h3 className="text-2xl font-semibold text-orange-800 mb-4">
                        No Special Offers Available at the Moment
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                        We're currently preparing exciting new promotions for your next adventure. 
                        Please check back soon or sign up for our newsletter to be the first to know 
                        about upcoming special offers and discounts.
                    </p>
                    <Button 
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => setFilters({
                            search: '',
                            minDiscount: '',
                            maxDiscount: '',
                            startDate: ''
                        })}
                    >
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPromotions.map((promotion) => (
                        <div key={promotion.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-orange-500 text-white px-6 py-4">
                                <span className="font-bold text-xl">{promotion.discount_value}% OFF</span>
                                <span className="ml-4 text-sm">
                                    Until {new Date(promotion.end_date).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <div className="p-6">
                                {promotion.tours.map((tour, index) => (
                                    <div key={tour.id} className={`${index !== 0 ? 'border-t border-gray-200 pt-4 mt-4' : ''}`}>
                                        <div className="relative h-48 mb-4">
                                            <img
                                                src={hoveredId === `${promotion.id}-${tour.id}` ? tour.banner : tour.map_image}
                                                alt={tour.name}
                                                className="w-full h-full object-cover rounded-lg transition-all duration-500"
                                                onMouseEnter={() => setHoveredId(`${promotion.id}-${tour.id}`)}
                                                onMouseLeave={() => setHoveredId(null)}
                                            />
                                        </div>
                                        
                                        <div className="flex items-center gap-4 mb-2 text-gray-600 text-sm">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                <span>{tour.duration} days</span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                <span>{tour.depart_city}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold mb-2 text-orange-800">
                                            {tour.name}
                                        </h3>
                                        
                                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                                            {tour.description}
                                        </p>

                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                                                    View Details
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent side="left">
                                                <SheetHeader>
                                                    <SheetTitle className="text-2xl text-orange-800">
                                                        {tour.name}
                                                    </SheetTitle>
                                                </SheetHeader>
                                                <TourDet id={tour.id} />
                                                <SheetFooter />
                                            </SheetContent>
                                        </Sheet>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Promotions;