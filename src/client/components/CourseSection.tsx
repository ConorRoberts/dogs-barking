import Section from "@typedefs/Section";

interface Props {
  section: Section;
}

const CourseSection = ({ section }: Props) => {
  console.log(section);
  return (
    <div>
      <p>{section.term}</p>
    </div>
  );
};

export default CourseSection;
