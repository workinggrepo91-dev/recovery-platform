// app/(client)/page.tsx
import Link from 'next/link';
import { 
  Shield, 
  ChevronRight, 
  Lock, 
  Search, 
  FileText, 
  CheckCircle, 
  Bitcoin, 
  Activity, 
  Users, 
  Star 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-600 fill-blue-600/10" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">ForensicsOS</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link href="#how-it-works" className="hover:text-blue-600 transition">Process</Link>
              <Link href="#reviews" className="hover:text-blue-600 transition">Success Stories</Link>
              <Link href="#about" className="hover:text-blue-600 transition">About Us</Link>
            </div>
            <Link 
              href="/apply" 
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-medium hover:bg-slate-800 transition shadow-lg shadow-blue-900/20"
            >
              Start Recovery
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative bg-slate-900 overflow-hidden">
        {/* Abstract Background Effects */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[100px] rounded-full translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-purple-600/10 blur-[100px] rounded-full -translate-x-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 md:pt-32 md:pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Authorized Forensic Agents
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                Recover Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Stolen Assets
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                We specialize in blockchain forensics and legal recovery of cryptocurrency lost to scams, hacks, and fraud. Don't let criminals get away with it.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/apply" 
                  className="inline-flex justify-center items-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition text-lg shadow-lg shadow-blue-600/25"
                >
                  Open A Case
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
                <div className="flex items-center gap-4 px-6 py-4 rounded-lg bg-slate-800/50 border border-slate-700">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-800 flex items-center justify-center text-[10px] text-white font-bold">
                        {String.fromCharCode(64+i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="text-white font-bold">1,400+ Cases</p>
                    <p className="text-slate-400">Successfully Solved</p>
                  </div>
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
                      <h3 className="text-white font-bold">Bitcoin Trace</h3>
                      <p className="text-slate-400 text-xs">Tracking ID: #882-X9</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                    FUNDS LOCATED
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-300 text-sm">
                    <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">1</div>
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-green-500"></div>
                    </div>
                    <span>Analysis</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300 text-sm">
                    <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">2</div>
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-blue-500"></div>
                    </div>
                    <span>Tracing</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300 text-sm">
                    <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">3</div>
                    <div className="flex-1 h-2 bg-slate-700 rounded-full"></div>
                    <span>Recovery</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700 flex justify-between items-center">
                   <div className="text-xs text-slate-500 font-mono">
                      Target Wallet: 0x71C...9A2
                   </div>
                   <Shield className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              
              {/* Decorative Elements behind card */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600 rounded-xl opacity-20 rotate-12 -z-10"></div>
              <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-purple-600 rounded-full opacity-20 blur-xl -z-10"></div>
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

      {/* --- ABOUT / HOW IT WORKS --- */}
      <div id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-blue-600 font-bold tracking-wide uppercase text-sm mb-3">Our Process</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How We Recover Your Funds</h3>
            <p className="text-slate-600 text-lg">We use advanced blockchain heuristics and legal frameworks to freeze and retrieve stolen assets.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-slate-100 -z-10 transform scale-x-75"></div>

            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">1. Submit Case</h4>
              <p className="text-slate-600">Fill out our secure intake form with transaction IDs and details of the theft.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center relative top-0 md:-top-8">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                <Search className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">2. Forensic Trace</h4>
              <p className="text-slate-600">Our analysts track the funds across blockchains to identify the destination wallet.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-3">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">3. Recovery</h4>
              <p className="text-slate-600">We coordinate with exchanges and law enforcement to freeze and return assets.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- TESTIMONIALS --- */}
      <div id="reviews" className="py-24 bg-slate-50 border-y border-slate-200">
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
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <p className="text-slate-600 italic mb-6">"I lost 2.5 BTC to a romance scam. I thought it was gone forever. ForensicsOS traced it to a Binance wallet and helped me file the police report correctly. I got 80% back!"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">JD</div>
                <div>
                  <p className="font-bold text-slate-900">James D.</p>
                  <p className="text-xs text-slate-500">Recovered $142,000</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
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
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
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

      {/* --- CTA FOOTER --- */}
      <div className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Don't Wait. Time is Critical.</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            The longer you wait, the harder it is to freeze stolen assets. Submit your case now for a free preliminary analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link 
              href="/apply" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition text-lg w-full sm:w-auto"
            >
              Start Recovery Now
            </Link>
            <Link 
              href="/track" 
              className="px-8 py-4 bg-transparent border border-slate-600 hover:bg-slate-800 text-white font-bold rounded-lg transition text-lg w-full sm:w-auto"
            >
              Track Existing Case
            </Link>
          </div>
          <p className="mt-8 text-sm text-slate-500">
            © 2026 ForensicsOS. All rights reserved. <br/>
            Secure Encryption • ISO 27001 Certified • Global Coverage
          </p>
        </div>
      </div>

    </div>
  );
}