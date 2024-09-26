import enumHTTP_CODE from "../enumerations/http_code.js";
export const validate = (schema, property = "body") => {
  return (req, res, next) => {

    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const errorMessage = `Please check your input and try again`;
      console.log(error.details[0]);

      const errors = error.details.map((error) => {
        const key = error.context.key;
        return { [key]: error.message };
      });

      return res.status(enumHTTP_CODE.BAD_REQUEST).json({
        message: errorMessage,
        error: errors,
      });
    } else {
      next();
    }
  };
};
