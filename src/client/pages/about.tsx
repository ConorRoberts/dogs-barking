import CreatorCard from "@components/CreatorCard";

const Page = () => {
  return (
    <div>
      <h1>About</h1>

      <h2>Creators</h2>

      <div className="grid sm:grid-cols-2 gap-4 justify-center">
        <CreatorCard
          image={"/creators/Conor.jpg"}
          name="Conor Roberts"
          role="Full-Stack Web Developer"
          githubUrl="https://github.com/conorroberts"
        />
      </div>
    </div>
  );
};

export default Page;
