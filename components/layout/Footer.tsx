import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1F242E] text-gray-300 py-16 px-8 mt-auto">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-[#374151] pb-12 mb-8">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">Nextt</span>
            <span className="text-xl font-bold text-[#006782]">Event</span>
          </Link>
          <p className="text-sm text-gray-400 max-w-xs">
            Discover, register, and experience the best local events happening in your city. Uncover your next unforgettable memory.
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>

        {/* Explore Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold mb-2">Explore</h4>
          <Link href="/discover" className="text-sm hover:text-white transition-colors w-fit">Discover Events</Link>
          <Link href="/categories" className="text-sm hover:text-white transition-colors w-fit">Browse Categories</Link>
          <Link href="/cities" className="text-sm hover:text-white transition-colors w-fit">Popular Cities</Link>
          <Link href="/trending" className="text-sm hover:text-white transition-colors w-fit">Trending Now</Link>
        </div>

        {/* Host Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold mb-2">Host with Nextt</h4>
          <Link href="/organizers/onboarding" className="text-sm hover:text-white transition-colors w-fit">Create an Event</Link>
          <Link href="/pricing" className="text-sm hover:text-white transition-colors w-fit">Pricing</Link>
          <Link href="/resources/organizer-guide" className="text-sm hover:text-white transition-colors w-fit">Organizer Guide</Link>
          <Link href="/auth/signin" className="text-sm hover:text-white transition-colors w-fit">Organizer Login</Link>
        </div>

        {/* Legal Links */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-semibold mb-2">Legal & Support</h4>
          <Link href="/terms" className="text-sm hover:text-white transition-colors w-fit">Terms of Service</Link>
          <Link href="/privacy" className="text-sm hover:text-white transition-colors w-fit">Privacy Policy</Link>
          <Link href="/support" className="text-sm hover:text-white transition-colors w-fit">Help Center</Link>
          <Link href="/contact" className="text-sm hover:text-white transition-colors w-fit">Contact Us</Link>
        </div>

      </div>

      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Nextt Event. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <select className="bg-transparent text-sm text-gray-400 border-none outline-none focus:ring-0 cursor-pointer">
            <option value="en">English (US)</option>
          </select>
        </div>
      </div>
    </footer>
  );
}
