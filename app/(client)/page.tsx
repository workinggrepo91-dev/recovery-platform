// app/(client)/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, 
  Search, 
  CheckCircle, 
  Bitcoin, 
  Shield,
  Star,
  Globe,
  Lock,
  Scale,
  Eye,
  Activity
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="GDFAS Logo" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="leading-tight">
                <span className="block text-sm md:text-lg font-bold text-slate-900 tracking-tight">
                  Global Digital Forensic
                </span>
                <span className="block text-xs md:text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Asset Service
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link href="#mission" className="hover:text-blue-600 transition">Our Mission</Link>
              <Link href="#process" className="hover:text-blue-600 transition">Process</Link>
              <Link href="#reviews" className="hover:text-blue-600 transition">Reviews</Link>
            </div>

            {/* CTA Button */}
            <Link 
              href="/apply" 
              className="bg-slate-900 text-white px-4 md:px-6 py-2.5 rounded-full font-medium hover:bg-slate-800 transition shadow-lg shadow-blue-900/20 text-sm md:text-base"
            >
              Start Recovery
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative bg-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[100px] rounded-full translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-purple-600/10 blur-[100px] rounded-full -translate-x-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 md:pt-32 md:pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wide">
                <Globe className="w-3 h-3 animate-pulse" />
                Authorized UK Consumer Protection Body
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Restoring Trust & <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Recovering Assets
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                Have you suffered losses from cryptocurrency fraud, romance scams, or deceptive investment platforms? We provide a structured, lawful recovery process to help you pursue restitution.
              </p>
              
              {/* ✅ NEW: Button Group */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/apply" 
                  className="inline-flex justify-center items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition text-lg shadow-lg shadow-blue-600/25"
                >
                  Apply for Assessment
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
                
                {/* ✅ NEW: Track Case Button */}
                <Link 
                  href="/track" 
                  className="inline-flex justify-center items-center px-8 py-4 bg-transparent border border-slate-600 text-white font-bold rounded-lg hover:bg-slate-800 transition text-lg"
                >
                  Track Existing Case
                  <Activity className="w-5 h-5 ml-2" />
                </Link>
              </div>

              {/* Trust Badge (Moved below buttons) */}
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="text-sm">
                  <p className="text-white font-bold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    In Collaboration with
                  </p>
                  <p className="text-slate-400">FSCS & Global Regulators</p>
                </div>
              </div>

            </div>

            {/* Right Vector/Image Simulation */}
            <div className="relative hidden lg:block">
              <div className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl">
                <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                  <div className="flex items-center gap-3">
                    <Bitcoin className="w-10 h-10 text-orange-500 bg-orange-500/10 p-2 rounded-full" />
                    <div>
                      <h3 className="text-white font-bold">Forensic Asset Trace</h3>
                      <p className="text-slate-400 text-xs">Case Ref: #GDF-2026-X9</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full animate-pulse">
                    TRACKING ACTIVE
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-300 text-sm">
                    <div className="w-8 h-8 rounded bg-green-900/50 text-green-400 border border-green-800 flex items-center justify-center"><CheckCircle className="w-4 h-4"/></div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span>Evidence Review</span>
                        <span className="text-green-400">Complete</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-green-500"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300 text-sm">
                    <div className="w-8 h-8 rounded bg-blue-900/50 text-blue-400 border border-blue-800 flex items-center justify-center">2</div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span>Blockchain Analysis</span>
                        <span className="text-blue-400">In Progress</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-blue-500 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-4 flex gap-3 text-xs text-slate-500 border-t border-slate-800">
                  <span className="flex items-center gap-1"><Scale className="w-3 h-3"/> Legal Compliance</span>
                  <span className="flex items-center gap-1"><Lock className="w-3 h-3"/> 256-bit Encryption</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- STATS BAR --- */}
      <div className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-white mb-1">$50M+</p>
              <p className="text-slate-400 text-sm uppercase tracking-wider">Recovered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1">98%</p>
              <p className="text-slate-400 text-sm uppercase tracking-wider">Success Rate</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1">24/7</p>
              <p className="text-slate-400 text-sm uppercase tracking-wider">Support Team</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1">Global</p>
              <p className="text-slate-400 text-sm uppercase tracking-wider">Jurisdiction</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MISSION STATEMENT --- */}
      <div id="mission" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">Who We Are</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Independent Consumer Protection</h3>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            Global Digital Forensic Asset Service (GDFAS) operates as an independent UK-based consumer protection body established to safeguard consumers when authorized financial firms fail or become insolvent. 
          </p>
          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            Funded by the financial services industry, we provide compensation for qualifying losses—such as unrecovered deposits, failed investments, and protected financial products—at <span className="font-bold text-slate-900">no cost to consumers</span>.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700">
            <Shield className="w-5 h-5 text-blue-600" />
            Strategic Partner: Financial Services Compensation Scheme (FSCS)
          </div>
        </div>
      </div>

      {/* --- OUR COMMITMENT --- */}
      <div id="commitment" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900">Our Commitment to You</h3>
            <p className="text-slate-500 mt-4">We act with diligence, transparency, and public interest at heart.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Thorough Investigation</h4>
              <p className="text-sm text-slate-600">Deep forensic analysis and case evaluation to uncover the trail of assets.</p>
            </div>
            {/* 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Transparency</h4>
              <p className="text-sm text-slate-600">Clear communication and honest updates throughout the recovery process.</p>
            </div>
            {/* 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Global Compliance</h4>
              <p className="text-sm text-slate-600">Adherence to international financial protection principles and legal frameworks.</p>
            </div>
            {/* 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">Confidentiality</h4>
              <p className="text-sm text-slate-600">Your data and identity are protected by strict enterprise-grade security protocols.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- REVIEWS / SUCCESS STORIES --- */}
      <div id="reviews" className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Client Success Stories</h2>
              <p className="text-slate-600">Real results from real victims we've helped.</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <span className="font-bold text-slate-900">4.9/5 Average Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-slate-50 p-8 rounded-xl shadow-sm border border-slate-100">
              <p className="text-slate-600 italic mb-6">"I lost 2.5 BTC to a romance scam. GDFAS traced it to a Binance wallet and helped me file the police report correctly. I got 80% back!"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">JD</div>
                <div>
                  <p className="font-bold text-slate-900">James D.</p>
                  <p className="text-xs text-slate-500">Recovered $142,000</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-slate-50 p-8 rounded-xl shadow-sm border border-slate-100">
              <p className="text-slate-600 italic mb-6">"Professional and fast. They didn't promise magic, they explained the process clearly. The dashboard let me see exactly where my funds were moving."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">S</div>
                <div>
                  <p className="font-bold text-slate-900">Sarah L.</p>
                  <p className="text-xs text-slate-500">Recovered $45,000 (USDT)</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-slate-50 p-8 rounded-xl shadow-sm border border-slate-100">
              <p className="text-slate-600 italic mb-6">"My Metamask was drained. Their automated tracker found the hacker's exchange account within 24 hours. Incredible technology."</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">M</div>
                <div>
                  <p className="font-bold text-slate-900">Michael R.</p>
                  <p className="text-xs text-slate-500">Recovered 15 ETH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- NEXT STEPS / PROCESS --- */}
      <div id="process" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">Next Steps</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Start Your Recovery</h3>
              <p className="text-slate-600 text-lg mb-6">
                Applicants are encouraged to submit accurate documentation and provide full details of their loss to enable effective assessment. 
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Gather transaction IDs, chat logs, and deposit records.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Complete our secure intake form (approx 5 mins).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Our team evaluates eligibility and legal avenues.</span>
                </li>
              </ul>
              <Link 
                href="/apply" 
                className="inline-block bg-slate-900 text-white px-8 py-4 rounded-lg font-bold hover:bg-slate-800 transition shadow-xl shadow-slate-900/10"
              >
                Submit Your Claim
              </Link>
            </div>
            
            {/* Visual Box */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-4">We Cover:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Cryptocurrency Fraud', 'Romance Scams', 'Investment Deception', 'Grant/Loan Schemes', 'Phishing Attacks', 'Wallet Draining'].map((item, i) => (
                   <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CTA FOOTER --- */}
      <div className="bg-slate-900 text-white pt-20 pb-10 px-4">
        <div className="max-w-4xl mx-auto text-center border-b border-slate-800 pb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">We Are Here To Help.</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Our mission is to restore trust, provide clarity, and pursue every legitimate avenue available to help affected individuals seek financial redress responsibly and ethically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link 
              href="/apply" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition text-lg w-full sm:w-auto"
            >
              Start Free Assessment
            </Link>
            <Link 
              href="/track" 
              className="px-8 py-4 bg-transparent border border-slate-600 hover:bg-slate-800 text-white font-bold rounded-lg transition text-lg w-full sm:w-auto"
            >
              Track Existing Case
            </Link>
          </div>
        </div>

        {/* --- DISCLAIMER --- */}
        <div className="max-w-5xl mx-auto mt-12 text-xs text-slate-500 space-y-4 text-justify">
          <p className="font-bold uppercase tracking-wide text-slate-400">Important Notice & Disclaimer</p>
          <p>
            Recovery outcomes are subject to eligibility, regulatory scope, available evidence, and the specific circumstances of each case. Submission of an application does not guarantee recovery or compensation. We do not provide legal advice, and all actions are conducted within applicable regulatory and legal frameworks.
          </p>
          <p>
            © 2026 Global Digital Forensic Asset Service (GDFAS). All rights reserved. GDFAS oversees banks, insurance companies, investment providers, and pension firms to ensure customers are not left financially vulnerable due to institutional failure or misconduct.
          </p>
        </div>
      </div>

    </div>
  );
}