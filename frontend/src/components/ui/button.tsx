import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-sans font-extrabold tracking-wide ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-[3px] border-[hsl(var(--ink))] bg-primary text-primary-foreground shadow-[0_4px_0_0_hsl(var(--ink))] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_hsl(var(--ink))] active:translate-y-[3px] active:shadow-[0_1px_0_0_hsl(var(--ink))]",
        destructive:
          "border-[3px] border-[hsl(var(--ink))] bg-destructive text-destructive-foreground shadow-[0_4px_0_0_hsl(var(--ink))] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_hsl(var(--ink))] active:translate-y-[3px] active:shadow-[0_1px_0_0_hsl(var(--ink))]",
        outline:
          "border-[3px] border-[hsl(var(--ink))] bg-card text-foreground shadow-[0_4px_0_0_hsl(var(--ink))] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_hsl(var(--ink))] hover:bg-muted active:translate-y-[3px] active:shadow-[0_1px_0_0_hsl(var(--ink))]",
        secondary:
          "border-[3px] border-[hsl(var(--ink))] bg-secondary text-secondary-foreground shadow-[0_4px_0_0_hsl(var(--ink))] hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_hsl(var(--ink))] active:translate-y-[3px] active:shadow-[0_1px_0_0_hsl(var(--ink))]",
        ghost: "text-foreground hover:bg-muted hover:text-foreground",
        link: "text-primary normal-case font-sans tracking-normal underline-offset-4 hover:underline",
        ai: "btn-ai rounded-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-12 px-8 text-base font-brawl uppercase",
        xl: "h-14 px-10 text-lg font-brawl uppercase",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
