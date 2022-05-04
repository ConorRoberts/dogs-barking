import LoadingScreen from "@components/LoadingScreen";
import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PlusIcon } from "@components/Icons";
import axios from "axios";
import PlannerSemester from "@components/PlannerSemester";
import { PlannerSemesterData } from "@typedefs/DegreePlan";
import { Select } from "@components/form";
import { groupBy } from "lodash";
import PlannerYear from "@components/PlannerYear";

const Page = () => {
  const { user, loading } = useSelector<RootState, AuthState>((state) => state.auth);
  const router = useRouter();
  const [plansLoading, setPlansLoading] = useState(true);
  const [plans, setPlans] = useState<{ id: string; semesters: string[] }[]>([]);
  const [selectedPlan, setSelectedPlan] = useState("none");
  const [semesters, setSemesters] = useState<string[]>([]);

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
    if (loading) return;

    if (user) {
      fetchPlans();
    } else {
      router.push("/error/403");
    }
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

      <div className="flex flex-col gap-8">
        {selectedPlan !== "none" &&
         semesters.map((semester, index) => (
            <PlannerSemester semesterId={semester} key={`semester-${semester}-${index}`} />
          ))}
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
