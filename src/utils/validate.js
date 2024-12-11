export const validateRequireField = (field, fieldName) => {
  if (!field) {
    const error = new Error(`${fieldName}을 입력해주세요`);
    error.statusCode = 400;
    throw error;
  }
};
