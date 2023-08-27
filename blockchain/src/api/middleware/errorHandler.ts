export default (err:any, req:any, res:any, next:any) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Internal Server Error';

  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    message: err.message,
  });
};