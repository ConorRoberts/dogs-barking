import Section from "@typedefs/Section";

interface Props {
  section: Section;
}

const CourseSection = ({ section }: Props) => {
  return (
    <div className="dark:bg-gray-800 bg-white rounded-md p-2 flex flex-col gap-1">
      <p>{section.code}</p>
      <p>{section.semester}</p>
      <p>{section.year}</p>
      <p>{section.instructor.name}</p>

      {section.lectures.map((lecture) => (
        <div key={`section ${section.id} lecture ${lecture.id}`}>
          {lecture.days.map((day, dayIndex) => (
            <p
              className="capitalize rounded-full border p-1 border-gray-300 dark:border-gray-700 "
              key={`section ${section.id} lecture ${lecture.id} day ${dayIndex}`}>
              {day.slice(0, 2)}
            </p>
          ))}
        </div>
      ))}
      {section.exams.map((lecture) => (
        <div key={`section ${section.id} lecture ${lecture.id}`} className="flex gap-2 items-center">
          {lecture.days.map((day, dayIndex) => (
            <div
              key={`section ${section.id} lecture ${lecture.id} day ${dayIndex}`}
              className="rounded-full border border-gray-300 dark:border-gray-700 w-7 h-7 text-center flex justify-center items-center">
              <p className="capitalize text-sm">{day.slice(0, 2)}</p>
            </div>
          ))}
          <p className="text-sm ml-auto">
            {lecture.startTime} - {lecture.endTime}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CourseSection;
