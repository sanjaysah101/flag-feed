import { auth } from "@/auth";
import { getFeedItems } from "@/lib/services/feed.service";

import ArticleCard from "./ArticleCard";

const page = async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = session.user.id;
  const articles = await getFeedItems(userId);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};

export default page;
