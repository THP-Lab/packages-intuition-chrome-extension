import { buttonVariants } from '@0xintuition/1ui'

import { cn } from '@lib/utils/misc'
import { NavLink, NavLinkProps } from '@remix-run/react'
import { type VariantProps } from 'class-variance-authority'

interface NavigationButtonProps
  extends NavLinkProps,
    VariantProps<typeof buttonVariants> {
  disabled?: boolean
}

const NavigationButton = ({
  variant,
  size,
  disabled,
  className,
  ...props
}: NavigationButtonProps) => {
  return (
    <NavLink
      aria-disabled={disabled}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export default NavigationButton
