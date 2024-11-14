import { useCookies } from 'react-cookie';

const CookieConsentBanner = () => {
    const [cookies, setCookie] = useCookies(['cookieConsent']);
    const dateExpire = new Date();
    dateExpire.setDate(dateExpire.getDate() + 60);

    const handleAcceptCookies = () => {
        setCookie('cookieConsent', 'true', { path: '/', expires: dateExpire});
    };

    const handleRejectCookies = () => {
        setCookie('cookieConsent', 'false', { path: '/', expires: dateExpire});
    };

    // Display the consent banner if the cookieConsent cookie is not set
    if (cookies.cookieConsent === undefined) {
        return (
            <div className="fixed bottom-2 left-0 right-0 header-waguer text-white p-4 flex flex-col items-center justify-between shadow-lg z-50">
                <img src={`/images/waguer.png`} className={`w-32 h-32`}/>
                <p className="mb-3 text-sm">
                    We use cookies to improve your experience. Do you accept our cookie policy?
                </p>
                <div className="flex space-x-4">
                    <button
                        onClick={handleAcceptCookies}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                    >
                        Accept
                    </button>
                    <button
                        onClick={handleRejectCookies}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                    >
                        Reject
                    </button>
                </div>
            </div>
        );
    }

    return null; // Don't display the banner if the consent is already given
};

export default CookieConsentBanner;
