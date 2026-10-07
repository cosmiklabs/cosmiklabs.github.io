/**
 * Family identity is separate from Cosmik's umbrella identity.
 * Register only owner-approved family assets here. Proposed kit files do not
 * become production assets merely because they exist in the brand repository.
 */
export const familyThemes = {
  hplx: {
    state: 'pending-identity',
    stylesheet: null,
    logo: null,
  },
};

export function resolveFamilyTheme(familyId, registry = familyThemes) {
  if (!/^[a-z0-9-]+$/.test(familyId)) throw new Error('Family identity must use a URL-safe name.');
  const theme = registry[familyId];
  if (!theme || theme.state !== 'approved') return { id: familyId, state: 'baseline', stylesheet: null, logo: null };
  if (theme.stylesheet && theme.stylesheet !== `assets/families/${familyId}/theme.css`) throw new Error('Family stylesheets must use their own asset directory.');
  if (theme.logo && (!theme.logo.startsWith(`assets/families/${familyId}/`) || !/^assets\/families\/[a-z0-9-]+\/[a-z0-9-]+\.(svg|png|webp)$/.test(theme.logo))) throw new Error('Family logos must use their own asset directory.');
  return { id: familyId, state: 'approved', stylesheet: theme.stylesheet || null, logo: theme.logo || null };
}
