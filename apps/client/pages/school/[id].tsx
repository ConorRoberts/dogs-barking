import MetaData from "~/components/MetaData";
import { API_URL, GOOGLE_MAPS_API_KEY } from "~/config/config";
import School from "~/types/School";
import { NextPageContext } from "next";

interface Props {
  school: School;
}

const Page = ({ school }: Props) => {
  return (
    <div className="mx-auto max-w-6xl w-full p-1">
      <MetaData title={school.name} />
      <div className="text-center flex flex-col gap-1">
        <h1>{school.name}</h1>
        <a href={school.url} className="text-gray-500">
          Website
        </a>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <iframe
          loading="lazy"
          className="rounded-md overflow-hidden w-full h-[400px]"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}
    &q=${school.address}+${school.name}+${school.country}`}
        />
      </div>
    </div>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const id = context.query.id as string;
  const data = await fetch(`${API_URL}/school/${id}`, { method: "GET" });
  const school = (await data.json()) as School;

  return {
    props: {
      school,
    },
  };
};

export default Page;
