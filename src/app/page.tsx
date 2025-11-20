import { useUserStore } from "@/store/useUserStore";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary p-8 gap-8">
      <header className="text-center space-y-4">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-image-gradient-epic animate-pulse">
          JavaScript Master Quest
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          A plataforma gamificada definitiva para dominar JavaScript.
        </p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-bg-secondary p-6 rounded-xl border border-bg-tertiary hover:border-accent-primary transition-colors group">
          <h2 className="text-2xl font-bold text-accent-primary mb-2 group-hover:scale-105 transition-transform">
            Aprenda
          </h2>
          <p className="text-text-muted">
            Domine do básico ao avançado com lições interativas.
          </p>
        </div>

        <div className="bg-bg-secondary p-6 rounded-xl border border-bg-tertiary hover:border-accent-gold transition-colors group">
          <h2 className="text-2xl font-bold text-accent-gold mb-2 group-hover:scale-105 transition-transform">
            Conquiste
          </h2>
          <p className="text-text-muted">
            Ganhe XP, moedas e suba no ranking global.
          </p>
        </div>

        <div className="bg-bg-secondary p-6 rounded-xl border border-bg-tertiary hover:border-accent-secondary transition-colors group">
          <h2 className="text-2xl font-bold text-accent-secondary mb-2 group-hover:scale-105 transition-transform">
            Batalhe
          </h2>
          <p className="text-text-muted">
            Desafie amigos e chefes épicos em duelos de código.
          </p>
        </div>
      </main>

      <footer className="mt-12">
        <a
          href="/dashboard"
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-accent-primary font-mono rounded-lg hover:scale-105 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-pulse hover:animate-none"
        >
          <span className="mr-2">PRESS START</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </footer>
    </div>
  );
}
