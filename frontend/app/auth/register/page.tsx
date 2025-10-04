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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Create Account</CardTitle>
            <CardDescription>Join TaxPro Accounting to manage your finances</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm onSubmit={handleRegister} />
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
