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
import waguer from '/images/waguer.png'; // Import your waguer image

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
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-blue-50 to-orange-100 animate-gradient-x" />
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative max-w-4xl mx-auto max-h-[80vh] p-8 mt-12 overflow-y-auto"
            >
                <div className="backdrop-blur-lg bg-white bg-opacity-40 p-8 rounded-2xl shadow-2xl border border-white border-opacity-20">
                    <motion.h1
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-3xl font-bold mb-6 text-center text-orange-700"
                    >
                        Booking Details
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-orange-700 text-lg font-medium text-center mb-8"
                    >
                        Your request has been successfully confirmed! <br />
                        Thank you for your trust. We are excited to assist you further.
                    </motion.p>

                    <div ref={printRef}>
                        {/* waguer and Header */}
                        <div className="text-center mb-8 space-y-2">
                            <img src={waguer} alt="Charming Morocco Tours waguer" className="w-32 h-32 mx-auto mb-4" />
                            <h1 className="text-3xl font-bold text-orange-700">Charming Morocco Tours</h1>
                            <p className="text-orange-700">Booking Reference: {result.reference_code}</p>
                        </div>

                        {/* Discount Card */}
                        {result.discount && result.discount > 0 && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mb-8 p-6 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl shadow-lg border border-yellow-300"
                            >
                                <div className="flex items-center space-x-4">
                                    <DollarSign className="w-8 h-8 text-yellow-700" />
                                    <div>
                                        <p className="text-lg font-semibold text-yellow-800">Discount Applied</p>
                                        <p className="text-yellow-700">-{result.discount} %</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Booking Details Table */}
                        <table className="w-full border-collapse backdrop-blur-lg bg-white bg-opacity-40 rounded-xl shadow-lg border border-white border-opacity-20">
                            <thead>
                                <tr className="bg-orange-50 bg-opacity-60">
                                    <th className="p-4 text-left text-orange-700">Field</th>
                                    <th className="p-4 text-left text-orange-700">Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { label: 'Full Name', value: result.full_name },
                                    { label: 'Email', value: result.email },
                                    { label: 'Phone', value: result.phone },
                                    { label: 'Country', value: result.country },
                                    { label: 'Region', value: result.region },
                                    { label: 'Arrival Date', value: result.arrival_date },
                                    {
                                        label: 'Total Price',
                                        value: (
                                          <>
                                            {result.discount > 0 ? (
                                              <div className="flex items-center space-x-4">
                                                <span className="text-red-500 line-through text-lg">${(result.total_price / (1 - result.discount / 100)).toFixed(2)}</span>
                                                <span className="text-green-500 text-xl font-semibold">${result.total_price}</span>
                                              </div>
                                            ) : (
                                              <span className="text-xl font-semibold">${result.total_price}</span>
                                            )}
                                          </>
                                        ),
                                    },
                                    { label: 'Status', value: result.status },
                                    { label: 'Tour Name', value: result.tour.name },
                                    { label: 'Tour Duration', value: `${result.tour.duration} days` },
                                ].map((item, index) => (
                                    <motion.tr
                                        key={index}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="hover:bg-orange-50 hover:bg-opacity-30 transition-all border-2 duration-300"
                                    >
                                        <td className="p-4 text-gray-700 font-semibold">{item.label}</td>
                                        <td className="p-4 text-gray-800">{item.value}</td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 text-center"
                    >
                        <Button
                            onClick={handleGeneratePDF}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto transform hover:scale-105 transition-all duration-300"
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