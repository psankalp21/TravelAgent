function handleServerError(request, h, error) {
  console.error('Error', error);
  if (error.output && error.output.statusCode === 409) {
    return h.response({ message: error.message }).code(409);
  } else if (error.output && error.output.statusCode === 400) {
    return h.response({ message: error.message }).code(400);
  } else if (error.output && error.output.statusCode === 404) {
    return h.response({ message: error.message }).code(404);
  } else {
    return h.response({ message: 'Something went wrong' }).code(500);
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