import Meeting from "@typedefs/Meeting";
import Section from "@typedefs/Section";
import { CheckIcon } from "./Icons";

interface Props {
  section: Section;
  selected?: boolean;
}

const CourseSection = ({ section, selected }: Props) => {
  return (
    <div
      className={`rounded-md p-2 flex flex-col gap-1 relative ${
        selected ? "dark:bg-blue-900 bg-blue-100" : "dark:bg-gray-800 bg-white"
      }`}
    >
      {selected && (
        <div className="absolute -top-2 -right-2">
          <CheckIcon size={18} className="dark:text-green-400" />
        </div>
      )}
      <div className="flex gap-2 justify-between items-center">
        <h3 className="text-xl">{section.code}</h3>
        <h3 className="text-xl">
          {section.semester[0].toUpperCase()}
          {section.year % 2000}
        </h3>
      </div>

      {["lectures", "labs", "seminars", "exams"].map(
        (e) =>
          section[e].length > 0 && (
            <div key={`section ${section.id} ${e}`} className="flex flex-col gap-1">
              <p className="capitalize">{e}</p>
              {section[e].map((meeting: Meeting) => (
                <div key={`section ${section.id} lecture ${meeting.id}`} className="flex gap-2 items-center">
                  {meeting.days.map((day, dayIndex) => (
                    <div
                      key={`section ${section.id} lecture ${meeting.id} day ${dayIndex}`}
                      className="rounded-full border border-gray-300 dark:border-gray-700 w-7 h-7 text-center flex justify-center items-center"
                    >
                      <p className="capitalize text-sm">{day.slice(0, 2)}</p>
                    </div>
                  ))}
                  <p className="text-sm ml-auto">
                    {meeting.startTime} - {meeting.endTime}
                  </p>
                </div>
              ))}
            </div>
          )
      )}
      <p className="ml-auto">{section.instructor.name}</p>
    </div>
  );
};

export default CourseSection;
