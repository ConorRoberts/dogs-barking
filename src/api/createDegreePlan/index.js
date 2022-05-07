/**
 * @METHOD POST
 */
exports.handler = async (
    event
) => {
    try {
        console.log(event);

        const body = JSON.parse(event.body ?? "{}");

        return {
            statusCode: 200,
            body: JSON.stringify({ body }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
