import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const dividerVariants = cva('shrink-0', {
 variants: {
  variant: {
   default: 'bg-stone-400/50',
   ghost: 'bg-stone-600/40',
  },
  orientation: {
   horizontal: 'h-[1px] w-full',
   vertical: 'h-full w-[1px]',
  },
  margin: {
   default: 'm-auto',
   my2: 'my-2',
   my4: 'my-4',
  },
 },
 defaultVariants: {
  variant: 'default',
  orientation: 'horizontal',
  margin: 'default',
 },
})

export interface DividerProps
 extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof dividerVariants> {}

function Divider({ className, variant, orientation, margin, ...props }: DividerProps) {
 return (
  <div className={cn(dividerVariants({ variant, orientation, margin }), className)} {...props} />
 )
}

export { Divider, dividerVariants }
