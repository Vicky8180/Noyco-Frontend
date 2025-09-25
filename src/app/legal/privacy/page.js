"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect information you provide directly to us, such as when you:
      
      • Create or modify your account
      • Request customer support or contact us
      • Participate in surveys or promotions
      • Use our AI conversation services
      
      This may include your name, email address, phone number, and conversation data necessary to provide our AI services.`
    },
    {
      title: "2. How We Use Your Information",
      content: `We use the information we collect to:
      
      • Provide, maintain, and improve our services
      • Process transactions and send related information
      • Send technical notices and support messages
      • Respond to your comments and questions
      • Train and improve our AI models
      • Comply with legal obligations
      
      We do not sell, trade, or rent your personal information to third parties.`
    },
    {
      title: "3. Information Sharing and Disclosure",
      content: `We may share your information only in the following circumstances:
      
      • With your consent
      • To comply with legal obligations
      • To protect our rights and safety
      • In connection with a merger or acquisition
      • With service providers who assist us in operating our platform
      
      All service providers are bound by confidentiality agreements and data protection requirements.`
    },
    {
      title: "4. Data Security",
      content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
      
      • Encryption of data in transit and at rest
      • Regular security assessments
      • Access controls and authentication
      • Employee training on data protection
      
      However, no method of transmission over the Internet is 100% secure.`
    },
    {
      title: "5. AI and Machine Learning",
      content: `Our AI services process your conversation data to provide personalized responses and improve our models. We:
      
      • Use conversation data only to improve your experience
      • Anonymize data used for model training
      • Implement privacy-preserving techniques
      • Allow you to delete your conversation history
      
      You can opt out of data processing for model improvement in your account settings.`
    },
    {
      title: "6. Data Retention",
      content: `We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specifically:
      
      • Account information: Until you delete your account
      • Conversation data: As long as you maintain your account, unless deleted
      • Analytics data: Up to 2 years in anonymized form
      
      You can request deletion of your data at any time.`
    },
    {
      title: "7. Your Rights and Choices",
      content: `You have the right to:
      
      • Access your personal information
      • Correct inaccurate information
      • Delete your personal information
      • Restrict processing of your information
      • Data portability
      • Object to processing
      
      To exercise these rights, please contact us at privacy@noyco.com.`
    },
    {
      title: "8. International Data Transfers",
      content: `Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.`
    },
    {
      title: "9. Children's Privacy",
      content: `Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn that we have collected information from a child under 13, we will delete that information promptly.`
    },
    {
      title: "10. Changes to This Privacy Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.`
    },
    {
      title: "11. Contact Us",
      content: `If you have any questions about this Privacy Policy, please contact us at:
      
      Email: privacy@noyco.com
      Address: [Your Company Address]
      
      We will respond to your inquiries within 30 days.`
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
              Privacy Policy
            </h1>
            <p className="text-title-large font-mier text-gray-600 mb-8 max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center space-x-2 text-body font-mier text-gray-500">
              <span>Last updated:</span>
              <span className="font-medium">December 2024</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Content */}
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
