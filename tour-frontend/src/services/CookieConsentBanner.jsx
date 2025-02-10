import React from 'react';
import { useCookies } from 'react-cookie';
import { ShieldCheck, X } from 'lucide-react';

const CookieConsentBanner = () => {
    const [cookies, setCookie] = useCookies(['cookieConsent']);
    const dateExpire = new Date();
    dateExpire.setDate(dateExpire.getDate() + 60);

    const handleAcceptCookies = () => {
        setCookie('cookieConsent', 'true', { path: '/', expires: dateExpire });
    };

    const handleRejectCookies = () => {
        setCookie('cookieConsent', 'false', { path: '/', expires: dateExpire });
    };

    if (cookies.cookieConsent === undefined) {
        return (
            <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 bg-orange-50 rounded-lg shadow-xl border border-gray-200 p-6 z-50 animate-fade-in">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <ShieldCheck className="w-8 h-8 text-orange-500" />
                        </div>
                        
                        <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                We Value Your Privacy
                            </h3>
                            
                            <p className="text-gray-600 mb-4">
                                We use cookies to enhance your browsing experience, personalize content, and analyze our traffic. 
                                These cookies help us understand how you interact with our website and allow us to improve our services. 
                                You can choose to accept or decline these cookies.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <button
                                    onClick={handleAcceptCookies}
                                    className="inline-flex items-center justify-center px-6 py-2.5 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    Accept All Cookies
                                </button>
                                
                                <button
                                    onClick={handleRejectCookies}
                                    className="inline-flex items-center justify-center px-6 py-2.5 text-gray-700 bg-gray-100 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    Decline Optional Cookies
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

export default CookieConsentBanner;