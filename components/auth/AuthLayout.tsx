import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  type: "signin" | "signup" | "reset";
}

export function AuthLayout({ children, title, subtitle, type }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex w-full bg-white">
      {/* Left Column — Immersive Brand Image (Desktop) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#111827] flex-col justify-between overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0">
          <img
            src={type === "reset" ? "/reset-password-bg.png" : "/auth-event-image.png"}
            alt="Event crowd"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-auth-gradient" />
        </div>

        {/* Top Brand Logo */}
        <div className="relative z-10 p-12">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity w-fit">
            <ArrowLeft size={16} />
            <span className="text-sm font-semibold">Back to website</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 mt-8">
            <span className="text-3xl font-bold text-white">Nextt</span>
            <span className="text-3xl font-bold text-[#BAEAFF]">Event</span>
          </Link>
        </div>

        {/* Bottom Inspirational Text */}
        <div className="relative z-10 p-12 max-w-xl">
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            {type === "signup" && "Join the city's most vibrant community of event-goers and creators."}
            {type === "signin" && "Welcome back. Your next great experience is waiting."}
            {type === "reset" && "Regain access and don't miss out on upcoming events."}
          </h2>
          <p className="text-gray-300">
            Eventify brings the best local experiences directly to your fingertips.
          </p>
        </div>
      </div>

      {/* Right Column — Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-[448px] animate-fade-in">
          {/* Mobile Back Button & Logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit mb-6">
              <ArrowLeft size={16} />
              <span className="text-sm font-semibold">Back</span>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">Nextt</span>
              <span className="text-2xl font-bold text-[#006782]">Event</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{title}</h1>
            <p className="text-gray-500">{subtitle}</p>
          </div>

          {children}

        </div>
      </div>
    </div>
  );
}
