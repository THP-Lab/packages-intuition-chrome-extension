import { ReactNode } from 'react'

import {
  Button,
  ButtonVariant,
  Icon,
  IconName,
  IconNameType,
  Text,
  TextVariant,
  TextWeight,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@0xintuition/1ui'

export const InfoTooltip = ({
  title,
  content,
  icon,
  link,
  trigger,
}: {
  title: string
  content: string | ReactNode
  icon?: IconNameType
  link?: string
  trigger?: ReactNode
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger>
          {trigger ? (
            trigger
          ) : (
            <Icon
              name={IconName.circleQuestionMark}
              className="h-4 w-4 text-muted-foreground"
            />
          )}
        </TooltipTrigger>
        <TooltipContent className="w-64 p-2">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <Icon name={icon ?? IconName.circle} className="h-4 w-4" />
              <Text
                variant={TextVariant.body}
                weight={TextWeight.medium}
                className="text-secondary-foreground"
              >
                {title}
              </Text>
            </div>
            <Text
              variant={TextVariant.caption}
              className="text-secondary-foreground"
            >
              {content}
            </Text>
            {link && (
              <a href={link} target="_blank" rel="noreferrer noopener">
                <Button variant={ButtonVariant.ghost} className="w-fit mt-2">
                  <Text
                    variant={TextVariant.body}
                    weight={TextWeight.medium}
                    className="text-secondary-foreground"
                  >
                    Learn More
                  </Text>
                  <Icon name={icon ?? IconName.circle} className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
