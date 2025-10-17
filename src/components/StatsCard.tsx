import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: "default" | "primary" | "success" | "warning";
}

const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = "default"
}: StatsCardProps) => {
  const variantStyles = {
    default: {
      icon: "text-muted-foreground",
      bg: "bg-muted/5"
    },
    primary: {
      icon: "text-primary",
      bg: "bg-primary/5"
    },
    success: {
      icon: "text-success",
      bg: "bg-success/5"
    },
    warning: {
      icon: "text-warning",
      bg: "bg-warning/5"
    }
  };

  const currentVariant = variantStyles[variant];

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          currentVariant.bg
        )}>
          <Icon className={cn("h-4 w-4", currentVariant.icon)} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold">{value}</div>
          
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              <span className={cn(
                "mr-1",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? "↑" : "↓"}
              </span>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;