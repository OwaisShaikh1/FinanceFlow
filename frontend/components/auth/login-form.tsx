"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LoginFormProps {
  onSubmit: (data: { loginMethod: "email" | "phone"; email?: string; password?: string; phone?: string; role: string }) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  // Use Auth Context for authentication state
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuth();
  
  // Local state management with useState
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  
  // useRef for form elements and DOM access
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const router = useRouter();

  // useEffect for component lifecycle and cleanup
  useEffect(() => {
    // Focus on email field when component mounts
    if (loginMethod === "email" && emailRef.current) {
      emailRef.current.focus();
    } else if (loginMethod === "phone" && phoneRef.current) {
      phoneRef.current.focus();
    }
  }, [loginMethod]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password, phone, error, clearError]);

  // useCallback to memoize event handlers (prevents unnecessary re-renders)
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (loginMethod === "email") {
        // Use Auth context login method
        await login(email, password);
        
        console.log("Login successful");
        
        // Redirect to dashboard
        router.push("/dashboard");
        
      } else if (loginMethod === "phone") {
        // Phone/OTP login - implement this later
        const formData = { loginMethod, phone, role };
        localStorage.setItem("loginData", JSON.stringify(formData));
        onSubmit(formData);
      }
    } catch (error) {
      console.error("Login error:", error);
      // Error is already handled by the auth context
    }
  }, [email, password, phone, role, loginMethod, router, onSubmit, login]);
    
  // useCallback for Google sign-in to prevent re-creation
  const signInWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      console.log("Firebase user data:", {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL
      });

      // Use Auth context loginWithGoogle method
      const data = await loginWithGoogle(firebaseUser);

      // Check if user needs onboarding (new user or incomplete profile)
      if (data.needsOnboarding) {
        localStorage.setItem("needsOnboarding", "true");
        console.log("User needs onboarding, redirecting to complete profile");
        router.push("/onboarding");
      } else {
        // Complete user → go to dashboard
        localStorage.setItem("showWelcome", data.isNewUser ? "true" : "false");
        console.log("User profile complete, redirecting to dashboard");
        router.push("/dashboard");
      }

    } catch (error) {
      console.error("Google sign-in error:", error);
      // Error is already handled by the auth context
    }
  }, [router, loginWithGoogle]);

  // useCallback for input change handlers
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  }, []);

  const handleRoleChange = useCallback((value: string) => {
    setRole(value);
  }, []);

  const handleLoginMethodChange = useCallback((value: "email" | "phone") => {
    setLoginMethod(value);
    // Clear previous inputs when switching methods
    if (value === "email") {
      setPhone("");
    } else {
      setEmail("");
      setPassword("");
    }
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // useMemo for computed values
  const isFormValid = useMemo(() => {
    if (loginMethod === "email") {
      return email.trim() && password.trim() && role;
    } else {
      return phone.trim() && role;
    }
  }, [email, password, phone, role, loginMethod]);

  const buttonText = useMemo(() => {
    if (isLoading) return "Processing...";
    if (loginMethod === "phone") return "Send OTP";
    return "Sign In";
  }, [isLoading, loginMethod]);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Login Method */}
      <div className="space-y-2">
        <Label htmlFor="loginMethod">Login Method</Label>
        <Select value={loginMethod} onValueChange={handleLoginMethodChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email & Password</SelectItem>
            <SelectItem value="phone">Phone & OTP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Email / Password */}
      {loginMethod === "email" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                value={email}
                onChange={handleEmailChange}
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                ref={passwordRef}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                value={password}
                onChange={handlePasswordChange}
                required
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              ref={phoneRef}
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              className="pl-10"
              value={phone}
              onChange={handlePhoneChange}
              required
              autoComplete="tel"
            />
          </div>
        </div>
      )}

      {/* Role Selector */}
      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={handleRoleChange} required>
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="CA">Chartered Accountant</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || !isFormValid}>
        {buttonText}
      </Button>

      <Button
  type="button"
  onClick={signInWithGoogle}
  variant="outline"
  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
>
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Sign in with Google
</Button>

      
    </form>
    
  );
}
