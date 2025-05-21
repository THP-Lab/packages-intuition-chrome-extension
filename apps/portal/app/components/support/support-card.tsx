import {
  cn,
  Icon,
  IconNameType,
  Text,
  TextVariant,
  TextWeight,
} from '@0xintuition/1ui'

import { Link } from '@remix-run/react'

interface SupportCardProps {
  icon?: IconNameType
  title: string
  description?: string
  link?: string
  className?: string
}

export function SupportCard({
  icon,
  title,
  description,
  link,
  className,
}: SupportCardProps) {
  return (
    <Link
      to={link ?? '#'}
      target="_blank"
      className={cn(
        `flex flex-col w-full theme-border rounded-lg p-6 gap-6`,
        className,
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {icon && <Icon name={icon} className="text-primary" />}
        <Text variant={TextVariant.bodyLarge} weight={TextWeight.medium}>
          {title}
        </Text>
      </div>
      {description && (
        <Text className="text-secondary-foreground">{description}</Text>
      )}
    </Link>
  )
}

interface SupportCardGridProps {
  supportCards: SupportCardProps[]
}

export function SupportCardGrid({ supportCards }: SupportCardGridProps) {
  return (
    <div className="flex flex-col gap-6">
      <Text
        variant={TextVariant.headline}
        weight={TextWeight.medium}
        className="text-primary/90"
      >
        Support
      </Text>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportCards.map((card, index) => (
          <SupportCard key={index} {...card} />
        ))}
      </div>
    </div>
  )
}
