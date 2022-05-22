import Section from "@typedefs/Section";

interface Props {
  section: Section;
}

const CourseSection = ({ section }: Props) => {
  return (
    <div className="bg-gray-800">
      <p>{section.term}</p>
      <p>Instructor {section.instructor.name}</p>
    </div>
  );
};

export default CourseSection;
