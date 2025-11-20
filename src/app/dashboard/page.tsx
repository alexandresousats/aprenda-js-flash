'use client'

import DashboardLayout from "@/components/layout/DashboardLayout";
import WorldMap from "@/components/map/WorldMap";
import { motion } from "framer-motion";

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-8"
            >
                <div className="text-center space-y-4 mt-4">
                    <motion.h1
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-bold text-text-primary"
                    >
                        Mapa de Aventura
                    </motion.h1>
                    <p className="text-text-secondary">Escolha seu próximo desafio</p>

                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="/practice"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-bg-tertiary border border-accent-blue/30 rounded-xl hover:border-accent-blue transition-colors text-accent-blue font-bold"
                    >
                        🃏 Praticar Flash Cards
                    </motion.a>
                </div>

                <WorldMap />
            </motion.div>
        </DashboardLayout>
    );
}
