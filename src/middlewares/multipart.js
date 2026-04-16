const parseJsonMaybe = (value, fallback) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || !value.trim()) return fallback;

  try {
    return JSON.parse(value);
  } catch (error) {
    return fallback;
  }
};

const parseNumberMaybe = (value, fallback = 0) => {
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const parseBooleanMaybe = (value) => {
  if (typeof value === 'boolean') return value;
  return String(value).toLowerCase() === 'true';
};

export const normalizeSettingsMultipart = (req, _res, next) => {
  req.body.phoneNumbers = parseJsonMaybe(req.body.phoneNumbers, []).filter(Boolean);
  req.body.emailAddresses = parseJsonMaybe(req.body.emailAddresses, []).filter(Boolean);
  next();
};

export const normalizeProjectMultipart = (req, _res, next) => {
  req.body.sortOrder = parseNumberMaybe(req.body.sortOrder, 0);
  req.body.featured = parseBooleanMaybe(req.body.featured);
  req.body.technology = parseJsonMaybe(req.body.technology, []);
  req.body.skills = parseJsonMaybe(req.body.skills, []);
  req.body.additionalLinks = parseJsonMaybe(req.body.additionalLinks, []);
  next();
};

export const normalizeBlogMultipart = (req, _res, next) => {
  req.body.published = parseBooleanMaybe(req.body.published);
  req.body.tags = parseJsonMaybe(req.body.tags, []);
  next();
};

export const normalizeServiceMultipart = (req, _res, next) => {
  req.body.sortOrder = parseNumberMaybe(req.body.sortOrder, 0);
  next();
};
