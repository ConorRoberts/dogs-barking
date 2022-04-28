import LoadingScreen from "@components/LoadingScreen";
import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ErrorIcon, PlusIcon } from "@components/Icons";
import axios from "axios";
import PlannerSemester from "@components/PlannerSemester";
import { PlannerSemesterData } from "@typedefs/DegreePlan";

const Page = () => {
  const { user, loading } = useSelector<RootState, AuthState>((state) => state.auth);
  const router = useRouter();
  const [validationErrors, setValidationErrors] = useState([]);
  const [planState, setPlanState] = useState(null);

  const addNewSemester = async () => {
    try {
      await axios.post(`/api/degree-plan/id/${planState.id}/create-semester`);
      await fetchPlanState();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPlanState = useCallback(async () => {
    const { data } = await axios.get(`/api/degree-plan/get-user-plan/${user.id}`);

    setPlanState(data);
  }, [user]);

  useEffect(() => {
    // Get the user's plan state
    (async () => {
      if (loading) return;

      if (user) {
        await fetchPlanState();
      } else {
        router.push("/error/403");
      }
    })();
  }, [user, router, loading, fetchPlanState]);

  if (!user || !planState) return <LoadingScreen />;

  return (
    <div>
      <div>
        <h1 className="text-center">Degree Planner</h1>
      </div>
      {validationErrors.length > 0 && (
        <div className="relative w-10 h-10">
          <ErrorIcon className="text-gray-900 w-full h-full rounded-full" />
          <div className="flex bg-red-500 justify-center items-center h-5 w-5 rounded-full overflow-hidden absolute bottom-0 right-0 text-white">
            <p>{validationErrors.length}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {planState.semesters.map((semester:PlannerSemesterData, index) => (
          <PlannerSemester key={`semester-${index}`} {...semester}/>
        ))}
        <PlusIcon
          size={30}
          className="rounded-full p-1 border border-gray-400 cursor-pointer text-gray-400 mx-auto"
          onClick={addNewSemester}
        />
      </div>
    </div>
  );
};

export default Page;
