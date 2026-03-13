// components/auth-guard.tsx
"use client"

import { AdminSidebarWrapper } from '@/components/admin-sidebar-wrapper'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null // or loading spinner
  }

  return <>
  <div className='flex'>
  <AdminSidebarWrapper/>
  <div className="w-full p-5">{children}</div>


  </div>
  </>
}