import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import logoAplikacije from "../assets/images/logoAplikacije.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import type { User } from "../App";
import AuthBG from "../assets/images/BgPhoto.jpg";
import {
  login as loginApi,
  register as registerApi,
} from "../services/authApi";

interface AuthPageProps {
  onLogin: (user: User) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let user: User;

      if (authMode === "login") {
        user = await loginApi({ email, password });
      } else {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        user = await registerApi({ email, name, password });
      }

      onLogin(user);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${AuthBG})` }}
    >
      <div className="absolute inset-0 bg-background/50"></div>
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img
                    src={logoAplikacije}
                    alt="LearnConnect"
                    className="w-10 h-10 rounded-xl object-contain"
                  />
            <span className="text-2xl font-semibold text-white">
              LearnConnect
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white">
            Find Your Perfect{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunglow-300 to-sunglow-500">
              Tutor
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Connect with expert tutors or share your knowledge. Book lessons,
            chat in real-time, and accelerate your learning journey.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">100+</div>
              <div className="text-sm font-medium text-gray-400">
                Active Tutors
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm font-medium text-gray-400">Students</div>
            </div>
          </div>
        </div>

        <Card className="shadow-xl bg-gray2/30 border-gray-700/50 backdrop-blur-md pb-6">
          <CardHeader>
            <CardTitle className="text-sunglow-50">
              {authMode === "login" ? "Welcome Back" : "Get Started"}
            </CardTitle>
            <CardDescription className="text-sunglow-100/60">
              {authMode === "login"
                ? "Log in to your account to continue"
                : "Create an account to start learning or teaching"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={authMode}
              onValueChange={(v) => setAuthMode(v as "login" | "register")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 h-10">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-gray-800 data-[state=active]:to-gray-700 text-gray-100 data-[state=active]:text-white hover:bg-gray-800 data-[state=inactive]:hover:bg-gray-800 transition-all"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-gray-700 data-[state=active]:to-gray-800 text-gray-100 data-[state=active]:text-white hover:bg-gray-800 data-[state=inactive]:hover:bg-gray-800 transition-all"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-200">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 caret-white [&:-webkit-autofill]:bg-gray-900 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_rgb(17_24_39)_inset]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-200">
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 caret-white [&:-webkit-autofill]:bg-gray-900 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_rgb(17_24_39)_inset]"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-sunglow-400 to-sunglow-500 hover:from-sunglow-500 hover:to-sunglow-600 text-background font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-sunglow-500/20 transition-all"
                  >
                    {loading && authMode === "login"
                      ? "Logging in..."
                      : "Log In"}
                  </Button>
                  {error && (
                    <p className="text-sm text-red-400 text-center mt-2">
                      {error}
                    </p>
                  )}
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-gray-200">
                      Full Name
                    </Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 caret-white [&:-webkit-autofill]:bg-gray-900 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_rgb(17_24_39)_inset]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-200">
                      Email
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 caret-white [&:-webkit-autofill]:bg-gray-900 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_rgb(17_24_39)_inset]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="register-password"
                      className="text-gray-200"
                    >
                      Password
                    </Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 caret-white [&:-webkit-autofill]:bg-gray-900 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_rgb(17_24_39)_inset]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="register-confirm-password"
                      className="text-gray-200"
                    >
                      Repeat Password
                    </Label>
                    <Input
                      id="register-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-500 caret-white [&:-webkit-autofill]:bg-gray-900 [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[-webkit-text-fill-color:white] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_rgb(17_24_39)_inset]"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-sunglow-400 to-sunglow-500 hover:from-sunglow-500 hover:to-sunglow-600 text-background font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-sunglow-500/20 transition-all"
                  >
                    {loading && authMode === "register"
                      ? "Creating account..."
                      : "Create Account"}
                  </Button>
                  {error && (
                    <p className="text-sm text-red-400 text-center mt-2">
                      {error}
                    </p>
                  )}
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
