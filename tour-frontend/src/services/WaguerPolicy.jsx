import React from 'react';
import {
  Shield,
  Info,
  Database,
  Settings,
  Lock,
  Users,
  Mail,
  Phone,
  MapPin,
  Cookie,
  Edit,
} from 'lucide-react';

const WaguerPolicy = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white font-mono text-gray-800 shadow-lg rounded-lg">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
        <Shield className="w-10 h-10 mr-3 text-blue-600" />
        Privacy Policy
      </h1>

      {/* Introduction Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2 text-blue-500" />
          Introduction
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Welcome to Sharming Morocco Tours. Your privacy is of the utmost importance to us. This Privacy Policy
          outlines how we collect, use, store, and protect the information that you provide when interacting
          with our services, including when you visit our website, make a booking, or communicate with us.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          By using our website and services, you consent to the practices described in this policy. If you do not
          agree with the terms of this policy, we advise you to refrain from using our website.
        </p>
      </section>

      {/* Information We Collect Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Database className="w-6 h-6 mr-2 text-purple-500" />
          Information We Collect
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          We collect the following types of information when you use our services:
        </p>
        <ul className="list-disc pl-5 text-gray-700 text-lg leading-relaxed">
          <li>
            <strong>Personal Information:</strong> When you make a booking or inquire about our services, we collect
            your name, email address, phone number, and other personal details you voluntarily provide.
          </li>
          <li>
            <strong>Usage Data:</strong> We collect information about how you use our website, including pages visited,
            time spent on the site, and interactions with various elements of the site.
          </li>
          <li>
            <strong>Device Information:</strong> We may collect details about the device you use to access our website,
            including your IP address, browser type, and operating system.
          </li>
          <li>
            <strong>Location Data:</strong> With your permission, we may collect your geographical location to tailor
            our services and provide location-based content or offers.
          </li>
        </ul>
        <p className="text-gray-700 text-lg leading-relaxed">
          Please note that we do not collect any payment information directly. Any payments made through our website
          are processed by trusted third-party payment providers, and we do not store sensitive financial information
          such as credit card numbers or bank details.
        </p>
      </section>

      {/* How We Use Your Information Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-green-500" />
          How We Use Your Information
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          The information we collect is used in various ways to improve your experience and provide our services:
        </p>
        <ul className="list-disc pl-5 text-gray-700 text-lg leading-relaxed">
          <li>
            <strong>To Provide Our Services:</strong> We use your information to process bookings, respond to inquiries,
            and ensure that you have a smooth experience with Sharming Morocco Tours.
          </li>
          <li>
            <strong>To Improve Our Website and Services:</strong> Usage data helps us analyze how our website is used,
            enabling us to improve its functionality and design.
          </li>
          <li>
            <strong>To Personalize Your Experience:</strong> We may use the information you provide to personalize your
            interactions with us, such as offering personalized recommendations based on your preferences.
          </li>
          <li>
            <strong>To Communicate With You:</strong> We may send you important updates regarding your bookings, as well as
            promotional offers, newsletters, or information about our new services. You can opt out of marketing
            communications at any time.
          </li>
          <li>
            <strong>For Legal and Regulatory Compliance:</strong> We may use your information to comply with legal obligations,
            resolve disputes, or enforce our Terms and Conditions.
          </li>
        </ul>
      </section>

      {/* How We Protect Your Information Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Lock className="w-6 h-6 mr-2 text-red-500" />
          How We Protect Your Information
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          At Sharming Morocco Tours, we are committed to safeguarding your personal information. We use a variety of
          security measures to ensure that your data is protected from unauthorized access, alteration, or disclosure.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          These measures include:
        </p>
        <ul className="list-disc pl-5 text-gray-700 text-lg leading-relaxed">
          <li>Encryption: We use encryption technologies to protect sensitive data transmitted over the internet.</li>
          <li>Access Controls: We limit access to your information to only those employees or third-party partners who need it to
            provide our services.</li>
          <li>Regular Audits: We regularly monitor and audit our systems to detect and address any vulnerabilities.</li>
        </ul>
        <p className="text-gray-700 text-lg leading-relaxed">
          However, no data transmission over the internet can be guaranteed 100% secure, and while we strive to protect
          your information, we cannot ensure its absolute security.
        </p>
      </section>

      {/* Third-Party Services Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-orange-500" />
          Third-Party Services
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          We may engage third-party services to assist in providing certain aspects of our services, such as payment
          processing, email marketing, or data analytics. These third-party services may have access to your information,
          but they are required to use it only to provide the services we have contracted them for, and they are not
          permitted to use your data for any other purpose.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          We ensure that our third-party partners are compliant with relevant data protection laws and have appropriate
          safeguards in place to protect your data.
        </p>
      </section>

      {/* Your Rights Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Edit className="w-6 h-6 mr-2 text-purple-500" />
          Your Rights
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          You have certain rights regarding your personal information, which include:
        </p>
        <ul className="list-disc pl-5 text-gray-700 text-lg leading-relaxed">
          <li><strong>Access:</strong> You can request a copy of the personal data we hold about you.</li>
          <li><strong>Correction:</strong> If any of your information is incorrect or incomplete, you have the right to request
            corrections.</li>
          <li><strong>Deletion:</strong> You can request that we delete your personal data, subject to certain legal exceptions.</li>
          <li><strong>Opt-out:</strong> You can opt-out of receiving marketing emails at any time by following the unsubscribe link in
            the email or by contacting us directly.</li>
        </ul>
        <p className="text-gray-700 text-lg leading-relaxed">
          To exercise these rights, please contact us using the information provided at the end of this Privacy Policy.
        </p>
      </section>

      {/* Cookies Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Cookie className="w-6 h-6 mr-2 text-yellow-500" />
          Cookies
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Our website may use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small
          text files placed on your device to help us remember your preferences, improve site functionality, and personalize
          content.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          You can control the use of cookies through your browser settings. However, disabling cookies may limit your ability
          to use certain features of our website.
        </p>
      </section>

      {/* Changes to This Privacy Policy Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Edit className="w-6 h-6 mr-2 text-blue-500" />
          Changes to This Privacy Policy
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal
          obligations. When we make changes, we will post the updated policy on this page and update the effective date.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          It is your responsibility to review this policy periodically to stay informed about how we are protecting your
          information.
        </p>
      </section>

      {/* Contact Us Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Mail className="w-6 h-6 mr-2 text-green-500" />
          Contact Us
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          If you have any questions, concerns, or requests regarding this Privacy Policy, or if you wish to exercise your rights,
          please contact us at:
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          Email: <a href="mailto:info@sharmingmoroccotours.com" className="text-blue-600 hover:underline">info@sharmingmoroccotours.com</a>
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">Phone: +1 (123) 456-7890</p>
        <p className="text-gray-700 text-lg leading-relaxed">Address: 1234 Travel Road, Wander City, Morocco</p>
      </section>
    </div>
  );
};

export default WaguerPolicy;