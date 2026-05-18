import assert from 'node:assert/strict'
import {
  HUBSPOT_PROP_AFFILIATE_LINKEDIN,
  HUBSPOT_PROP_AFFILIATE_SOCIAL_LINKS,
  socialLinksToHubSpotProperties,
} from './social-links-hubspot'

function run() {
  const linkedInOnly = socialLinksToHubSpotProperties(['https://linkedin.com/in/foo'])
  assert.equal(linkedInOnly[HUBSPOT_PROP_AFFILIATE_LINKEDIN], 'https://linkedin.com/in/foo')
  assert.equal(linkedInOnly[HUBSPOT_PROP_AFFILIATE_SOCIAL_LINKS], undefined)

  const withOneExtra = socialLinksToHubSpotProperties([
    'https://linkedin.com/in/foo',
    'https://instagram.com/bar',
  ])
  assert.equal(withOneExtra[HUBSPOT_PROP_AFFILIATE_LINKEDIN], 'https://linkedin.com/in/foo')
  assert.equal(withOneExtra[HUBSPOT_PROP_AFFILIATE_SOCIAL_LINKS], 'https://instagram.com/bar')

  const withTwoExtras = socialLinksToHubSpotProperties([
    '  https://linkedin.com/in/foo  ',
    'https://x.com/a',
    'https://youtube.com/b',
  ])
  assert.equal(withTwoExtras[HUBSPOT_PROP_AFFILIATE_LINKEDIN], 'https://linkedin.com/in/foo')
  assert.equal(
    withTwoExtras[HUBSPOT_PROP_AFFILIATE_SOCIAL_LINKS],
    'https://x.com/a, https://youtube.com/b',
  )

  const emptyExtras = socialLinksToHubSpotProperties(['https://linkedin.com/in/foo', '  ', ''])
  assert.equal(emptyExtras[HUBSPOT_PROP_AFFILIATE_SOCIAL_LINKS], undefined)

  console.log('social-links-hubspot: all assertions passed')
}

run()
