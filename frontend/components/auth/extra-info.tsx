"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ExtraInfoForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const firebaseUser = JSON.parse(localStorage.getItem("firebaseUser") || "{}");

      const res = await fetch(`hhttp://localhost:5000/api/extra`
, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          phone,
          role,
          company,
        }),
      });

      if (res.ok) router.push("/dashboard");
      else console.error("Failed to save extra info");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} required />
      <input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
