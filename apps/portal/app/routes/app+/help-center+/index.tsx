import { IconName, Text, TextVariant, TextWeight } from '@0xintuition/1ui'

import ExploreHeader from '@components/explore/ExploreHeader'
import { SupportCardGrid } from '@components/support/support-card'
import { SupportFAQ } from '@components/support/support-faq'
import { SupportHeaderCard } from '@components/support/support-header-card'
import { SocialCardGrid } from '@components/support/support-socials'
import {
  claimFaq,
  followsFaq,
  identityFaq,
  listsFaq,
  stakingFaq,
  tagsFaq,
} from '@routes/app+/help-center+/faq'
import { HEADER_BANNER_HELP_CENTER, PATHS } from 'app/consts'
import FullPageLayout from 'app/layouts/full-page-layout'

const supportCards = [
  {
    icon: IconName.discord,
    title: 'Discord',
    description:
      'Join our vibrant Discord community to get real-time support, connect with other users, and participate in discussions.',
    link: 'https://discord.gg/0xintuition',
  },
  {
    icon: IconName.telegram,
    title: 'Telegram',
    description:
      'Stay updated and receive quick support by connecting with us on Telegram, where our team is ready to assist.',
    link: 'https://t.me/intuitionsystems',
  },
  {
    icon: IconName.headset,
    title: 'Support',
    description:
      'Got a bug? Hit a snag? No worries — help is just a click away! Just head to our Discord and submit your issue through our in-chat intake form.',
    link: 'https://discord.com/channels/909531430881746974/1151564740255043604',
  },
  {
    icon: IconName.megaphone,
    title: 'Feedback',
    description:
      'Use our feedback form to share your thoughts, report issues, or suggest improvements. Your input helps us make Intuition better.',
    link: 'https://0xintuition.typeform.com/betafeedback',
  },
]

const socialCards = [
  {
    title: 'Twitter',
    link: 'https://x.com/0xIntuition',
    icon: IconName.twitter,
  },
  {
    title: 'Discord',
    link: 'https://discord.gg/0xintuition',
    icon: IconName.discord,
  },
  {
    title: 'Telegram',
    link: 'https://t.me/intuitionsystems',
    icon: IconName.telegram,
  },
  {
    title: 'Warpcast',
    link: 'https://warpcast.com/0xintuition',
    icon: IconName.warpcast,
  },
  {
    title: 'Medium',
    link: 'https://medium.com/0xintuition',
    icon: IconName.medium,
  },
  {
    title: 'Galxe',
    link: 'https://app.galxe.com/quest/intuition',
    icon: IconName.galxe,
  },
  {
    title: 'Mirror',
    link: 'https://mirror.xyz/0x0bcAFff6B45769B53DE34169f08AB220d2b9F910',
    icon: IconName.mirror,
  },
  {
    title: 'Github',
    link: 'https://github.com/0xintuition',
    icon: IconName.github,
  },
]

export default function HelpCenter() {
  return (
    <FullPageLayout>
      <div className="flex flex-col max-w-7xl gap-12">
        <ExploreHeader
          title="Help Center"
          content="Find answers and get support."
          icon={IconName.rescueRing}
          bgImage={HEADER_BANNER_HELP_CENTER}
        />
        <SupportHeaderCard
          title="Complete Quests to Get You Started"
          content="Our Primitive Island quest line is designed to help you master the essentials of the Intuition System. From creating Claims to Staking, we’ve got you covered with easy-to-follow instructions."
          link={PATHS.QUEST}
          ctaText="View Quests"
        />
        <SupportCardGrid supportCards={supportCards} />
        <div className="flex flex-col gap-6">
          <Text
            variant={TextVariant.headline}
            weight={TextWeight.medium}
            className="text-primary/90"
          >
            FAQ
          </Text>
          <SupportFAQ title="Atoms/Identities" faqItems={identityFaq} />
          <SupportFAQ title="Triples/Claims" faqItems={claimFaq} />
          <SupportFAQ title="Staking/Signaling" faqItems={stakingFaq} />
          <SupportFAQ title="Lists" faqItems={listsFaq} />
          <SupportFAQ title="Tags" faqItems={tagsFaq} />
          <SupportFAQ title="Follows" faqItems={followsFaq} />
        </div>
        <SocialCardGrid socialCards={socialCards} />
      </div>
    </FullPageLayout>
  )
}
