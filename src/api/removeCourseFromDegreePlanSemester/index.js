/**
 * @method DELETE
 * @description Delete a course by ID from a degree plan semester
 */
exports.handler = async (event) => {
  console.log(event);

  const body = JSON.parse(event.body ?? "{}");
  const query = event.queryStringParameters;
  const pathParams = event.pathParameters;
  const headers = event.headers;

  return "Hello World";
};
