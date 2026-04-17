export const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

export const ensureUniqueSlug = async (delegate, title, providedSlug, excludeId = '') => {
  const baseSlug = slugify(providedSlug || title || 'item');
  let nextSlug = baseSlug || 'item';
  let counter = 1;

  while (true) {
    const existing = await delegate.findUnique({ where: { slug: nextSlug } });
    if (!existing || existing.id === excludeId) {
      return nextSlug;
    }

    counter += 1;
    nextSlug = `${baseSlug}-${counter}`;
  }
};
