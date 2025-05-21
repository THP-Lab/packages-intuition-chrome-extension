import { Button, ButtonSize, ButtonVariant } from '@0xintuition/1ui'

import { useRevalidator } from '@remix-run/react'

interface RevalidateButtonProps {
  className?: string
}

export function RevalidateButton({ className }: RevalidateButtonProps) {
  const revalidator = useRevalidator()

  return (
    <Button
      variant={ButtonVariant.destructive}
      size={ButtonSize.md}
      onClick={() => revalidator.revalidate()}
      disabled={revalidator.state === 'loading'}
      className={className}
    >
      {revalidator.state === 'loading' ? 'Retrying...' : 'Retry'}
    </Button>
  )
}
