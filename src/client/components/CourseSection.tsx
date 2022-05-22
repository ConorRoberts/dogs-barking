import Section from "@typedefs/Section";

interface Props {
  section: Section;
}

const CourseSection = ({ section }: Props) => {
  return (
    <div>
      <p>{section.term}</p>
    </div>
  );
};

export default CourseSection;
