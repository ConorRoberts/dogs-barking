import Section from "@typedefs/Section";

interface Props {
  section: Section;
}

const CourseSection = ({ section }: Props) => {
  return (
    <div className="dark:bg-gray-800 bg-white rounded-md p-2">
      <p>{section.code}</p>
      <p>{section.term}</p>
      <p>Instructor {section.instructor.name}</p>

      {section.lectures.map((lecture) => (
        <div key={`section ${section.id} lecture ${lecture.id}`}>
          {lecture.days.map((day, dayIndex) => (
            <p
              className="capitalize rounded-full p-1 border-gray-300 dark:border-white "
              key={`section ${section.id} lecture ${lecture.id} day ${dayIndex}`}>
              {day.slice(0, 2)}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default CourseSection;
