"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  ThumbsUp, 
  User,
  Briefcase,
  TrendingUp,
  DollarSign,
  Building
} from "lucide-react";
import { CompanyReview } from "@/lib/company-data";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  review: CompanyReview;
  onHelpful?: (reviewId: string) => void;
}

export default function ReviewCard({ review, onHelpful }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <Card className="glassmorphic">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{review.userName}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  {review.position && (
                    <>
                      <span>{review.position}</span>
                      <span>•</span>
                    </>
                  )}
                  {review.workType && (
                    <>
                      <Badge variant="outline" className="text-xs capitalize">
                        {review.workType}
                      </Badge>
                      <span>•</span>
                    </>
                  )}
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
              <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                {review.rating}.0
              </span>
            </div>

            <h3 className="font-semibold text-base">{review.title}</h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Review Content */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {review.content}
        </p>

        {/* Detailed Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Work Environment</p>
              <div className="flex items-center space-x-1">
                {renderStars(review.workEnvironment)}
                <span className="text-xs font-medium ml-1">{review.workEnvironment}.0</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Compensation</p>
              <div className="flex items-center space-x-1">
                {renderStars(review.compensation)}
                <span className="text-xs font-medium ml-1">{review.compensation}.0</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Career Growth</p>
              <div className="flex items-center space-x-1">
                {renderStars(review.careerGrowth)}
                <span className="text-xs font-medium ml-1">{review.careerGrowth}.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pros and Cons */}
        {(review.pros.length > 0 || review.cons.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {review.pros.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-600">Pros</h4>
                <ul className="space-y-1">
                  {review.pros.map((pro, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                      <span className="text-green-500 mt-1">+</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {review.cons.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600">Cons</h4>
                <ul className="space-y-1">
                  {review.cons.map((con, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                      <span className="text-red-500 mt-1">-</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Helpful Button */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Was this review helpful?</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onHelpful?.(review.id)}
            className="text-xs"
          >
            <ThumbsUp className="w-3 h-3 mr-1" />
            Helpful ({review.helpful})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}