/**
 * @METHOD POST
 */
exports.handler = async (
    event
) => {
    try {
        console.log(event);

        const body = JSON.parse(event.body ?? "{}");

        const { data } = body;

        return {
            statusCode: 201,
            body: JSON.stringify({ data }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
