import { cn } from "@/lib/utils";
import { 
  Medal, 
  Star, 
  Trophy, 
  Crown,
  Target,
  Zap,
  Flame,
  Award
} from "lucide-react";

interface AchievementBadgeProps {
  type: "bronze" | "silver" | "gold" | "diamond";
  icon?: "medal" | "star" | "trophy" | "crown" | "target" | "zap" | "flame" | "award";
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  earned?: boolean;
  className?: string;
  animate?: boolean;
}

const AchievementBadge = ({
  type,
  icon = "medal",
  title,
  description,
  size = "md",
  earned = false,
  className,
  animate = false
}: AchievementBadgeProps) => {
  const icons = {
    medal: Medal,
    star: Star,
    trophy: Trophy,
    crown: Crown,
    target: Target,
    zap: Zap,
    flame: Flame,
    award: Award
  };

  const IconComponent = icons[icon];

  const typeStyles = {
    bronze: {
      bg: "bg-gamification-bronze/10",
      border: "border-gamification-bronze/30",
      icon: "text-gamification-bronze",
      glow: "shadow-[0_0_20px_hsl(var(--bronze)/0.3)]"
    },
    silver: {
      bg: "bg-gamification-silver/10",
      border: "border-gamification-silver/30", 
      icon: "text-gamification-silver",
      glow: "shadow-[0_0_20px_hsl(var(--silver)/0.3)]"
    },
    gold: {
      bg: "bg-gamification-gold/10",
      border: "border-gamification-gold/30",
      icon: "text-gamification-gold",
      glow: "shadow-[0_0_20px_hsl(var(--gold)/0.3)]"
    },
    diamond: {
      bg: "bg-gamification-diamond/10",
      border: "border-gamification-diamond/30",
      icon: "text-gamification-diamond",
      glow: "shadow-[0_0_20px_hsl(var(--diamond)/0.3)]"
    }
  };

  const sizeStyles = {
    sm: {
      container: "w-16 h-16",
      icon: "w-6 h-6",
      text: "text-xs"
    },
    md: {
      container: "w-20 h-20",
      icon: "w-8 h-8",
      text: "text-sm"
    },
    lg: {
      container: "w-24 h-24",
      icon: "w-10 h-10",
      text: "text-base"
    }
  };

  const currentTypeStyle = typeStyles[type];
  const currentSizeStyle = sizeStyles[size];

  return (
    <div 
      className={cn(
        "group relative flex flex-col items-center space-y-2 transition-all duration-300",
        className
      )}
    >
      {/* Badge Container */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full border-2 transition-all duration-300",
          currentSizeStyle.container,
          earned 
            ? cn(
                currentTypeStyle.bg,
                currentTypeStyle.border,
                "group-hover:scale-110",
                animate && "animate-achievement-pop",
                "group-hover:" + currentTypeStyle.glow
              )
            : "bg-muted/50 border-muted-foreground/20 grayscale opacity-50"
        )}
      >
        <IconComponent 
          className={cn(
            currentSizeStyle.icon,
            "transition-all duration-300",
            earned 
              ? cn(currentTypeStyle.icon, animate && "animate-float")
              : "text-muted-foreground"
          )}
        />
        
        {/* Glow effect when earned */}
        {earned && (
          <div 
            className={cn(
              "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              currentTypeStyle.glow
            )}
          />
        )}
      </div>

      {/* Title */}
      <div className="text-center space-y-1">
        <p className={cn(
          "font-medium transition-colors",
          currentSizeStyle.text,
          earned ? "text-foreground" : "text-muted-foreground"
        )}>
          {title}
        </p>
        
        {description && (
          <p className={cn(
            "text-muted-foreground line-clamp-2",
            size === "sm" ? "text-xs" : "text-xs"
          )}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default AchievementBadge;