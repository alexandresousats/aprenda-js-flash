import DashboardLayout from '@/components/layout/DashboardLayout'
import WorldMap from '@/components/map/WorldMap'

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="flex flex-col items-center gap-8">
                <div className="text-center space-y-4 mt-4">
                    <h1 className="text-4xl font-bold text-text-primary">Mapa de Aventura</h1>
                    <p className="text-text-secondary">Escolha seu próximo desafio</p>

                    <a href="/practice" className="inline-flex items-center gap-2 px-6 py-3 bg-bg-tertiary border border-accent-blue/30 rounded-xl hover:border-accent-blue transition-colors text-accent-blue font-bold">
                        🃏 Praticar Flash Cards
                    </a>
                </div>

                <WorldMap />
            </div>
        </DashboardLayout>
    )
}
