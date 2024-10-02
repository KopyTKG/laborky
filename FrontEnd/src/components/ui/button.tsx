import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300',
 {
  variants: {
   variant: {
    default:
     'bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90',
    danger:
     'bg-red-500 text-neutral-50 shadow-sm hover:bg-red-600/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90',
    success:
     'bg-green-400 text-stone-900 shadow-sm hover:bg-green-500/90 dark:bg-green-900 dark:text-neutral-50 dark:hover:bg-green-900/90',
    outline:
     'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
    secondary:
     'bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    highlight:
     'rounded-full h-[3rem] aspect-square shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-sky-600 hover:bg-sky-500/60',
   },
   size: {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9',
   },
  },
  defaultVariants: {
   variant: 'default',
   size: 'default',
  },
 },
)

export interface ButtonProps
 extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
 asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
 },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
