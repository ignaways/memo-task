export default function validate(schemas) {
  return (req, res, next) => {
    req.valid = {
      params: schemas.params ? schemas.params.parse(req.params) : req.params,
      query: schemas.query ? schemas.query.parse(req.query) : req.query,
      body: schemas.body ? schemas.body.parse(req.body ?? {}) : req.body,
    };
    next();
  };
}
