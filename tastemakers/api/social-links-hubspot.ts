/** HubSpot contact custom property — first / LinkedIn profile URL. */
export const HUBSPOT_PROP_AFFILIATE_LINKEDIN = 'affiliate__linkedin'

/** HubSpot contact custom property — additional profile URLs (multi-line text). */
export const HUBSPOT_PROP_AFFILIATE_SOCIAL_LINKS = 'afilliatesociallinks'

const ADDITIONAL_LINKS_SEPARATOR = ', '

export function normalizeSocialLinks(socialLinks: string[]): string[] {
  return socialLinks.map((u) => u.trim()).filter(Boolean)
}

/**
 * Maps `socialLinks` from the application payload to HubSpot contact properties.
 * Index 0 → affiliate__linkedin; remaining → afilliatesociallinks (comma-separated).
 */
export function socialLinksToHubSpotProperties(socialLinks: string[]): Record<string, string> {
  const normalized = normalizeSocialLinks(socialLinks)
  const properties: Record<string, string> = {}

  const linkedIn = normalized[0]
  if (linkedIn) properties[HUBSPOT_PROP_AFFILIATE_LINKEDIN] = linkedIn

  const extras = normalized.slice(1)
  if (extras.length > 0) {
    properties[HUBSPOT_PROP_AFFILIATE_SOCIAL_LINKS] = extras.join(ADDITIONAL_LINKS_SEPARATOR)
  }

  return properties
}
