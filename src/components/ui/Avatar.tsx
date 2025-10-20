import { ImgHTMLAttributes, HTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

export const Avatar = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
};

export const AvatarImage = ({
  className,
  src,
  alt,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) => {
  const [error, setError] = useState(false);

  if (error || !src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export const AvatarFallback = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  );
};
