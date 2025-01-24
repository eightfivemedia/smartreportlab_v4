import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
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
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600">
                By accessing or using Smart Report Lab, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Permission is granted to temporarily access and use Smart Report Lab for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to decompile or reverse engineer any software</li>
                  <li>Remove any copyright or proprietary notations</li>
                  <li>Transfer the materials to another person</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>You are responsible for safeguarding your password</li>
                  <li>You agree not to disclose your password to any third party</li>
                  <li>You must notify us immediately upon becoming aware of any breach of security</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Service Availability and Support</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  We strive to provide uninterrupted service, but we do not guarantee that the service will be available at all times. We reserve the right to modify, suspend, or discontinue the service at any time without notice.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>We provide support during regular business hours</li>
                  <li>Response times may vary based on issue severity</li>
                  <li>Premium support is available for enterprise customers</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Payment Terms</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Some aspects of the Service may be provided for a fee. You agree to pay all fees in accordance with the pricing and payment terms presented to you for the Service.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Fees are non-refundable except as required by law</li>
                  <li>You are responsible for all applicable taxes</li>
                  <li>Subscription fees are billed in advance on a monthly basis</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Intellectual Property</h2>
              <p className="text-gray-600">
                The Service and its original content, features, and functionality are owned by Smart Report Lab and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-600">
                In no event shall Smart Report Lab, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Governing Law</h2>
              <p className="text-gray-600">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Smart Report Lab is established, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms, please contact us at{' '}
                <a href="mailto:legal@smartreportlab.com" className="text-brand-primary hover:text-brand-primary-dark">
                  legal@smartreportlab.com
                </a>
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

export default Terms;