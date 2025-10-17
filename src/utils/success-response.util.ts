export const successResponse = (
  data: any,
  message: string = 'Success',
  statusCode: number = 200,
) => {
  return {
    data,
    success: true,
    message,
    statusCode,
  };
};
