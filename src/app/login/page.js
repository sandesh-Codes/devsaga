"use client"

import { signIn } from "next-auth/react"

export default function Login(){
    return (
        <div className="space-y-4 p-8">
            <button 
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="border px-4 py-2"
            >
                Continue with Google
            </button>

            <button 
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="border px-4 py-2"
            >
                Continue with GitHub
            </button>
        </div>
    )
}