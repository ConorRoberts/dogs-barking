/**
* @method method
* @description description
*/
exports.handler = async (
    event
) => {
    console.log(event);

    const body = JSON.parse(event.body ?? "{}");
    const query = event.queryStringParameters;
    const pathParams = event.pathParameters;
    const headers = event.headers;

    return {
        data: "Hello World",
    };
};