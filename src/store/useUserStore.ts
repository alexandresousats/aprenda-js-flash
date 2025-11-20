import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'

interface UserState {
    coins: number
    lives: number
    xp: number
    streak: number
    loading: boolean
    fetchProfile: () => Promise<void>
    addCoins: (amount: number) => void
    removeCoins: (amount: number) => void
    addXp: (amount: number) => void
    loseLife: () => void
    restoreLife: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
    coins: 0,
    lives: 5,
    xp: 0,
    streak: 0,
    loading: true,

    fetchProfile: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                set({ loading: false })
                return
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) throw error

            if (profile) {
                set({
                    coins: profile.coins,
                    lives: profile.lives,
                    xp: profile.xp,
                    streak: profile.streak,
                    loading: false
                })
            }
        } catch (error) {
            console.error('Error fetching profile:', error)
            set({ loading: false })
        }
    },

    addCoins: async (amount) => {
        const newAmount = get().coins + amount
        set({ coins: newAmount })
        // Optimistic update, then sync
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase.from('profiles').update({ coins: newAmount }).eq('id', user.id)
        }
    },

    removeCoins: async (amount) => {
        const newAmount = Math.max(0, get().coins - amount)
        set({ coins: newAmount })
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase.from('profiles').update({ coins: newAmount }).eq('id', user.id)
        }
    },

    addXp: async (amount) => {
        const newAmount = get().xp + amount
        set({ xp: newAmount })
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase.from('profiles').update({ xp: newAmount }).eq('id', user.id)
        }
    },

    loseLife: async () => {
        const newLives = Math.max(0, get().lives - 1)
        set({ lives: newLives })
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase.from('profiles').update({ lives: newLives }).eq('id', user.id)
        }
    },

    restoreLife: async () => {
        const newLives = Math.min(5, get().lives + 1)
        set({ lives: newLives })
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase.from('profiles').update({ lives: newLives }).eq('id', user.id)
        }
    },
}))
