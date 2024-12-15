export const validateRequireField = (field, fieldName) => {
  if (!field || !field.length) {
    const error = new Error(`${fieldName}을 입력해주세요`);
    error.statusCode = 400;
    throw error;
  }
};
