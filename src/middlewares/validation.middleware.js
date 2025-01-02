export const validateRequest = (schema) => {
  return (request, response, next) => {
    const result = schema.validate(request.body);
    if (result.error) {
      return response.status(400).json({
        error: result.error.details[0].message,
      });
    }
    if (!request.value) {
      request.value = {};
    }
    request.value['body'] = result.value;
    next();
  };
};