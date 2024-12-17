import Link from "next/link";

import { Feed, FeedItem } from "@prisma/client";
import { BookOpen, Bookmark, Calendar, Clock, ExternalLink, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ArticleCard = ({ article }: { article: FeedItem & { feed: Feed } }) => {
  const { id, title, author, pubDate, categories = [], description, link, isSaved, feed } = article;

  const formatDate = (dateString: Date) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="line-clamp-2 text-2xl font-bold">{title}</CardTitle>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span className="font-medium">By {author}</span>
              <span>•</span>
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {formatDate(pubDate)}
              </div>
            </div>
          </div>
        </div>
        {categories.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="capitalize">
                {typeof category === "string" ? category.toLowerCase().replace("_", " ") : ""}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {description && (
          <CardDescription className="line-clamp-3 whitespace-pre-line text-base">{description}</CardDescription>
        )}

        {feed && (
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <BookOpen className="mr-1 h-4 w-4" />
              <span>From: {feed.title || "Unknown Source"}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Bookmark className="mr-2 h-4 w-4" />
            {isSaved ? "Saved" : "Save"}
          </Button>
          <Button variant="outline" size="sm" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Mark as Read
          </Button>
        </div>
        <div className="flex space-x-2">
          <Button variant="default" size="sm" className="flex items-center" asChild>
            <a href={link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Original Article
            </a>
          </Button>
          <Link href={`/articles/${id}`}>
            <Button variant="default" size="sm" className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
