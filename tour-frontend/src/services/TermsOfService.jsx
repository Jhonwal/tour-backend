import React from 'react';
import {
  BookOpen,
  Shield,
  UserCircle2,
  CheckCircle2,
  CalendarDays,
  XCircle,
  CreditCard,
  AlertTriangle,
  Edit,
  Mail,
} from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg font-mono">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
        <BookOpen className="w-10 h-10 mr-3 text-blue-600" />
        Terms of Service
      </h1>

      {/* Introduction Section */}
      <section className="mb-8">
        <p className="text-gray-700 text-lg leading-relaxed animate-fadeIn">
          Welcome to <strong className="text-blue-600">Charming Tours to Morocco</strong>! These Terms of Service (“Terms”) govern your use of our website, services, and offerings. By accessing or using our services, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please refrain from using our website or services. We encourage you to review these Terms regularly as they may change over time.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          These Terms apply to all visitors, users, and others who access or use our services. If you are accessing the site on behalf of a company or organization, you represent and warrant that you have the authority to bind such entity to these Terms.
        </p>
      </section>

      {/* General Terms Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-orange-500" />
          1. General Terms
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Charming Tours to Morocco provides travel-related services including tour bookings, transportation, accommodation, and guided tours across Morocco. By using our platform, you agree to these Terms as well as any additional rules or policies that may be posted on the website from time to time.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          We may update or modify these Terms periodically without notice. It is your responsibility to review these Terms regularly. Your continued use of our services constitutes acceptance of any modifications.
        </p>
      </section>

      {/* Account Responsibility Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <UserCircle2 className="w-6 h-6 mr-2 text-purple-500" />
          2. Account Responsibility
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          <strong>No user registration is required</strong> to use our services. You can book tours and access our services without creating an account.
        </p>
      </section>

      {/* Eligibility and Restrictions Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <CheckCircle2 className="w-6 h-6 mr-2 text-green-500" />
          3. Eligibility and Restrictions
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          To use our services, you must be at least 18 years of age. By using our services, you confirm that you meet this age requirement. If you are under 18, you may only use our services with the involvement of a parent or legal guardian.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          You agree not to use our services for any unlawful or prohibited activities, including, but not limited to, illegal activities, fraudulent practices, or any form of abuse. We may restrict or suspend access to our services for users who violate these Terms.
        </p>
      </section>

      {/* Booking and Reservation Policy Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <CalendarDays className="w-6 h-6 mr-2 text-yellow-500" />
          4. Booking and Reservation Policy
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          By making a booking on our website, you are entering into a binding contract with Charming Tours to Morocco and, in some cases, third-party service providers. You agree to provide accurate and complete information when making a reservation, including personal details.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          You acknowledge that all bookings are subject to availability, and we reserve the right to cancel or modify any booking if necessary. In the event of changes to your booking, we will make every effort to notify you as soon as possible.
        </p>
      </section>

      {/* Cancellation and Refund Policy Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <XCircle className="w-6 h-6 mr-2 text-red-500" />
          5. Cancellation and Refund Policy
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Cancellations must be made according to the policies of the service provider. The refund policy varies depending on the type of service booked. We encourage you to check the specific terms of the service at the time of booking.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          For bookings canceled within 7 days of the scheduled departure, a cancellation fee may apply. Cancellations made within 24 hours of departure are non-refundable. Some tours or activities may have different cancellation conditions, and we recommend reviewing those before confirming your booking.
        </p>
      </section>

      {/* Payment Policy Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <CreditCard className="w-6 h-6 mr-2 text-blue-500" />
          6. Payment Policy
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          <strong>All payments are made in cash</strong>. Our website does not process payments directly, and no online payment methods are available. Payments for tours, accommodations, and services will be settled directly with the service provider or our representatives.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          You acknowledge that payment terms and conditions may vary depending on the provider. It is your responsibility to ensure that the payment is made according to the service provider’s terms and in a timely manner to confirm your reservation.
        </p>
      </section>

      {/* User Conduct Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2 text-orange-500" />
          7. User Conduct
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          As a user of Charming Tours to Morocco, you agree to use our services in a respectful and responsible manner. You must not engage in any activity that disrupts, interferes with, or damages the functionality of our website or services.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          You are prohibited from attempting to gain unauthorized access to our systems, using our services for fraudulent purposes, or uploading harmful content to our platform.
        </p>
      </section>

      {/* Privacy Policy Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-green-500" />
          8. Privacy Policy
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Your privacy is important to us. By using our website, you agree to our Privacy Policy, which outlines how we collect, use, and protect your personal data. We take all reasonable steps to ensure your data is kept secure and confidential.
        </p>
      </section>

      {/* Disclaimer of Liability Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2 text-red-500" />
          9. Disclaimer of Liability
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Charming Tours to Morocco makes every effort to ensure the accuracy of the information presented on our website. However, we do not guarantee the accuracy, completeness, or timeliness of the information. We are not liable for any errors or omissions in the content provided.
        </p>
      </section>

      {/* Modifications to Terms Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <Edit className="w-6 h-6 mr-2 text-purple-500" />
          10. Modifications to Terms
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          We reserve the right to modify or update these Terms at any time. Any changes will be reflected on this page, and we will notify users of any significant changes through our website or via email. Please check these Terms regularly to stay informed of any updates.
        </p>
      </section>

      {/* Contact Us Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <Mail className="w-6 h-6 mr-2 text-blue-500" />
          11. Contact Us
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          If you have any questions or concerns about these Terms of Service, please feel free to reach out to us at <strong className="text-blue-600">cm2ours@gmail.com</strong>.
        </p>
      </section>

      {/* Acceptance Section */}
      <section>
        <p className="text-gray-700 text-lg leading-relaxed animate-fadeIn">
          By using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these Terms, you should discontinue the use of our services immediately.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;