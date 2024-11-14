import {Facebook, Instagram, Linkedin} from "lucide-react";

export default function Footer() {
    return (
        <>
            <footer className={`w-full text-white flex flex-wrap gap-4 header-waguer bg-gray-900`}>
                {/* Logo Section */}
                <div className="w-full text-center p-4">
                    <img src={`/images/waguer.png`} className={`w-32 mx-auto grayscale hover:grayscale-0`} alt="Agency Logo" />
                </div>

                {/* Contact Information */}
                <div className="w-full md:w-1/4 p-4">
                    <h3 className="mb-4 font-semibold">Contact Us</h3>
                    <p className="mb-2">1234 Travel Road, Wander City</p>
                    <p className="mb-2">Phone: +1 (123) 456-7890</p>
                    <p>Email: info@travelagency.com</p>
                </div>

                {/* Popular Destinations */}
                <div className="w-full md:w-1/4  p-4">
                    <h3 className="mb-4 font-semibold">Popular Destinations</h3>
                    <ul className="space-y-2">
                        <li><a href="/destinations/europe" className="hover:underline">Europe</a></li>
                        <li><a href="/destinations/asia" className="hover:underline">Asia</a></li>
                        <li><a href="/destinations/africa" className="hover:underline">Africa</a></li>
                        <li><a href="/destinations/america" className="hover:underline">America</a></li>
                    </ul>
                </div>

                {/* Social Links */}
                <div className="w-full md:w-1/4 p-4">
                    <h3 className="mb-4 font-semibold">Follow Us</h3>
                    <div className="flex flex-col space-y-4">
                        <div className={`flex space-x-2`}>
                            <Facebook className={`fill-blue-500`}/>
                            <a href="https://facebook.com" className="hover:text-blue-500">Facebook</a>
                        </div>
                        <div className={`flex space-x-2`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 stroke-1 fill-white hover:fill-black stroke-black`} viewBox="0 0 24 24"><path d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z"/></svg>
                            <a href="https://twitter.com" className="hover:text-black">X</a>
                        </div>
                        <div className={`flex space-x-2`}>
                            <Instagram className={`fill-rose-500`}/>
                            <a href="https://instagram.com" className="hover:text-red-500">Instagram</a>
                        </div>
                        <div className={`flex space-x-2`}>
                            <Linkedin className={`fill-blue-900 stroke-1`}/>
                            <a href="https://linkedin.com" className="hover:text-blue-900">LinkedIn</a>
                        </div>
                    </div>
                </div>
                {/* Newsletter Subscription */}
                <div className="w-full md:w-1/4 text-center p-4">
                    <h3 className="mb-4 font-semibold">Subscribe to Our Newsletter</h3>
                    <form className="flex flex-col items-center">
                        <input type="email" placeholder="Enter your email" className="p-2 mb-4 text-black rounded"/>
                        <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-800 rounded text-white">Subscribe</button>
                    </form>
                </div>

                {/* Footer Bottom Section */}
                <div className="w-full text-center p-2 bg-gray-800 mt-4">
                    <p className="mb-2">&copy; 2024 CMT. All rights reserved.</p>
                    <div className="text-sm">
                        <a href="/privacy" className="hover:underline">Privacy Policy</a> |
                        <a href="/terms" className="hover:underline">Terms of Service</a>
                    </div>
                </div>

            </footer>
        </>
    );
}
