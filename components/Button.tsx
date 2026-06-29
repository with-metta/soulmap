import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const base =
  "rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-sage text-white hover:bg-sage-dark",
  secondary: "border border-black/15 bg-transparent text-ink-soft hover:bg-black/4",
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
