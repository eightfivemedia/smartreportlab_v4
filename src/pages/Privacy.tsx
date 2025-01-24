import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-primary mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                At Smart Report Lab, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">2.1 Personal Information</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Name and email address</li>
                  <li>Company information</li>
                  <li>Contact information</li>
                  <li>Billing information</li>
                </ul>

                <h3 className="text-lg font-medium">2.2 Usage Data</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Log data and analytics</li>
                  <li>Device information</li>
                  <li>Performance data</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To monitor the usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Data Storage and Security</h2>
              <p className="text-gray-600 mb-4">
                We use industry-standard security measures to protect your data. Your information is stored securely on Supabase's infrastructure, which employs encryption at rest and in transit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Your Data Rights</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Right to access your data</li>
                <li>Right to rectify your data</li>
                <li>Right to erase your data</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@smartreportlab.com" className="text-brand-primary hover:text-brand-primary-dark">
                  privacy@smartreportlab.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <div className="text-sm text-gray-500 pt-8">
              Last updated: January 21, 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;