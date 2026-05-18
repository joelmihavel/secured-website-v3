export type SocialProofItem = {
  title: string
  meta: string
}

export type TrackItem = {
  title: string
  copy: string
  /** Overrides `copy` on mobile — desktop keeps `copy`. */
  mobileCopy?: string
  image?: {
    src: string
    alt: string
  }
  /** Shown after ₹ on fold 4 track cards (mobile + desktop flip back). */
  rewardStat?: string
}
