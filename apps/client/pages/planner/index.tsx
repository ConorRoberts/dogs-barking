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
import { Select } from "@components/form";

const Page = () => {
  const { user, loading } = useSelector<RootState, AuthState>((state) => state.auth);
  const router = useRouter();
  const [plansLoading, setPlansLoading] = useState(true);
  const [plans, setPlans] = useState<{ id: string; semesters: string[] }[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("none");
  const [semesters, setSemesters] = useState([]);

  /**
   * Create a new plan
   */
  const createPlan = async () => {
    try {
      await axios.post(`/api/degree-plan/new`, {
        userId: user.id,
      });
      await fetchPlans();
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Add a semester to the selected plan
   */
  const addSemester = async () => {
    try {
      const { data } = await axios.post(`/api/degree-plan/id/${selectedPlan}/create-semester`, {
        userId: user.id,
      });
      setSemesters([...semesters, data.id]);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Get the user's plans
   */
  const fetchPlans = useCallback(async () => {
    setPlansLoading(true);
    try {
      const { data } = await axios.get(`/api/degree-plan/user-plans/${user.id}`);
      setPlans(data);
    } catch (error) {
      setPlans([]);
    }
    setPlansLoading(false);
  }, [user]);

  // Get the user's plan state
  useEffect(() => {
    (async () => {
      if (loading) return;

      if (user) {
        await fetchPlans();
      } else {
        router.push("/error/403");
      }
    })();
  }, [user, router, loading, fetchPlans]);

  // Update the state of our semesters list whenever our selected plan changes
  useEffect(() => {
    if (selectedPlan === "none") return;
    setSemesters(plans.find((e) => e.id === selectedPlan).semesters);
  }, [selectedPlan, plans]);

  if (!user || plansLoading) return <LoadingScreen />;

  return (
    <div className="p-2 flex flex-col gap-8">
      <div>
        <h1 className="text-center">Degree Planner</h1>
      </div>
      <Select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)}>
        <option value="none">Select a plan</option>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.id}
          </option>
        ))}
      </Select>
      {/* {validationErrors.length > 0 && (
        <div className="relative w-10 h-10">
          <ErrorIcon className="text-gray-900 w-full h-full rounded-full" />
          <div className="flex bg-red-500 justify-center items-center h-5 w-5 rounded-full overflow-hidden absolute bottom-0 right-0 text-white">
            <p>{validationErrors.length}</p>
          </div>
        </div>
      )} */}

      <div className="flex flex-col gap-8">
        {selectedPlan !== "none" &&
          semesters.map((semester, index) => <PlannerSemester key={`semester-${index}`} semesterId={semester} />)}
        <PlusIcon
          size={30}
          className="rounded-full p-1 border border-gray-400 cursor-pointer text-gray-400 mx-auto"
          onClick={addSemester}
        />
      </div>
    </div>
  );
};

export default Page;
