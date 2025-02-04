import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { 
    Users, 
    MapPin, 
    BookOpenCheck, 
    Star, 
    TrendingUp, 
    Globe, 
    Loader
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import useApi from '@/services/api';
import { getToken } from '@/services/getToken';
import { Visitors } from './Visitors';
import UsersTable from './UserTable';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const api = useApi();
    const [visitorCountByMonth, setVisitorCountByMonth] = useState([]);
    const [currentMonthVisitorsByCountry, setCurrentMonthVisitorsByCountry] = useState([]);
    const [toursByType, setToursByType] = useState([]);
    const [keyMetrics, setKeyMetrics] = useState({
        totalTours: 0,
        totalBookings: 0,
        totalVisitors: 0,
        totalTestimonials: 0,
        totalTourTypes: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = getToken();
            const [
                visitorCountResponse,
                currentMonthVisitorsResponse,
                toursByTypeResponse,
                keyMetricsResponse,
            ] = await Promise.all([
                api.get('/api/admin/analytics/visitor-count-by-month', { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/api/admin/analytics/current-month-visitors-by-country', { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/api/admin/analytics/tours-by-type', { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/api/admin/analytics/key-metrics', { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            setVisitorCountByMonth(visitorCountResponse.data);
            setCurrentMonthVisitorsByCountry(currentMonthVisitorsResponse.data);
            setToursByType(toursByTypeResponse.data);
            setKeyMetrics(keyMetricsResponse.data);
        } catch (error) {
            console.error('Error fetching analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Define custom colors for each metric card
    const metricCards = [
        {
            icon: MapPin,
            title: 'Total Tours',
            value: keyMetrics.totalTours,
            gradient: 'from-blue-500 to-blue-700', // Blue gradient
            iconColor: 'text-blue-50', // Blue icon
            shadowColor:'hover:shadow-blue-500',
        },
        {
            icon: BookOpenCheck,
            title: 'Total Bookings',
            value: keyMetrics.totalBookings,
            gradient: 'from-green-500 to-green-700', // Green gradient
            iconColor: 'text-green-50', // Green icon
            shadowColor:'hover:shadow-green-500',
        },
        {
            icon: Users,
            title: 'Total Visitors',
            value: keyMetrics.totalVisitors,
            gradient: 'from-purple-500 to-purple-700', // Purple gradient
            iconColor: 'text-purple-50', // Purple icon
            shadowColor:'hover:shadow-purple-500',
        },
        {
            icon: Star,
            title: 'Total Testimonials',
            value: keyMetrics.totalTestimonials,
            gradient: 'from-yellow-500 to-yellow-700', // Yellow gradient
            iconColor: 'text-yellow-50', // Yellow icon
            shadowColor:'hover:shadow-yellow-500',
        },
        {
            icon: Globe,
            title: 'Tour Types',
            value: keyMetrics.totalTourTypes,
            gradient: 'from-pink-500 to-pink-700', // Pink gradient
            iconColor: 'text-pink-50', // Pink icon
            shadowColor:'hover:shadow-pink-500',
        },
    ];

    const chartCardStyles = "bg-orange-300 bg-opacity-15 shadow-lg rounded-xl border border-gray-100 hover:shadow-2xl transition-all duration-300";

    const visitorCountData = {
        labels: visitorCountByMonth.map((item) => `${item.year}-${item.month}`),
        datasets: [
            {
                label: 'Visitors',
                data: visitorCountByMonth.map((item) => item.total),
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const currentMonthVisitorsData = {
        labels: currentMonthVisitorsByCountry.map((item) => item.country),
        datasets: [
            {
                label: 'Visitors',
                data: currentMonthVisitorsByCountry.map((item) => item.total),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.6)',    // Blue
                    'rgba(16, 185, 129, 0.6)',    // Green
                    'rgba(245, 158, 11, 0.6)',    // Yellow
                    'rgba(239, 68, 68, 0.6)',     // Red
                    'rgba(139, 92, 246, 0.6)',    // Purple
                    'rgba(20, 184, 166, 0.6)',    // Teal
                    'rgba(249, 115, 22, 0.6)',    // Orange
                    'rgba(99, 102, 241, 0.6)',    // Indigo
                    'rgba(236, 72, 153, 0.6)',    // Pink
                    'rgba(6, 182, 212, 0.6)',     // Cyan
                    'rgba(131, 24, 67, 0.6)',     // Maroon
                    'rgba(5, 150, 105, 0.6)',     // Emerald
                    'rgba(217, 119, 6, 0.6)',     // Amber
                    'rgba(190, 18, 60, 0.6)',     // Crimson
                    'rgba(55, 65, 81, 0.6)'       // Gray
                ],
                borderWidth: 1,
            },
        ],
    };

    const toursByTypeData = {
        labels: toursByType
            .filter((item) => item.tourType)
            .map((item) => item.tourType.name),
        datasets: [
            {
                data: toursByType
                    .filter((item) => item.tourType)
                    .map((item) => item.total),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.6)',    // Blue
                    'rgba(16, 185, 129, 0.6)',    // Green
                    'rgba(245, 158, 11, 0.6)',    // Yellow
                    'rgba(239, 68, 68, 0.6)',     // Red
                    'rgba(139, 92, 246, 0.6)',    // Purple
                    'rgba(20, 184, 166, 0.6)',    // Teal
                    'rgba(249, 115, 22, 0.6)',    // Orange
                    'rgba(99, 102, 241, 0.6)',    // Indigo
                    'rgba(236, 72, 153, 0.6)',    // Pink
                    'rgba(6, 182, 212, 0.6)',     // Cyan
                    'rgba(131, 24, 67, 0.6)',     // Maroon
                    'rgba(5, 150, 105, 0.6)',     // Emerald
                    'rgba(217, 119, 6, 0.6)',     // Amber
                    'rgba(190, 18, 60, 0.6)',     // Crimson
                    'rgba(55, 65, 81, 0.6)'       // Gray
                ],
                hoverOffset: 4
            },
        ],
    };

    const pieOptions = {
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
        responsive: true,
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { 
                position: 'top',
                labels: {
                    font: {
                        family: 'Inter, sans-serif',
                        size: 12
                    }
                }
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(0,0,0,0.05)',
                },
                ticks: {
                    font: {
                        family: 'Inter, sans-serif'
                    }
                }
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-orange-800 flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                    Website Analytics
                </h1>
            </div>

            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {metricCards.map(({ icon: Icon, title, value, gradient, iconColor, shadowColor }) => (
                    <Card key={title} className={cn(`bg-gradient-to-r ${gradient} shadow-md ${shadowColor} hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1`, "p-4")}>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-sm text-gray-100 mb-2">{title}</CardTitle>
                                <p className="text-2xl font-bold text-gray-800">
                                    {loading ? <Loader className='animate-spin text-orange-500 mx-auto place-items-center place-content-center h-full' /> : value}
                                </p>
                            </div>
                            <Icon className={`w-6 h-6 ${iconColor} opacity-70`} />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Number of Tours by Type */}
                <Card className={cn(chartCardStyles, "p-4")}>
                    <CardHeader>
                        <CardTitle className="text-2xl text-center font-semibold leading-none tracking-tight text-gray-700">Tours by Type</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center items-center h-full">
                        {loading ? (
                            <Loader className="animate-spin text-orange-500 w-20 h-20" />
                        ) : (
                            <Pie data={toursByTypeData} options={pieOptions} />
                        )}
                    </CardContent>
                </Card>
                {/* Visitors Component */}
                <Visitors />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* Current Month's Visitor Count by Country */}
                <Card className={cn(chartCardStyles, "p-4")}>
                    <CardHeader>
                        <CardTitle className="text-2xl text-center font-semibold leading-none tracking-tight text-gray-700">Visitors by Country : Top 15 Countries</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        {loading ? <Loader className='animate-spin text-orange-500 w-20 mx-auto place-items-center place-content-center h-full' /> : <Bar data={currentMonthVisitorsData} options={chartOptions} />}
                    </CardContent>
                </Card>

                {/* Visitor Count by Month */}
                <Card className={cn(chartCardStyles, "p-4")}>
                    <CardHeader>
                        <CardTitle className="text-2xl text-center font-semibold leading-none tracking-tight text-gray-700">Visitor Count by Month</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        {loading ? <Loader className='animate-spin text-orange-500 w-20 mx-auto place-items-center place-content-center h-full' /> : <Line data={visitorCountData} options={chartOptions} />}
                    </CardContent>
                </Card>
            </div>
            <UsersTable/>
        </div>
    );
};

export default Analytics;