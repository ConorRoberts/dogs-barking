import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import Program from "@typedefs/Program";
import Requirement from "@typedefs/Requirement";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LoadingIcon } from "./Icons";
import PlannerSidebarRequirement from "./PlannerSidebarRequirement";

const PlannerSidebar = () => {
  const [majorRequirements, setMajorRequirements] = useState<Requirement[]>([]);
  const [minorRequirements, setMinorRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState({ major: false, minor: false });
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  useEffect(() => {
    if (!user) return;
    (async () => {
      if (user?.major) {
        setLoading((state) => ({ ...state, major: true }));
        try {
          const { data } = await axios.get<Program>(`/api/program/${user.major.id}`);
          setMajorRequirements(data.requirements);
        } catch (error) {
          console.error(error);
        }
        setLoading((state) => ({ ...state, major: false }));
      }
      if (user?.minor) {
        setLoading((state) => ({ ...state, minor: true }));
        try {
          const { data } = await axios.get<Program>(`/api/program/${user.minor.id}`);
          setMinorRequirements(data.requirements);
        } catch (error) {
          console.error(error);
        }
        setLoading((state) => ({ ...state, minor: false }));
      }
    })();
  }, [user]);
  return (
    <div className="hidden md:block overflow-y-auto max-h-full border-l border-gray-100 dark:border-gray-700 p-4">
      <h2 className="text-center">Progress</h2>

      <div className="flex flex-col py-4">
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
      </div>
    </div>
  );
};

export default PlannerSidebar;
