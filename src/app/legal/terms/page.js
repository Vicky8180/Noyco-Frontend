"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsOfService() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using Noyco's services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      title: "2. Use License",
      content: `Permission is granted to temporarily download one copy of Noyco's materials for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
      
      • Modify or copy the materials
      • Use the materials for any commercial purpose or for any public display
      • Attempt to reverse engineer any software contained on Noyco's platform
      • Remove any copyright or other proprietary notations from the materials`
    },
    {
      title: "3. Privacy and Data Protection",
      content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.`
    },
    {
      title: "4. User Accounts",
      content: `When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for maintaining the confidentiality of your account.`
    },
    {
      title: "5. Prohibited Uses",
      content: `You may not use our service:
      
      • For any unlawful purpose or to solicit others to perform unlawful acts
      • To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances
      • To infringe upon or violate our intellectual property rights or the intellectual property rights of others
      • To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
      • To submit false or misleading information`
    },
    {
      title: "6. Service Availability",
      content: `We strive to provide continuous service availability, but we do not guarantee that our service will be uninterrupted or error-free. We reserve the right to modify, suspend, or discontinue the service at any time without notice.`
    },
    {
      title: "7. Limitation of Liability",
      content: `In no event shall Noyco or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Noyco's materials.`
    },
    {
      title: "8. Governing Law",
      content: `These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which Noyco operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.`
    },
    {
      title: "9. Changes to Terms",
      content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.`
    },
    {
      title: "10. Contact Information",
      content: `If you have any questions about these Terms of Service, please contact us at legal@noyco.com`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
     

      {/* Hero Section */}
      <section className="pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-display-large font-mier text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-title-large font-mier text-gray-600 mb-8 max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our service.
            </p>
            <div className="flex items-center justify-center space-x-2 text-body font-mier text-gray-500">
              <span>Last updated:</span>
              <span className="font-medium">December 2024</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
          >
            <div className="p-8 lg:p-12">
              <div className="prose prose-lg max-w-none">
                {sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="mb-8"
                  >
                    <h2 className="text-headline font-mier text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <div className="text-body-large font-mier text-gray-700 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      
    </div>
  );
}
