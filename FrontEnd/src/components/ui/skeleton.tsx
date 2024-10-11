import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const skeletonVariants = cva('animate-pulse rounded-md', {
 variants: {
  variant: {
   default:
    'bg-gradient-to-tr border-1 border-gray-300 dark:border-gray-700 dark:from-black dark:to-gray-800 dark:text-white from-white to-slate-300',
  },
 },

 defaultVariants: {
  variant: 'default',
 },
})

export interface SkeletonProps
 extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, ...props }: SkeletonProps) {
 return <div className={cn(skeletonVariants({ variant }), className)} {...props} />
}

export { Skeleton, skeletonVariants }
