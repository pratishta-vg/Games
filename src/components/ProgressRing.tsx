import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: "sm" | "md" | "lg";
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

const ProgressRing = ({ 
  progress, 
  size = "md", 
  strokeWidth, 
  className,
  children 
}: ProgressRingProps) => {
  const sizeMap = {
    sm: { diameter: 40, defaultStroke: 3 },
    md: { diameter: 80, defaultStroke: 4 },
    lg: { diameter: 120, defaultStroke: 6 }
  };

  const { diameter, defaultStroke } = sizeMap[size];
  const stroke = strokeWidth || defaultStroke;
  const radius = (diameter - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={diameter} height={diameter} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={stroke}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Center content */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center text-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProgressRing;