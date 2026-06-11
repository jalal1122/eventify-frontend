import Link from "next/link";

const FacebookIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);
const InstagramIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const TwitterIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);
const LinkedinIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#1F242E] text-gray-300 pt-16 mt-auto">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 px-8 pb-12 border-b border-[#374151]">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <Link href="/" className="flex items-center text-xl font-bold text-white">
            Eventify <span className="text-[#006782] ml-1">.</span>
          </Link>
          <p className="text-xs text-gray-400 mt-2">
            MEMBER SELECTION
          </p>
        </div>

        {/* Host Events */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold text-sm mb-2">Host Events</h4>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors w-fit">Create Your Brand</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors w-fit">Create Events with AI</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors w-fit">Event Creation Guidelines</Link>
        </div>

        {/* Discover Events */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold text-sm mb-2">Discover Events</h4>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors w-fit">Events For You</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors w-fit">Physical Events</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors w-fit">Top Cities Events</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors w-fit">Virtual Events</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors w-fit">Get Event Updates</Link>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold text-sm mb-2">Company</h4>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors w-fit">About</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors w-fit">Support</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors w-fit">Sponsor Services</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors w-fit">Privacy</Link>
          <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors w-fit">Contact Us</Link>
        </div>

        {/* Get in touch */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          <h4 className="text-white font-semibold text-sm mb-2">Get in touch</h4>
          <div className="flex items-center gap-2">
            <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors"><FacebookIcon /></a>
            <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors"><InstagramIcon /></a>
            <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors"><TwitterIcon /></a>
            <a href="#" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors"><LinkedinIcon /></a>
          </div>
        </div>

      </div>

      <div className="max-w-[1280px] mx-auto py-6 px-8 text-center">
        <p className="text-xs text-gray-500">
          © Copyright 2024. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
