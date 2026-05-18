import type { SocialProofItem, TrackItem } from './types'

export const socialProofItems: SocialProofItem[] = [
  { title: 'The repost that became a housewarming full of strangers.', meta: 'Reshare / Story' },
  { title: 'Threaded recommendations that sold out before midnight.', meta: 'Thread / Culture' },
  { title: 'Saved post. Shared list. Group chat movement.', meta: 'Mention / Group' },
  { title: 'A coffee table object everyone asked about.', meta: 'UGC / In the wild' },
]

export const rewardsOrbitItems = [
  'Staycations',
  'Furniture credits',
  'Chef tables',
  'Gallery passes',
  'Wellness rituals',
  'Private previews',
]

export const trackItems: TrackItem[] = [
  {
    title: 'The Connector',
    copy: 'Hosts circles, moves communities, turns recommendations into gatherings.',
    mobileCopy:
      "Knows the city like no one else does. When someone is looking for a place to live, you're the person they call first.",
    rewardStat: '30K',
    image: {
      src: '/tracks/connector.png',
      alt: 'The Connector tastemaker tile',
    },
  },
  {
    title: 'The Creator',
    copy: 'Shapes moodboards, stories, and visual taste language for homes.',
    mobileCopy:
      'Turns taste into content. What you post, shoot, and share becomes a reference point for everyone else.',
    rewardStat: '20K',
    image: {
      src: '/tracks/creator.png',
      alt: 'The Creator tastemaker tile',
    },
  },
  {
    title: 'The Insider',
    copy: 'Knows the city, the corners, the upcoming places before everyone.',
    mobileCopy:
      'Always in the conversation. You engage, repost, and keep the circle moving no matter where you are.',
    image: {
      src: '/tracks/insider.png',
      alt: 'The Insider tastemaker tile',
    },
  },
]

export const tastemakerCards = [
  'Rhea / Indiranagar',
  'Kabir / Cooke Town',
  'Aisha / Jayanagar',
  'Neel / Koramangala',
  'Mira / Sadashivanagar',
]
