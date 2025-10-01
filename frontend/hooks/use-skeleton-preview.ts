"use client"

import { useEffect, useState } from "react"

// Returns true when URL has ?skeleton=1
export function useSkeletonPreview(): boolean {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    try {
      const params = new URL(window.location.href).searchParams
      setEnabled(params.get("skeleton") === "1")
    } catch {
      setEnabled(false)
    }
  }, [])
  return enabled
}
