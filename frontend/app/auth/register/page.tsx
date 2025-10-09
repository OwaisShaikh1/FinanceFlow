"use client"
import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BASE_URL } from "@/hooks/storagehelper"
import { ca } from "date-fns/locale"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"

export default function RegisterPage() {
  const router = useRouter()
  const [message, setMessage] = useState("");

  const handleRegister = async (formdata: {
    firstName: string
    lastName: string
    email: string
    phone: string
    role: string
    company: string
    password: string
    confirmPassword?: string
  }) => {
    setMessage("...registering");

    // Create a new object excluding confirmPassword
    const payload = { ...formdata };
    delete payload.confirmPassword;

    console.log("Payload sent to API:", payload);

    try {
      const res = await fetch(`http://localhost:5000/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registered! Redirecting to login...");
        router.push("/auth/login");
      } else {
        setMessage("❌ " + (data.message || "Registration failed"));
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
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Create Account</CardTitle>
            <CardDescription className="text-slate-600 text-base">Join TaxPro to manage your finances</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm onSubmit={handleRegister} />
            {message && <p className="mt-4 text-center text-sm text-slate-600">{message}</p>}
            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
