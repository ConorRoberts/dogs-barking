/**
* @method GET
* @description Executes a complex program query against the full program list
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