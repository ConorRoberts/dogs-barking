import Button from "@components/form/Button";
import { PlannerState } from "@redux/planner";
import { RootState } from "@redux/store";
import { useSelector } from "react-redux";
import { useState } from "react";

const Page = () => {
  const { plan } = useSelector<RootState, PlannerState>((state) => state.planner);
  const [showPrintHelp, setShowPrintHelp] = useState(false);

  const isPlannerStateEmpty = () => {
    if (plan.semesters.length == 0) {
      return true;
    }

    return false;
  };

  return (
    <>
      <div className="flex flex-col place-self-center justify-center">
        <div className="flex flex-col p-3 m-2 w-full rounded-3xl place-self-center justify-center bg-neutral-200">
          <div className="flex flex-col place-self-center p-2 w-full rounded-3xl justify-center bg-neutral-50">
            <h2 className="place-self-center">Plan Overview</h2>
            {isPlannerStateEmpty() ? (
              <p className="text-2xl p-4 max-w-screen-md">
                Nothing to show yet. Try creating a plan with some content in it and come back later.
              </p>
            ) : (
              <div>
                {plan.name == "" ? (
                  <h3 className="py-2 text-center font-medium">Untitled Plan</h3>
                ) : (
                  <h3 className="py-2 text-center font-medium">{plan.name}</h3>
                )}
                {plan.department == "" ? (
                  <h4 className="py-2 text-center font-medium">Unknown Department</h4>
                ) : (
                  <h4 className="py-2 text-center font-medium">{plan.department}</h4>
                )}
                <div className="py-1 px-0">
                  {plan.semesters.map((semester, index) => (
                    <div className="place-content-center p-2 m-4 bg-neutral-200 rounded-3xl" key={`view-plan-${index}`}>
                      <h5 className="font-semibold underline">
                        {" "}
                        {semester.name} - {semester.timeOfYear} {semester.year}
                      </h5>
                      <ul className="bg-white rounded-r-2xl rounded-l-lg pb-1" key={Math.random()}>
                        {semester.courses.map((course) => {
                          return (
                            <li className="indent-6 pt-1 pr-1" key={Math.random()}>
                              {course.id} - {course.name} ({course.weight} credits)
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {!isPlannerStateEmpty() ? (
        <>
          <Button
            className={
              showPrintHelp
                ? "w-30 place-self-center rounded-md mt-8 bg-blue-500 hover:bg-blue-700"
                : "w-30 place-self-center rounded-md mt-8 bg-green-500 hover:bg-green-700"
            }
            onClick={() => setShowPrintHelp(!showPrintHelp)}>
            {showPrintHelp ? "Hide Print Help" : "Show Print Help"}
          </Button>
          <footer className={showPrintHelp ? "flex flex-col w-full" : "hidden"}>
            <p className="italic place-self-center mt-4 text-lg">
              Looking to print this page? Try pressing CTRL+P on Windows or Command+P on Mac
            </p>
          </footer>
        </>
      ) : null}
    </>
  );
};

export default Page;
