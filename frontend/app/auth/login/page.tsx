"use client";
import React, { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/hooks/storagehelper";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleLogin = async (formData: any) => {
    setMessage("...Logging in");
    console.log("Login data:", formData);

    try {
       // Extract only the fields needed by the backend
       const loginPayload = {
         email: formData.email,
         password: formData.password
       };

       const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        //console.log("user:", localStorage.getItem("user"))
        setMessage("✅ Logged in! Redirecting...")
        router.push("/dashboard")
      } else {
        setMessage("❌ " + (data.message || "Login failed"))
      }
    } catch (err) {
      setMessage("⚠️ Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white border-blue-200 shadow-xl shadow-blue-100/50">
          <CardHeader className="text-center space-y-3">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TaxPro</CardTitle>
            <CardDescription className="text-slate-600 text-base">Sign in to your accounting dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSubmit={handleLogin} />
            {message && <p className="mt-4 text-center text-sm text-slate-600">{message}</p>}
          </CardContent>
          <div onClick={() => router.push("/auth/register")} className="cursor-pointer text-center text-sm text-blue-600 hover:text-blue-800 hover:underline pb-6">
            Don't have an account? <span className="font-medium">Sign up</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
