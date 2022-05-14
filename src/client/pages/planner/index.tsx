import LoadingScreen from "@components/LoadingScreen";
import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PlusIcon } from "@components/Icons";
import axios from "axios";
import DegreePlanData from "@typedefs/DegreePlan";
import { Button } from "@components/form";
import { groupBy } from "lodash";
import PlannerYear from "@components/PlannerYear";

const Page = () => {
  const { user, loading, token } = useSelector<RootState, AuthState>((state) => state.auth);
  const router = useRouter();
  const [plansLoading, setPlansLoading] = useState(true);
  const [plans, setPlans] = useState<DegreePlanData[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("none");
  const [selectedPlanData, setSelectedPlanData] = useState<DegreePlanData>(null);
  const [groupedSemesters, setGroupedSemesters] = useState([]);

  const deleteSemester = (semesterId: string) => {
    setSelectedPlanData({
      ...selectedPlanData,
      semesters: selectedPlanData.semesters.filter((semester) => semester.id != semesterId),
    });
  };

  const createPlan = async () => {
    try {
      await axios.post(
        `/api/degree-plan/new`,
        {
          userId: user.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPlans();
    } catch (error) {
      console.error(error);
    }
  };

  // Add a semester to the selected plan
  const addSemester = async () => {
    try {
      const { data } = await axios.post(
        `/api/degree-plan/${selectedPlanId}/create-semester`,
        {
          userId: user.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update our local state without refetching
      setSelectedPlanData({ ...selectedPlanData, semesters: [...selectedPlanData.semesters, data] });
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
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPlanId(data[0].id);
      setPlans(data);
    } catch (error) {
      setPlans([]);
    }
    setPlansLoading(false);
  }, [user]);

  const fetchPlanData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/degree-plan/${selectedPlanId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPlanData(data);
    } catch (error) {
      console.error(error);
    }
  }, [user, selectedPlanId]);

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
    if (selectedPlanId === "none") return;
    fetchPlanData();
  }, [fetchPlanData, selectedPlanId]);

  useEffect(() => {
    if (selectedPlanData) {
      setGroupedSemesters(Object.entries(groupBy(selectedPlanData?.semesters, "year")));
    }
  }, [selectedPlanData]);

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
      {/* <Select value={selectedPlanId} onChange={(e) => setSelectedPlanId(e.target.value)}>
        <option value="none">Select a plan</option>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name ?? "My Plan"} {plan.id}
          </option>
        ))}
      </Select> */}

      <div className="flex flex-col gap-8">
        {selectedPlanId !== "none" &&
          groupedSemesters?.map(([year, semesters], index) => (
            <PlannerYear
              key={`year-${year}-${index}`}
              year={Number(year)}
              semesters={semesters}
              deleteSemester={deleteSemester}
            />
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
