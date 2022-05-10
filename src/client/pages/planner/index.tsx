import LoadingScreen from "@components/LoadingScreen";
import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PlusIcon } from "@components/Icons";
import axios from "axios";
import PlannerSemester from "@components/PlannerSemester";
import DegreePlanData from "@typedefs/DegreePlan";
import { Button, Select } from "@components/form";
import { groupBy } from "lodash";
import getToken from "@utils/getToken";

const Page = () => {
  const { user, loading } = useSelector<RootState, AuthState>((state) => state.auth);
  const router = useRouter();
  const [plansLoading, setPlansLoading] = useState(true);
  const [plans, setPlans] = useState<{ id: string; semesters: string[] }[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("none");
  const [selectedPlanData, setSelectedPlanData] = useState<DegreePlanData>(null);

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
      const { data } = await axios.post(
        `/api/degree-plan/${selectedPlanId}/create-semester`,
        {
          userId: user.id,
        },
        { headers: { Authorization: "Bearer " + user?.token } }
      );
      fetchPlanData();
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
      const { data } = await axios.get(`/api/degree-plan/get-user-plans`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setSelectedPlanId(data[0].id);
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

  const fetchPlanData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/degree-plan/${selectedPlanId}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setSelectedPlanData(data);
    } catch (error) {
      console.error(error);
    }
  }, [user, selectedPlanId]);

  // Update the state of our semesters list whenever our selected plan changes
  useEffect(() => {
    if (selectedPlanId === "none") return;
    fetchPlanData();
  }, [fetchPlanData, selectedPlanId]);

  if (!user || plansLoading) return <LoadingScreen />;

  return (
    <div className="p-2 flex flex-col gap-8">
      <div>
        <h1 className="text-center">Degree Planner</h1>
      </div>
      <Button onClick={createPlan}>
        <PlusIcon />
        <p>New Plan</p>
      </Button>
      <Select value={selectedPlanId} onChange={(e) => setSelectedPlanId(e.target.value)}>
        <option value="none">Select a plan</option>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.id}
          </option>
        ))}
      </Select>

      <div className="flex flex-col gap-8">
        {selectedPlanId !== "none" &&
          selectedPlanData?.semesters?.map((semester, index) => (
            <PlannerSemester data={semester} key={`semester-${semester}-${index}`} />
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
