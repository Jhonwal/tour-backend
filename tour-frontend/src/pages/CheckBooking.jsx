import { useState, useRef } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Mail, Phone, MapPin, Globe, Calendar, DollarSign, CheckCircle, Printer, Plane, Clock } from 'lucide-react';
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
            console.log(response.data.data);            
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
            html2pdf()
                .from(element)
                .set(options)
                .save();
        } else {
            console.error('Element to print is not available');
        }
    };

    if (result) {
        if (result.status === 'pending') {
            return <PendingAlert />;
        } else if (result.status === 'canceled') {
            return <DeclinedAlert />;
        }
    }

    if (!result) {
        return (
            <div className="!bg-[url('/images/maroc_gate.webp')] min-h-[73vh] bg-fixed bg-cover bg-center p-8">
                <div className="max-w-lg mx-auto p-4 mt-12 border rounded shadow bg-white bg-opacity-75">
                    <h1 className="text-2xl font-bold mb-6 text-center text-orange-700">Check Your Booking</h1>
                    {error && (
                        <div className="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleCheckBooking} className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Email Address:</Label>
                            <Input
                                variant="orange"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Booking Reference Code:</Label>
                            <Input
                                variant="orange"
                                type="text"
                                value={referenceCode}
                                onChange={(e) => setReferenceCode(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" variant="waguer2">
                            Check Booking
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="!bg-[url('/images/maroc_gate.webp')] min-h-[73vh] bg-fixed bg-cover bg-center p-8">
            <div className="max-w-4xl mx-auto p-4 mt-12 border rounded shadow bg-white bg-opacity-75">
                <h1 className="text-2xl font-bold mb-6 text-center text-orange-700">Booking Details</h1>
                <p className="text-green-700 text-lg font-medium text-center mb-4">
                    Your request has been successfully confirmed! <br />
                    Thank you for your trust. We are excited to assist you further.
                </p>
                <div ref={printRef} className="grid grid-cols-4 gap-4">
                    {[ 
                        { icon: <User className="w-6 h-6 text-blue-600 hover:scale-110 transition-transform" />, label: 'Full Name', value: result.full_name },
                        { icon: <Mail className="w-6 h-6 text-red-600 hover:scale-110 transition-transform" />, label: 'Email', value: result.email },
                        { icon: <Phone className="w-6 h-6 text-green-600 hover:scale-110 transition-transform" />, label: 'Phone', value: result.phone },
                        { icon: <Globe className="w-6 h-6 text-yellow-600 hover:scale-110 transition-transform" />, label: 'Country', value: result.country },
                        { icon: <MapPin className="w-6 h-6 text-purple-600 hover:scale-110 transition-transform" />, label: 'Region', value: result.region },
                        { icon: <Calendar className="w-6 h-6 text-orange-600 hover:scale-110 transition-transform" />, label: 'Arrival Date', value: result.arrival_date },
                        { icon: <DollarSign className="w-6 h-6 text-teal-600 hover:scale-110 transition-transform" />, label: 'Total Price', value: `$${result.total_price}` },
                        { icon: <CheckCircle className="w-6 h-6 text-pink-600 hover:scale-110 transition-transform" />, label: 'Status', value: result.status },
                        { icon: <Plane className="w-6 h-6 text-teal-600 hover:scale-110 transition-transform" />, label: 'Tour Name', value: result.tour.name },
                        { icon: <Clock className="w-6 h-6 text-orange-600 hover:scale-110 transition-transform" />, label: 'Tour Duration', value: `${result.tour.duration} days` },
                    ].map((item, index) => (
                        <div key={index} className="p-4 bg-green-100 text-green-700 border border-green-400 rounded shadow">
                            <p className="font-semibold">{item.label}:</p>
                            <div className="flex items-center space-x-2 mt-1">
                                {item.icon}
                                <p>{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-8 text-center">
                    <Button onClick={handleGeneratePDF} variant="waguer2" className="flex items-center space-x-2">
                        <Printer className="w-5 h-5" />
                        <span>Print Receipt</span>
                    </Button>
                </div>
                <p className="text-sm text-green-500 mt-8 text-center w-full bg-white p-4">
                    If you have any questions, feel free to contact us.
                </p>
            </div>

            <div style={{ display: 'none' }}>
                <div ref={printRef} className="receipt-container">
                    <div className="logo">
                        <img src="/images/waguer.png" alt="Company Logo" className="w-32 mx-auto mb-4" />
                    </div>
                    <div className="header text-center text-2xl font-bold text-orange-700 mb-4">Booking Receipt Ref: {result.reference_code}</div>
                    <div className="subheader text-center text-lg text-gray-600 mb-6">Thank you for booking with us! Here are your details:</div>
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-orange-500 text-white place-items-center place-content-center">
                            <tr>
                                <th className="p-2 border border-gray-300">Detail</th>
                                <th className="p-2 border border-gray-300">Information</th>
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
                                { label: 'Total Price', value: `$${result.total_price}` },
                                { label: 'Status', value: result.status },
                            ].map((item) => (
                                <tr key={item.label}>
                                    <td className="p-2 border border-gray-300">{item.label}</td>
                                    <td className="p-2 border border-gray-300">{item.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
