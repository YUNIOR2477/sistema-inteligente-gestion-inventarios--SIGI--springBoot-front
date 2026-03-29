import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/shared/Theme-provider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import login from "@/assets/images/login.jpg";
import { useAuthStore } from "@/store/useAuthStore";
import ToastMessage from "@/components/shared/ToastMessage";
import { useUserStore } from "@/store/useUserStore";
import type { ApiError } from "@/types/Response";

const LoginPage = () => {
  const navigate = useNavigate();
  const { handleLogin, isLoading } = useAuthStore();
  const { fetchCurrentUser } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleLogin({ email, password });
      const userData = await fetchCurrentUser();
      if (userData) {
        if (userData.data.role === "ROLE_ADMIN") navigate("/admin");
        if (userData.data.role === "ROLE_WAREHOUSE") navigate("/warehouse");
        if (userData.data.role === "ROLE_SELLER") navigate("/seller");
        if (userData.data.role === "ROLE_AUDITOR") navigate("/auditor");
        if (userData.data.role === "ROLE_DISPATCHER") navigate("/dispatcher");

        ToastMessage({
          type: "success",
          title: "Login successful🤝🎉",
          description: `Welcome ${userData.data.name}`,
        });
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      ToastMessage({
        type: "error",
        title: `${apiError.title}`,
        description: `${apiError.description}`,
      });
    }
  };

  const { theme } = useTheme();
  const isSystemTheme = theme === "system";
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl mt-2 border border-muted bg-primary-foreground/60 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
        <div className="hidden md:block h-full">
          <img
            src={login}
            alt="inventory"
            className=" object-cover rounded-lg opacity-90 max-h-125 w-full justify-center"
          />
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={handleLoginSubmit} className=" space-y-5">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-center text-foreground">
                Log in with your account
              </CardTitle>
              <p className="text-sm text-muted-foreground text-center">
                Welcome to{" "}
                <span
                  className={`font-medium ${isSystemTheme ? "text-green-400" : "text-primary"
                    } `}
                >
                  SIGI
                </span>{" "}
                — Intelligent Inventory Management System
              </p>
            </CardHeader>

            <CardContent className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email:</Label>
               <Input
                  id="email"
                  type="email"
                  placeholder="example@sigi.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password:</Label>
               <Input
                  id="password"
                  type="password"
                  placeholder="Min 8 characters"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 mt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full text-base text-primary-foreground cursor-pointer ${isSystemTheme
                  ? "bg-green-500 hover:bg-green-500/90 text-primary"
                  : ""
                  }`}
              >
                {isLoading ? "⏳ Loading..." : "🔓 log in"}
              </Button>
            </CardFooter>
          </form>
        </div>
      </div>
    </Card>
  );
};

export default LoginPage;
