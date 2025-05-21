import { useState } from 'react'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from 'components/HoverCard'
import { Icon } from 'components/Icon'
import { IdentityTag, IdentityTagSize } from 'components/IdentityTag'
import { ProfileCard } from 'components/ProfileCard'
import { Separator } from 'components/Separator'
import { Trunctacular } from 'components/Trunctacular'
import { Fragment } from 'react/jsx-runtime'
import { cn } from 'styles'
import { IdentityType } from 'types'

interface ClaimItemProps {
  variant?: IdentityType
  label: string
  imgSrc?: string | null
  id?: string | null
  description?: string | null
  ipfsLink?: string
  link?: string
  shouldHover?: boolean
  linkComponent?: React.ComponentType<{
    href: string
    onClick: (e: React.MouseEvent) => void
    children: React.ReactNode
  }>
}

export interface ClaimProps {
  size?: keyof typeof IdentityTagSize
  disabled?: boolean
  subject: ClaimItemProps
  predicate: ClaimItemProps
  object: ClaimItemProps
  orientation?: 'horizontal' | 'vertical'
  isClickable?: boolean
  maxIdentityLength?: number
  shouldHover?: boolean
  linkComponent?: React.ComponentType<{
    href: string
    onClick: (e: React.MouseEvent) => void
    children: React.ReactNode
  }>
  className?: string
}

export const Claim = ({
  subject,
  predicate,
  object,
  orientation = 'horizontal',
  disabled,
  size,
  isClickable,
  maxIdentityLength,
  shouldHover = true,
  className,
}: ClaimProps) => {
  const separatorWidth = size !== IdentityTagSize.default ? 'w-4' : 'w-2'
  const items = [subject, predicate, object]
  const [isFullClaimHovered, setIsFullClaimHovered] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const claimContent = (
    <div
      className={cn(
        'flex items-center w-full max-w-max relative max-sm:flex-col max-sm:m-auto transition-colors duration-200',
        orientation === 'vertical' ? 'flex-col items-start' : 'flex-row',
      )}
    >
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && (
            <Separator
              className={cn(
                'transition-colors duration-200',
                orientation === 'vertical'
                  ? 'w-px h-2 ml-2'
                  : `${separatorWidth} max-sm:w-px max-sm:h-2`,
                { 'bg-primary': isFullClaimHovered },
              )}
            />
          )}
          <div>
            <ClaimItem
              item={item}
              size={size}
              disabled={disabled}
              shouldHover={shouldHover}
              maxIdentityLength={maxIdentityLength}
              isHovered={isFullClaimHovered || hoveredIndex === index}
              onMouseEnter={() => {
                if (!isFullClaimHovered) {
                  setHoveredIndex(index)
                }
              }}
              onMouseLeave={() => {
                if (!isFullClaimHovered) {
                  setHoveredIndex(null)
                }
              }}
              className={className}
            />
          </div>
        </Fragment>
      ))}
      {isClickable && ( // Replace onClick check with isClickable
        <div
          className="pl-1"
          onMouseEnter={(e) => {
            e.stopPropagation()
            setIsFullClaimHovered(true)
            setHoveredIndex(null)
          }}
          onMouseLeave={(e) => {
            e.stopPropagation()
            setIsFullClaimHovered(false)
          }}
        >
          <Icon
            name={'arrow-up-right'}
            className={cn(
              'h-4 w-4 transition-colors duration-200',
              isFullClaimHovered ? 'text-primary' : 'text-secondary/50',
            )}
          />
        </div>
      )}
    </div>
  )

  return claimContent
}

const ClaimItem = ({
  item,
  size,
  disabled,
  shouldHover = true,
  maxIdentityLength,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  linkComponent: LinkComponent,
  className,
}: {
  item: ClaimItemProps
  link?: string
  size?: keyof typeof IdentityTagSize
  shouldHover?: boolean
  disabled?: boolean
  maxIdentityLength?: number
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  linkComponent?: React.ComponentType<{
    href: string
    onClick: (e: React.MouseEvent) => void
    children: React.ReactNode
  }>
  className?: string
}) => {
  const effectiveMaxLength = maxIdentityLength ?? 24

  const content = (
    <IdentityTag
      variant={item.variant}
      size={size}
      imgSrc={item.imgSrc}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'relative z-10 identity-tag transition-colors duration-200',
        {
          'border-primary bg-primary/10': isHovered,
          'border-theme': !isHovered,
        },
        className,
      )}
      shouldHover={shouldHover}
    >
      <Trunctacular
        value={item.label}
        disableTooltip={shouldHover}
        maxStringLength={effectiveMaxLength}
        className={cn(
          'relative z-10 identity-tag transition-colors duration-200 text-secondary/70',
          {
            'text-primary': isHovered,
            'text-secondary/70': !isHovered,
          },
        )}
      />
    </IdentityTag>
  )

  const linkProps = {
    href: item.link || '',
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    children: <span aria-label={`Link to ${item.label}`}>{content}</span>,
  }

  if (disabled || !shouldHover) {
    return item.link ? (
      LinkComponent ? (
        <LinkComponent {...linkProps} />
      ) : (
        <a {...linkProps}>
          <span>{content}</span>
        </a>
      )
    ) : (
      content
    )
  }

  return (
    <HoverCard openDelay={150} closeDelay={150}>
      <HoverCardTrigger asChild>
        {item.link ? (
          LinkComponent ? (
            <LinkComponent {...linkProps} />
          ) : (
            <a {...linkProps}>
              <span>{content}</span>
            </a>
          )
        ) : (
          content
        )}
      </HoverCardTrigger>
      <HoverCardContent
        side="bottom"
        className="w-full hover-card cursor-default"
        align="center"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex flex-col gap-4 w-80 max-md:max-w-fit">
          <ProfileCard
            variant={item.variant}
            avatarSrc={item.imgSrc ?? ''}
            name={item.label}
            id={item.id ?? ''}
            bio={item.description ?? ''}
            ipfsLink={item.ipfsLink}
          />
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
