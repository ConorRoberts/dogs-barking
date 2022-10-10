import Meeting from "~/types/Meeting";
import Section from "~/types/Section";
import { CheckIcon } from "./Icons";
import clsx from "clsx";
import { FC } from "react";

interface Props {
  section: Section;
  selected?: boolean;
}

const CourseSection = ({ section, selected }: Props) => {
  return (
    <div
      className={clsx(
        "rounded-md p-2 flex flex-col gap-1 relative shadow-center",
        selected ? "dark:bg-blue-900 bg-blue-100" : "dark:bg-gray-800 bg-white"
      )}
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

      <MeetingGroup type="lectures" section={section} />
      <MeetingGroup type="labs" section={section} />
      <MeetingGroup type="seminars" section={section} />
      <MeetingGroup type="exams" section={section} />

      <p className="ml-auto">{section.instructor.name}</p>
    </div>
  );
};

const MeetingGroup: FC<{ section: Section; type: "lectures" | "labs" | "seminars" | "exams" }> = ({
  section,
  type,
}) => {
  if (!section[type]) return null;
  return (
    <div className="flex flex-col gap-1">
      <p className="capitalize">{type}</p>
      {section[type].map((meeting: Meeting) => (
        <SectionMeeting key={`section ${section.id} lecture ${meeting.id}`} section={section} meeting={meeting} />
      ))}
    </div>
  );
};

const SectionMeeting: FC<{ section: Section; meeting: Meeting }> = ({ section, meeting }) => {
  return (
    <div className="flex gap-2 items-center">
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
  );
};

export default CourseSection;
