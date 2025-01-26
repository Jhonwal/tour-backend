import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell 
} from 'recharts';
import { 
  Users, 
  MapPin, 
  BookOpenCheck, 
  Star, 
  Globe 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TourismAnalyticsDashboard = () => {
  const [visitorTrend, setVisitorTrend] = useState([]);
  const [visitorsByCountry, setVisitorsByCountry] = useState([]);
  const [tourTypes, setTourTypes] = useState([]);
  const [keyMetrics, setKeyMetrics] = useState({
    totalTours: 0,
    totalBookings: 0,
    totalVisitors: 0,
    totalTestimonials: 0,
    totalTourTypes: 0
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Visitor Trend
        const visitorTrendResponse = await axios.get('/api/analytics/visitors-by-month');
        const formattedVisitorTrend = visitorTrendResponse.data.map(item => ({
          month: `${item.year}-${item.month}`,
          visitors: item.total
        }));
        setVisitorTrend(formattedVisitorTrend);

        // Visitors by Country
        const visitorsByCountryResponse = await axios.get('/api/analytics/current-month-visitors');
        setVisitorsByCountry(visitorsByCountryResponse.data);

        // Tour Types
        const tourTypesResponse = await axios.get('/api/analytics/tours-by-type');
        const formattedTourTypes = tourTypesResponse.data.map(item => ({
          name: item.tourType.name,
          value: item.total
        }));
        setTourTypes(formattedTourTypes);

        // Key Metrics
        const keyMetricsResponse = await axios.get('/api/analytics/key-metrics');
        setKeyMetrics(keyMetricsResponse.data);

      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Tourism Website Analytics</h1>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Tours</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keyMetrics.totalTours}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Bookings</CardTitle>
            <BookOpenCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keyMetrics.totalBookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keyMetrics.totalVisitors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Testimonials</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keyMetrics.totalTestimonials}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Tour Types</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keyMetrics.totalTourTypes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Visitor Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Visitor Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={500} height={300} data={visitorTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="visitors" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </CardContent>
        </Card>

        {/* Current Month Visitors by Country */}
        <Card>
          <CardHeader>
            <CardTitle>Current Month Visitors by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart width={500} height={300} data={visitorsByCountry}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total">
                {visitorsByCountry.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </CardContent>
        </Card>

        {/* Tour Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Tour Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart width={500} height={300}>
              <Pie
                data={tourTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {tourTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TourismAnalyticsDashboard;