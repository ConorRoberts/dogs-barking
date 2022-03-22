import MetaData from "@components/MetaData";
import DevMember from "@components/DevMember";

const Page = () => {
  return (
    <div className="flex flex-col gap-2 mx-auto max-w-6xl w-full p-2">
      <MetaData title="Contact Us" />
      <h1 className="py-4 text-center">Contact Us</h1>
      <h3 className="py-4 font-normal text-center">Meet the Development Team!</h3>

      <div className="grid lg:grid-cols-2 gap-4 lg:gap-8 justify-center">
        <DevMember
          name="Ben Carlson"
          role="Full-Stack Developer"
          email="benproskilled@gmail.com"
          imagePath="/assets/contact_images/Ben.jpg"
          alt="Dev 1 Image"
        />
        <DevMember
          name="Conor Roberts"
          role="Full-Stack Developer"
          email="conor@conorroberts.com"
          imagePath="/assets/contact_images/Conor.jpg"
          alt="Conor Roberts headshot"
        />
        <DevMember
          name="Greg Shalay"
          role="Frontend Design & Development"
          email="greg_shalay@outlook.com"
          imagePath="/assets/contact_images/Greg.jpg"
          alt="Dev 3 Image"
        />
        <DevMember
          name="Noah Hatt"
          role="Full-Stack Developer"
          email="hattnoah@gmail.com"
          imagePath="/assets/contact_images/Noah.png"
          alt="Dev 4 Image"
        />
        <DevMember
          name="Dev Member 5"
          role="Role 5"
          email="dev5@gmail.com"
          imagePath="/assets/contact_images/bender.jpg"
          alt="Dev 5 Image"
        />
        <DevMember
          name="Dev Member 6"
          role="Role 6"
          email="dev6@gmail.com"
          imagePath="/assets/contact_images/bender.jpg"
          alt="Dev 6 Image"
        />
      </div>
    </div>
  );
};

export default Page;
