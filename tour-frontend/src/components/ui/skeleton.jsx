import * as React from "react";
import { cn } from "@/lib/utils"; // Utility for conditional classes
import { ImageIcon } from "lucide-react";

const Skeleton = React.forwardRef(
    ({ className, showIcon = false, icon: Icon = ImageIcon, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "relative animate-pulse rounded-md bg-gray-400", // Base background color
                className
            )}
            {...props}
        >
            {/* Shimmer effect with height matching the outer div, moving from left to right */}
            {showIcon && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-orange-500 animate-pulse" />
                </div>
            )}
        </div>
    )
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
