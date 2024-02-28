import * as React from "react"

import { cn } from "../../lib/utils"

const Card = React.forwardRef((props) => (
  <div
    ref={props.ref}
    className={cn(
      "rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50",
        props.className
    )}
    {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef((props) => (
  <div
    ref={props.ref}
    className={cn("flex flex-col space-y-1.5 p-6", props.className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef((props) => (
  <h3
    ref={props.ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", props.className)}
    {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef((props) => (
  <p
    ref={props.ref}
    className={cn("text-sm text-slate-500 dark:text-slate-400", props.className)}
    {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef((props) => (
  <div ref={props.ref} className={cn("p-6 pt-0", props.className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef((props) => (
  <div
    ref={props.ref}
    className={cn("flex items-center p-6 pt-0", props.className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
