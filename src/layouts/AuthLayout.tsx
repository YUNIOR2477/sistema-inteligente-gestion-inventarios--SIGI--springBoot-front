"use client";
import { Outlet } from "react-router-dom";
import { useTheme } from "@/components/shared/Theme-provider";
import { ModeToggle } from "@/components/shared/ModeToggle";

export default function AuthLayout() {
  const { theme } = useTheme();

  const isSystemTheme = theme === "system";

  return (
    <div
      className={`flex h-full min-h-screen flex-col items-center justify-center p-6 sm:p-10 md:p-10 relative ${isSystemTheme
          ? "bg-linear-to-br from-gray-800 via-gray-600 to-gray-800"
          : ""
        }`}
    >
      <div className={`absolute right-4 sm:right-8 top-4 sm:top-8 rounded-lg cursor-pointer`}>
        <ModeToggle />
      </div>

      <div className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl p-6 sm:p-8">
        <Outlet />
        <div className={`text-center text-sm text-primary mt-6`}>
          By continuing, you agree to our{" "}
          <a
            href="/auth/terms-of-service"
            className={`font-medium hover:underline ${isSystemTheme ? "text-green-400" : ""
              }`}
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/auth/privacy-policy"
            className={`font-medium hover:underline ${isSystemTheme ? "text-green-400" : ""
              }`}
          >
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}
