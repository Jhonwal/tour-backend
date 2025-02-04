import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Globe, Calendar, DollarSign, CheckCircle, Printer, Plane, Clock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import useApi from '@/services/api';
import PendingAlert from './components/PendingAlert';
import DeclinedAlert from './components/DeclinedAlert';
import html2pdf from 'html2pdf.js';

export default function CheckBooking() {
    const [email, setEmail] = useState('');
    const [referenceCode, setReferenceCode] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const api = useApi();
    const printRef = useRef();

    const handleCheckBooking = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);

        try {
            const response = await api.post('/api/check-booking', {
                email,
                reference_code: referenceCode,
            });
            setResult(response.data.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('No booking found for the provided details.');
            } else if (err.message) {
                setError(`Error: ${err.message}`);
            } else {
                setError('An unknown error occurred.');
            }
        }
    };

    const handleGoBack = () => {
        setResult(null);
        setError('');
        setEmail('');
        setReferenceCode('');
        window.history.back();
    };

    const handleGeneratePDF = () => {
        const element = printRef.current;
        if (element) {
            const options = {
                margin: 0.5,
                filename: 'booking_receipt.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 3 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().from(element).set(options).save();
        }
    };

    // Back Button Component
    const BackButton = () => (
        <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-4 left-4 z-10"
        >
            <Button
                onClick={handleGoBack}
                variant="ghost"
                className="group flex items-center space-x-2 bg-white bg-opacity-50 hover:bg-white hover:bg-opacity-75 backdrop-blur-sm rounded-lg px-4 py-2 text-orange-700 hover:text-orange-800 transition-all duration-300 shadow-md hover:shadow-lg"
            >
                <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Go Back</span>
            </Button>
        </motion.div>
    );

    if (result) {
        if (result.status === 'pending') return (
            <div className="relative">
                <BackButton />
                <PendingAlert />
            </div>
        );
        if (result.status === 'canceled') return (
            <div className="relative">
                <BackButton />
                <DeclinedAlert />
            </div>
        );
    }

    if (!result) {
        return (
            <div className="relative h-screen overflow-hidden">
                <BackButton />
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-100 animate-gradient-x" />
                
                <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

                <div className="relative container mx-auto px-4 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-lg mx-auto"
                    >
                        <div className="backdrop-blur-lg bg-white bg-opacity-40 p-8 rounded-2xl shadow-2xl border border-white border-opacity-20">
                            <motion.h1 
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl font-bold mb-8 text-center text-orange-700"
                            >
                                Check Your Booking
                            </motion.h1>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded-lg"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <form onSubmit={handleCheckBooking} className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-2"
                                >
                                    <Label className="text-lg text-orange-800">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-orange-600" />
                                        <Input
                                            className="pl-10 h-12 bg-white bg-opacity-50 border-orange-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-2"
                                >
                                    <Label className="text-lg text-orange-800">Booking Reference Code</Label>
                                    <div className="relative">
                                        <CheckCircle className="absolute left-3 top-3 w-5 h-5 text-orange-600" />
                                        <Input
                                            className="pl-10 h-12 bg-white bg-opacity-50 border-orange-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                                            type="text"
                                            value={referenceCode}
                                            onChange={(e) => setReferenceCode(e.target.value)}
                                            required
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                                    >
                                        Check Booking
                                    </Button>
                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-screen overflow-hidden">
            <BackButton />
            <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-green-100 animate-gradient-x" />
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative max-w-4xl mx-auto max-h-[80vh] p-8 mt-12 overflow-y-auto"
            >
                <div className="backdrop-blur-lg bg-white bg-opacity-40 p-8 rounded-2xl shadow-2xl border border-white border-opacity-20">
                    <motion.h1
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-bold mb-6 text-center text-green-700"
                    >
                        Booking Details
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-green-700 text-lg font-medium text-center mb-8"
                    >
                        Your request has been successfully confirmed! <br />
                        Thank you for your trust. We are excited to assist you further.
                    </motion.p>

                    <div ref={printRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[
                            { icon: <User className="w-6 h-6 text-blue-600" />, label: 'Full Name', value: result.full_name },
                            { icon: <Mail className="w-6 h-6 text-red-600" />, label: 'Email', value: result.email },
                            { icon: <Phone className="w-6 h-6 text-green-600" />, label: 'Phone', value: result.phone },
                            { icon: <Globe className="w-6 h-6 text-yellow-600" />, label: 'Country', value: result.country },
                            { icon: <MapPin className="w-6 h-6 text-purple-600" />, label: 'Region', value: result.region },
                            { icon: <Calendar className="w-6 h-6 text-orange-600" />, label: 'Arrival Date', value: result.arrival_date },
                            { icon: <DollarSign className="w-6 h-6 text-teal-600" />, label: 'Total Price', value: `$${result.total_price}` },
                            { icon: <CheckCircle className="w-6 h-6 text-pink-600" />, label: 'Status', value: result.status },
                            { icon: <Plane className="w-6 h-6 text-indigo-600" />, label: 'Tour Name', value: result.tour.name },
                            { icon: <Clock className="w-6 h-6 text-cyan-600" />, label: 'Tour Duration', value: `${result.tour.duration} days` },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 backdrop-blur-lg bg-white bg-opacity-40 rounded-xl shadow-lg border border-white border-opacity-20 hover:transform hover:scale-105 transition-all duration-300"
                            >
                                <p className="font-semibold text-gray-700">{item.label}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    {item.icon}
                                    <p className="text-gray-800">{item.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 text-center"
                    >
                        <Button
                            onClick={handleGeneratePDF}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto transform hover:scale-105 transition-all duration-300"
                        >
                            <Printer className="w-5 h-5" />
                            <span>Print Receipt</span>
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}