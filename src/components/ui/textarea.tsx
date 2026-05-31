import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          "border-input dark:bg-input/30 focus-visible:border-ring focus-visible:ring-0 aria-invalid:ring-0 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-lg border bg-card px-2.5 py-2 text-base transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
      />
    )
  }
)

export { Textarea }
