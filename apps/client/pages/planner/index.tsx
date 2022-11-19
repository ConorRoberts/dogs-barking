import LoadingScreen from "~/components/LoadingScreen";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { LoadingIcon, PlusIcon } from "~/components/Icons";
import axios from "axios";
import { groupBy } from "lodash";
import MetaData from "~/components/MetaData";
import Requirement from "~/types/Requirement";
import getToken from "~/utils/getToken";
import { useAuthenticator } from "@aws-amplify/ui-react";

const Page = () => {
  const { user } = useAuthenticator();
  const router = useRouter();
  const [majorRequirements, setMajorRequirements] = useState<Requirement[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState("none");
  const [showModal, setShowModal] = useState(false);
  const [groupedSemesters, setGroupedSemesters] = useState([]);
  const [planLoading, setPlanLoading] = useState(false);
  // const { plan } = useSelector<RootState, PlannerState>((state) => state.planner);
  // const dispatch = useDispatch();

  // Add a semester to the selected plan
  const addSemester = async () => {
    try {
      const { data } = await axios.post(
        `/api/degree-plan/${selectedPlanId}/create-semester`,
        {},
        { headers: { Authorization: `Bearer ${getToken(user)}` } }
      );

      // Update our local state without refetching
      // dispatch(setPlan({ ...plan, semesters: [...plan.semesters, data] }));
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
        headers: { Authorization: `Bearer ${getToken(user)}` },
      });

      // No plans? Create plan.
      if (data.length === 0) {
        try {
          await axios.post(`/api/degree-plan/new`, {}, { headers: { Authorization: `Bearer ${getToken(user)}` } });
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
        headers: { Authorization: `Bearer ${getToken(user)}` },
      });
      // dispatch(setPlan(data));
    } catch (error) {
      console.error(error);
    }
  }, [user, selectedPlanId]);

  // Get the user's plan state
  useEffect(() => {
    if (user) {
      fetchPlans();
    } else {
      router.push("/error/403");
    }
  }, [user, router, fetchPlans]);

  // Update the state of our semesters list whenever our selected plan changes
  useEffect(() => {
    if (selectedPlanId === "none") return;
    fetchPlanData();
  }, [fetchPlanData, selectedPlanId]);

  // useEffect(() => {
  //   if (plan) {
  //     setGroupedSemesters(Object.entries(groupBy(plan?.semesters, "year")));
  //   }
  // }, [plan]);

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

  if (!user || (planLoading && selectedPlanId !== "none")) return <LoadingScreen />;

  return (
    <div className="grid flex-1 md:grid-cols-4">
      <MetaData title="Degree Planner" />
      <div className="p-2 flex flex-col gap-8 mx-auto max-w-4xl w-full overflow-y-auto col-span-3">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-center mb-4">Degree Planner</h1>
          <button
            onClick={() => setShowModal(true)}
            className="border-2 rounded-full pt-1 pb-1 pr-2 pl-2 w-40 md:invisible"
          >
            View Progress
          </button>
          {/* <Modal onClose={() => setShowModal(false)} open={showModal}>
            <div className="flex flex-col gap-4">
              <h2 className="text-center">Progress</h2>
              <p>{(currentCredits / neededCredits) * 100} credits / 20</p>
              <div className="h-4 bg-primary-100 overflow-hidden rounded-full">
                <div
                  style={{ width: `${(currentCredits / neededCredits) * 100}%` }}
                  className="bg-primary-500 h-full"
                ></div>
              </div>
            </div>
          </Modal> */}
        </div>

        {/* <Select value={selectedPlanId} onChange={(e) => setSelectedPlanId(e.target.value)}>
        <option value="none">Select a plan</option>
        {plans.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.name ?? "My Plan"} {plan.id}
          </option>
        ))}
      </Select> */}

        {/* <div className="flex flex-col gap-8">
          {selectedPlanId !== "none" &&
            groupedSemesters
              ?.sort(([a], [b]) => Number(a) - Number(b))
              .map(([year, semesters], index) => (
                <PlannerYear key={`year-${year}-${index}`} year={Number(year)} semesters={semesters} />
              ))}
          <PlusIcon
            size={30}
            className="rounded-full p-1 border border-gray-400 cursor-pointer text-gray-400 mx-auto"
            onClick={addSemester}
          />
        </div> */}
        {(!user || (planLoading && selectedPlanId !== "none")) && (
          <div className="flex justify-center my-6">
            <LoadingIcon className="animate-spin" size={25} />
          </div>
        )}
      </div>
      {/* <PlannerSidebar /> */}
    </div>
  );
};

export default Page;
