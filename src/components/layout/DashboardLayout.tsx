'use client'

import StatsBar from '@/components/dashboard/StatsBar'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
            }
        }
        checkAuth()
    }, [router])

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary pt-20 pb-10 px-4">
            <StatsBar />
            <main className="max-w-5xl mx-auto">
                {children}
            </main>
        </div>
    )
}
