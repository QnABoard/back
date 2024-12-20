const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ERRORS = {
  unaunauthorized: (message = "권한이 없습니다.") => createError(message, 401),
  notFound: (message = "찾을 수 없습니다.") => createError(message, 404),
  badRequest: (message = "잘못된 요청입니다.") => createError(message, 400),
  conflict: (message = "이미 존재하는 리소스입니다.") =>
    createError(message, 409),
};

export default ERRORS;
