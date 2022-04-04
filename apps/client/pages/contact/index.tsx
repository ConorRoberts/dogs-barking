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
          alt="Ben Carlson headshot"
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
          role="Full-Stack Developer"
          email="greg_shalay@outlook.com"
          imagePath="/assets/contact_images/Greg.jpg"
          alt="Greg Shalay headshot"
        />
        <DevMember
          name="Noah Hatt"
          role="Full-Stack Developer"
          email="hattnoah@gmail.com"
          imagePath="/assets/contact_images/Noah.png"
          alt="Noah Hatt headshot"
        />
        <DevMember
          name="Karan Swatch"
          role="Full-Stack Developer"
          email="karanswatch0@gmail.com"
          imagePath="/assets/contact_images/Karan.jpeg"
          alt="Karan Swatch headshot"
        />
        <DevMember
          name="Dylan So"
          role="Full-Stack Developer"
          email="dylan.11012@gmail.com"
          imagePath="/assets/contact_images/Dylan.jpg"
          alt="Dylan So headshot"
        />
      </div>
    </div>
  );
};

export default Page;
