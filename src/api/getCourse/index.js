const neo4j = require("neo4j-driver");

/**
* @method method
* @description Gets the course with the given id
*/
exports.handler = async (
    event
) => {
    console.log(event);

    const { id } = event.queryStringParameters;
    const headers = event.headers;

    if (id === undefined || typeof id !== "string") throw new Error("Invalid id");

    const driver = neo4j.driver(
        `neo4j://${process.env.NEO4J_HOST}`,
        neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
    );

    const session = driver.session();

    const { records } = await session.run(
        `
        MATCH (course:Course {id: $id})
        OPTIONAL MATCH path=(course)-[:REQUIRES*]->(prereq)

        MATCH (school:School)-[:OFFERS]->(course)

        return 
            properties(course) as course,
            properties(school) as school,
            [n in nodes(path) | {data: properties(n), type: labels(n)[0]}] as requirements
            `,
        { id }
    );

    await session.close();
    await driver.close();

    // This is to store the requirement tree. Object format is fastest for retrieval and duplicate prevention.
    const requirements = {};

    if (records[0].get("requirements") !== null) {
        records
            .map((e) => e.get("requirements"))
            .forEach((list) => {
                let previous;
                list.forEach((e, index) => {
                    const formatted = {
                        ...e.data,
                        type: e.type,
                        requirements: [],
                    };

                    // If this is the first element, skip it
                    if (index !== 0) {
                        // Are we missing this entry in our list?
                        if (requirements[formatted.id] === undefined) requirements[formatted.id] = formatted;

                        if (index > 1 && previous)
                            requirements[previous.id].requirements = [
                                ...new Set([...requirements[previous.id].requirements, formatted.id]),
                            ];
                    }

                    previous = formatted;
                });
            });

        const fillTree = (id) => {
            const node = requirements[id];

            return {
                ...node,
                requirements: node.requirements.map((e) => fillTree(e)).filter((e) => e !== undefined && e !== null),
            };
        };

    }

    return {
        ...records[0].get("course"),
        school: records[0].get("school"),
        type: "Course",
        requirements: records
            .map((e) => fillTree(e.get("requirements")[1].data.id))
            .map((e, index, arr) => (arr.findIndex((e2) => e2?.id === e?.id) === index ? e : null))
            .filter((e) => e !== undefined && e !== null),
    };
};