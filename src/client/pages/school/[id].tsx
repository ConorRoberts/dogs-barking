import { NextPageContext } from "next";

/**
 * @description View information about a school
 */
const Page = ({ school }) => {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center flex flex-col gap-1">
        <h1>{school.name}</h1>
        <h5 className="text-gray-600">{school.city}</h5>
        <p className="text-gray-500">{school.abbrev}</p>
      </div>
      <div>
        <p>Easiest Courses</p>
      </div>
    </div>
  );
};

// export const getServerSideProps = async (context: NextPageContext) => {
//   const id = context.query.id as string;
//   const driver = getNeo4jDriver();
//   const session = driver.session();

//   const data = await session.run(
//     `
//     MATCH (school:School)-[:OFFERS]->(course:Course)-[:HAS_RATING]->(rating:Rating)
//     WHERE id(school) = $id
//     WITH course,avg(rating.difficulty) as rating, count(rating) as ratingCount
//     WITH collect({course:course, rating:rating, ratingCount:ratingCount }) as courses, min(rating) as minRating
//     UNWIND [c in courses where c.rating = minRating] as res
    
//     return res
//   `,
//     { id: +id }
//   );

//   await session.close();
//   await driver.close();
  
//   return {
//     props: {
//       school: await getSchool(id),
//     },
//   };
// };

export default Page;
