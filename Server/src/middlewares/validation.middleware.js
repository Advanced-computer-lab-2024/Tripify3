
export const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const errorMessage = `Please check your input and try again`;
      console.log(error.details[0]);

      const errors = error.details.map((error) => {
        const key = error.context.key;
        return { [key]: error.message };
      });

      return res.status(400).json({
        message: errorMessage,
        errors,
      });
    } else {
      next();
    }
  };
};
