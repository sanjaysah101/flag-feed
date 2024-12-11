import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { LiveQuiz } from "@/components/learning/LiveQuiz";
import { Quiz } from "@/components/learning/Quiz";
import { getFeedItem } from "@/lib/services/feed.service";

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const article = await getFeedItem(params.id);
  if (!article) notFound();

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <article className="prose dark:prose-invert">
        <h1>{article.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: article.content ?? "" }} />
      </article>
      <div className="space-y-6">
        <Quiz articleId={article.id} userId={session.user.id} />
        <LiveQuiz articleId={article.id} userId={session.user.id} />
      </div>
    </div>
  );
}
