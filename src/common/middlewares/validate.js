export const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!parsed.success) {
    return next({ statusCode: 400, message: parsed.error.errors[0]?.message || 'Validation error' });
  }

  req.validated = parsed.data;
  next();
};
