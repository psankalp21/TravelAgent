function handleServerError(request, h, error) {
  console.error('Error', error);
  if (error.output && error.output.statusCode === 409) {
    return h.response({ message: error.message, errorCode: 'CONFLICT' }).code(409);
  } else if (error.output && error.output.statusCode === 400) {
    return h.response({ message: error.message, errorCode: 'BAD_REQUEST' }).code(400);
  } else if (error.output && error.output.statusCode === 404) {
    return h.response({ message: error.message, errorCode: 'NOT_FOUND' }).code(404);
  } else if (error.output && error.output.statusCode === 401) {
    return h.response({ message: error.message, errorCode: 'UNAUTHORIZED' }).code(401);
  } else if (error.output && error.output.statusCode === 429) {
    return h.response({ message: 'Rate Limit Exceeded', errorCode: 'RATE_LIMIT_EXCEEDED' }).code(429);
  } else {
    return h.response({ message: 'Something went wrong', errorCode: 'INTERNAL_SERVER_ERROR' }).code(500);
  }
}

export default function errorHandlingMiddleware(server) {
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    if (response.isBoom) {
      return handleServerError(request, h, response);
    }
    return h.continue;
  });
}
