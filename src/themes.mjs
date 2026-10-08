/**
 * Family identity is separate from Cosmik's umbrella identity.
 * Register only owner-approved family assets here. Proposed kit files do not
 * become production assets merely because they exist in the brand repository.
 */
export const familyThemes = {
  hplx: {
    // Owner selected this kit for the private website; the Ember symbol was selected independently on 8 October.
    state: 'approved-for-website',
    stylesheet: 'assets/families/hplx/theme.css',
    logo: 'assets/families/hplx/hplx-ember-amber.svg',
  },
};

export function resolveFamilyTheme(familyId, registry = familyThemes) {
  if (!/^[a-z0-9-]+$/.test(familyId)) throw new Error('Family identity must use a URL-safe name.');
  const theme = registry[familyId];
  if (!theme || !['approved', 'approved-for-website'].includes(theme.state)) return { id: familyId, state: 'baseline', stylesheet: null, logo: null };
  if (theme.stylesheet && theme.stylesheet !== `assets/families/${familyId}/theme.css`) throw new Error('Family stylesheets must use their own asset directory.');
  if (theme.logo && (!theme.logo.startsWith(`assets/families/${familyId}/`) || !/^assets\/families\/[a-z0-9-]+\/[a-z0-9-]+\.(svg|png|webp)$/.test(theme.logo))) throw new Error('Family logos must use their own asset directory.');
  return { id: familyId, state: theme.state, stylesheet: theme.stylesheet || null, logo: theme.logo || null };
}
