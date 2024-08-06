const HTTP_ERRORS: Record<number, string> = {
  400: 'Bad Request. Please check entered data',
  401: 'Unauthorized. Please log in',
  403: 'Forbidden. You do not have the necessary permissions',
  404: 'Not Found. The requested resource was not found',
  405: 'Method not Allowed. Please check your last action',
  428: 'Name length should be less than 50 characters',
  500: 'Internal Server Error. Please try again later',
  501: 'Not Implemented. The request method is not supported by the server and cannot be handled',
  502: 'Bad Gateway. The server is down or unreachable',
  503: 'Service Unavailable. Please try again later',
  504: 'Gateway Timeout. Please try again later',
}
export default HTTP_ERRORS;
