import type {ButtonHTMLAttributes} from 'react';
import {cn} from '@/lib/utils';

/**
 * Button used inside interactive blog posts. Posts wire real JavaScript to
 * `onClick`, so this is just the consistent styling layer.
 */
export function BlogButton({className, ...props}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'my-2 inline-flex cursor-pointer items-center justify-center rounded-md border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-sm font-medium text-primary transition-colors hover:bg-primary/20 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      {...props}
    />
  );
}
