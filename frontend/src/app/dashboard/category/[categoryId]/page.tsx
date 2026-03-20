import { CategoryDetailPage } from "@/dashboard/CategoryDetailPage"

export default async function Page({ params }: { params: Promise<{ categoryId: string }> }) {
  // Await the route parameter for Next.js 15+ compatibility
  const resolvedParams = await params
  return <CategoryDetailPage categoryId={Number(resolvedParams.categoryId)} />
}
