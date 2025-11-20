import LessonPlayer from '@/components/lesson/LessonPlayer'

export default async function PlayPage({ params }: { params: Promise<{ levelId: string }> }) {
    const { levelId } = await params
    return <LessonPlayer levelId={parseInt(levelId)} />
}
