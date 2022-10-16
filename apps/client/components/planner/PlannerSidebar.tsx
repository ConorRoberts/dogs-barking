import { useAuthenticator } from "@aws-amplify/ui-react";
import { PlannerState } from "@redux/planner";
import { RootState } from "@redux/store";
import Program from "~/types/Program";
import Requirement from "~/types/Requirement";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingIcon } from "./Icons";
import PlannerSidebarRequirement from "./PlannerSidebarRequirement";

const PlannerSidebar = () => {
  const [majorRequirements, setMajorRequirements] = useState<Requirement[]>([]);
  const [minorRequirements, setMinorRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState({ major: false, minor: false });
  const { user } = useAuthenticator();
  const { plan } = useSelector<RootState, PlannerState>((state) => state.planner);

  // const plannedCourses = plan?.semesters
  //   ?.map((e) => e.courses)
  //   .flat()
  //   .concat(...user.takenCourses);

  const neededCredits = majorRequirements.reduce((acc, curr) => {
    if (curr.label === "Course") {
      return acc + curr.credits;
    } else if (curr.label === "OrBlock" && curr.target !== undefined) {
      return acc + curr.target;
    } else {
      return acc;
    }
  }, 0);

  // const currentCredits = plannedCourses?.reduce((a, b) => a + b.credits, 0);

  useEffect(() => {
    if (!user) return;
    (async () => {
      // if (user?.major) {
      //   setLoading((state) => ({ ...state, major: true }));
      //   try {
      //     const { data } = await axios.get<Program>(`/api/program/${user.major.id}`);
      //     setMajorRequirements(data.major);
      //   } catch (error) {
      //     console.error(error);
      //   }
      //   setLoading((state) => ({ ...state, major: false }));
      // }
      // if (user?.minor) {
      //   setLoading((state) => ({ ...state, minor: true }));
      //   try {
      //     const { data } = await axios.get<Program>(`/api/program/${user.minor.id}`);
      //     setMinorRequirements(data.minor);
      //   } catch (error) {
      //     console.error(error);
      //   }
      //   setLoading((state) => ({ ...state, minor: false }));
      // }
    })();
  }, [user]);

  return (
    <div className="hidden md:block overflow-y-auto max-h-full border-l border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-center">Progress</h2>

      {/* <p>{(currentCredits / neededCredits) * 100} credits / 20</p>
      <div className="h-4 bg-primary-100 overflow-hidden rounded-full">
        <div style={{ width: `${(currentCredits / neededCredits) * 100}%` }} className="bg-primary-500 h-full"></div>
      </div> */}

      {/* <div className="flex flex-col py-4">
        <div>
          {majorRequirements.length > 0 && <h3 className="text text-center">Major: {user.major.name}</h3>}
          {majorRequirements.map((e) => (
            <PlannerSidebarRequirement key={`planner progress sidebar ${e.id}`} requirement={e} />
          ))}
          {loading.major && <LoadingIcon className="animate-spin mx-auto" size={25} />}
        </div>
        <div>
          {minorRequirements.length > 0 && <h3 className="text text-center">Major: {user.major.name}</h3>}
          {minorRequirements.map((e) => (
            <PlannerSidebarRequirement key={`planner progress sidebar ${e.id}`} requirement={e} />
          ))}
          {loading.minor && <LoadingIcon className="animate-spin mx-auto" size={25} />}
        </div>
      </div> */}
    </div>
  );
};

export default PlannerSidebar;
