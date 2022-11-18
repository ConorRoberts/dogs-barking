import { API_URL } from "~/config/config";
import Course from "~/types/Course";
import Requirement from "~/types/Requirement";

type GetCourseResponse = { course: Course; nodes: Record<string, Requirement> };

const getCourse = async (courseId: string) => {
  const res = await fetch(`${API_URL}/course/${courseId}`);
  const data: GetCourseResponse = await res.json();
  return data;
};

export default getCourse;
