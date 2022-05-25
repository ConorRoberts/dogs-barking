import LoadingScreen from "@components/LoadingScreen";
import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusIcon } from "@components/Icons";
import axios from "axios";
import { groupBy } from "lodash";
import PlannerYear from "@components/PlannerYear";
import { PlannerState, setPlan } from "@redux/planner";
import PlannerSidebar from "@components/PlannerSidebar";

const Page = () => {
  const { user, loading } = useSelector<RootState, AuthState>((state) => state.auth);
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState("none");
  const [groupedSemesters, setGroupedSemesters] = useState([]);
  const [planLoading, setPlanLoading] = useState(false);
  const { plan } = useSelector<RootState, PlannerState>((state) => state.planner);
  const dispatch = useDispatch();

  const deleteSemester = (semesterId: string) => {
    dispatch(
      setPlan({
        ...plan,
        semesters: plan.semesters.filter((semester) => semester.id != semesterId),
      })
    );
  };

  // Add a semester to the selected plan
  const addSemester = async () => {
    try {
      const { data } = await axios.post(
        `/api/degree-plan/${selectedPlanId}/create-semester`,
        {
          userId: user.id,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Update our local state without refetching
      dispatch(setPlan({ ...plan, semesters: [...plan.semesters, data] }));
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Get the user's plans
   */
  const fetchPlans = useCallback(async () => {
    if (!user) return;
    try {
      setPlanLoading(true);
      const { data } = await axios.get(`/api/degree-plan/get-user-plans`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // No plans? Create plan.
      if (data.length === 0) {
        try {
          await axios.post(
            `/api/degree-plan/new`,
            {
              userId: user.id,
            },
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
        } catch (error) {
          console.error(error);
        }
      }

      // Use the first, and ideally only, plan
      setSelectedPlanId(data[0].id);
    } catch (error) {
      console.error(error);
    } finally {
      setPlanLoading(false);
    }
  }, [user]);

  const fetchPlanData = useCallback(async () => {
    try {
      const { data } = await axios.get(`/api/degree-plan/${selectedPlanId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      dispatch(setPlan(data));
    } catch (error) {
      console.error(error);
    }
  }, [user, selectedPlanId, dispatch]);

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
    if (plan) {
      setGroupedSemesters(Object.entries(groupBy(plan?.semesters, "year")));
    }
  }, [plan]);

  if (!user || planLoading) return <LoadingScreen />;

  return (
    <div className="grid flex-1 md:grid-cols-4">
      <div className="p-2 flex flex-col gap-8 mx-auto max-w-4xl w-full overflow-y-auto col-span-3">
        <div>
          <h1 className="text-center">Degree Planner</h1>
        </div>
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
            groupedSemesters
              ?.sort(([a], [b]) => Number(a) - Number(b))
              .map(([year, semesters], index) => (
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
      <PlannerSidebar />
    </div>
  );
};

export default Page;
