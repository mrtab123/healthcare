'use client'

import { useClerk } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export const SignOutButton = () => {
  const { signOut } = useClerk()
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async  () => {
    setIsLoading(true)  // Show spinner when sign-out starts
  try {
    await signOut({ redirectUrl: '/sign-in' })
  } catch (error) {
    console.error('Error signing out:', error)
  } finally {
    setIsLoading(false)  // Hide spinner after sign-out is done (even if it fails)
  }
}

  return (
    // Clicking this button signs out a user
  
    <div className="flex justify-end">
    <button
      onClick={handleSignOut}
      className="px-4 py-2 rounded "
      disabled={isLoading}  // Disable button while loading
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        <>
          <LogOut className="inline-block mr-2" />
          Log out
        </>
      )}
    </button>
  </div>
  )
}