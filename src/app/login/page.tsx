import AuthForm from '@/components/auth/AuthForm'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-image-gradient-epic text-center">
                    JavaScript Master Quest
                </h1>
                <p className="text-text-secondary mb-12 text-center">
                    Your journey to mastery begins here
                </p>

                <AuthForm />
            </div>
        </div>
    )
}
