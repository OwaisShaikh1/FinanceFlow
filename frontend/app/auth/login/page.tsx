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
    setMessage("...logging in");
    console.log("Login data:", formData);

    try {
      const res = await fetch(`${BASE_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">TaxPro Accounting</CardTitle>
            <CardDescription>Sign in to your accounting dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSubmit={handleLogin} />
            {message && <p className="mt-4 text-center text-sm">{message}</p>}
          </CardContent>
          <div onClick={() => router.push("/auth/register")} className="cursor-pointer text-center text-sm text-muted-foreground hover:underline">
            Don't have an account? Sign up
          </div>
        </Card>
      </div>
    </div>
  );
}
