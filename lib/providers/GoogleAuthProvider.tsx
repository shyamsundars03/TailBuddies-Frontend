"use client"

import { GoogleOAuthProvider } from "@react-oauth/google"
import { env } from "../config/env"
import type React from "react"

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <GoogleOAuthProvider clientId={env.googleClientId}>
            {children}
        </GoogleOAuthProvider>
    )
}
