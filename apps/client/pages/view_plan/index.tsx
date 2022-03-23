import { PlannerState, setPlannedSemesters } from "@redux/planner";
import { RootState } from "@redux/store";
import { Course } from "@typedefs/DegreePlan";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Page = () => {
  const { plan } = useSelector<RootState, PlannerState>((state) => state.planner);
  //const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  const isPlannerStateEmpty = () => {
    if(plan.name === "" && plan.semesters.length == 0 && plan.department === ""){
      return true;
    }

    return false;
  };

  return (
    <div className="flex flex-col place-self-center justify-center">
      <h2 className="place-self-center">Plan Overview</h2>
      {isPlannerStateEmpty() === true ? 
        <p className="text-2xl pt-10 max-w-screen-md" >
          Nothing to show yet. Try creating a plan with some content in it and come back later.
        </p> 
        :
        <div>
          {plan.name == "" ? <h3 className="py-4 text-center font-medium">Untitled Plan</h3> : <h3 className="py-4 text-center font-medium">{plan.name}</h3>}
          {plan.department == "" ? <h4 className="py-4 text-center font-medium">Summary for Unnamed Degree</h4> : 
            <h4 className="py-4 text-center font-medium">Summary for {plan.department}</h4> 
          }
          <h4 className="py-4 text-center font-medium">Breakdown of Semesters:</h4>
          { plan.semesters.map((semester) => {
            return (
              <div className="place-content-center">
                <h5 className="font-semibold"> {semester.name} - {semester.timeOfYear} {semester.year}</h5>
                <ul key={Math.random()}>
                  {semester.courses.map((course) => {
                    return(
                      <li className="indent-6" key={Math.random()}>{course.name} ({course.weight} credits)</li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      }
    
    </div>
  );
};

export default Page;
