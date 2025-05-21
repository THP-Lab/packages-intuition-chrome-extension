import { useTheme } from '@storybook/theming'
import { Toaster as Sonner, toast } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast bg-background-primary border-rounded border-primary/30 max-w-[420px] w-full',
          closeButton:
            'bg-primary text-primary-foreground hover:text-primary-foreground/50',
          info: 'bg-accent/100 text-accent-foreground',
          success: 'bg-success text-success-foreground',
          error: 'bg-destructive text-destructive-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
