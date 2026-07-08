// app/(client)/privacy/page.tsx
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | Global Digital Forensic Asset Service',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
        
        <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-50 rounded-xl">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
            <p className="text-slate-500 mt-1">Last Updated: July 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p>
            Global Digital Forensic Asset Service ("GDFAS", "we", "our", or "us") is committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website or use our asset recovery services.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>We may collect personal identification information from you in various ways, including when you fill out an application form, track a case, or communicate with our agents. This includes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Details:</strong> Full name, date of birth, and nationality.</li>
            <li><strong>Contact Information:</strong> Email address, phone number, and physical address.</li>
            <li><strong>Financial & Case Data:</strong> Transaction histories, wallet addresses, loss amounts, and evidence of fraud required for forensic investigation.</li>
            <li><strong>Technical Data:</strong> IP addresses, browser types, and cookies used to secure our platform.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>The information we collect is strictly used to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Evaluate eligibility for financial recovery and restitution.</li>
            <li>Conduct blockchain forensics and trace stolen assets.</li>
            <li>Communicate updates regarding your case status.</li>
            <li>Comply with regulatory, legal, and law enforcement requests.</li>
            <li>Improve the security and functionality of our platform.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">3. Data Sharing and Collaboration</h2>
          <p>
            As an independent UK-based consumer protection body operating in collaboration with the Financial Services Compensation Scheme (FSCS) and global regulators, we may share necessary data with:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Law enforcement agencies and cybercrime divisions.</li>
            <li>Regulated cryptocurrency exchanges to freeze stolen assets.</li>
            <li>Legal partners strictly involved in your recovery process.</li>
          </ul>
          <p>We do <strong>not</strong> sell, trade, or rent your personal identification information to third-party marketers.</p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">4. Data Security</h2>
          <p>
            We implement enterprise-grade security protocols, including 256-bit SSL encryption, restricted access controls, and secure data storage environments to prevent unauthorized access, alteration, or destruction of your personal data.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">5. Cookies and Tracking</h2>
          <p>
            Our website utilizes cookies to enhance user experience and maintain secure sessions. You may choose to set your web browser to refuse cookies; however, some parts of the platform (like the tracking portal) may not function properly without them.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8 mb-4">6. Your Rights</h2>
          <p>Depending on your jurisdiction, you have the right to request access to, correction of, or deletion of your personal data held by us, subject to ongoing legal investigations and regulatory retention requirements.</p>
        </div>
      </div>
    </div>
  );
}