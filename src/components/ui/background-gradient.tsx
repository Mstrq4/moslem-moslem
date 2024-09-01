import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundGradient = ({
  children,
  className,
  ...props
}: React.HTMLProps<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative group/card",
        className
      )}
      {...props}
    >
      <div
        className="absolute -inset-px rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-75 blur-lg group-hover/card:opacity-100 transition duration-1000 group-hover:duration-200"
        aria-hidden="true"
      />
      <div className="relative w-full h-full bg-zinc-950 ring-1 ring-zinc-100/10 rounded-xl">
        {children}
      </div>
    </div>
  );
};