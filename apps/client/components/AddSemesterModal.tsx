/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { PlannerState, setPlannedSemesters } from "@redux/planner";
import { RootState } from "@redux/store";
import { Semester } from "@typedefs/DegreePlan";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Modal, Select } from "./form";


/**
  * Sets the stateful parameters for the addSemesterModal, and defines its HTML markup / click event listeners.  
  * @param props
  * @returns
*/
export default function AddSemesterModal(props) {

  const {plan:{semesters}} = useSelector<RootState,PlannerState>((state) => state.planner);

  const [semesterName, setSemesterName] = useState("");
  const [semesterTOY, setSemesterTOY] = useState("FALL");
  const [semesterYear, setSemesterYear] = useState("");

  const [isNameError, setIsNameError] = useState(true);
  const [isYearError, setIsYearError] = useState(true);

  const [nameError, setNameError] = useState("");
  const [yearError, setYearError] = useState("");

  const { onClose } = props;

  const dispatch = useDispatch();

  const addSemester = (newName, newTOY, newYear) => {
    const newSemester : Semester = {
      id: crypto.randomUUID(),
      name: newName, 
      timeOfYear: newTOY,
      year: newYear,
      isEditing: false,
      courses: [],
    };

    dispatch(setPlannedSemesters([...semesters,newSemester]));
  };

  /**
   * Checks the input fields of the modal and checks to see if they contain valid information.
   * @returns true  - if the form is valid.
   *          false - otherwise.
   */
  function validateSemester() {
    if (semesterName == "") {
      setIsNameError(true);
      setNameError("Please enter a name for the semester.");
    } else {
      setIsNameError(false);
      setNameError("");
    }

    if (semesterYear == "") {
      setIsYearError(true);
      setYearError("Please enter a year for the semester.");
    } else if (!Number(semesterYear)) {
      setIsYearError(true);
      setYearError("Year must be a number.");
    } else if (Number(semesterYear) % 1 != 0) {
      // Then the number contains a decimal.
      setIsYearError(true);
      setYearError("Year must be a whole number (contain no decimal points).");
    } else if (Number(semesterYear) <= 2020) {
      setIsYearError(true);
      setYearError("Year must be at least 2021 or greater.");
    } else {
      setIsYearError(false);
    }

    if(isNameError || isYearError){
      return false;
    }
    else{
      return true;
    }
  }

  /**
 * Click event that occurs when the 'Add Semester' button is clicked on the modal. 
 * Calls the validate function for the modal to ensure correctness of inputted data.
 * @returns
 */
  function submitSemester() {
    if (validateSemester()) {
      // Then the semester data is valid.
      addSemester(semesterName, semesterTOY, semesterYear);
      // Close the modal.
      onClose();
    }
  }

  return (
    <Modal size="lg" onClose={onClose}>
      <div className="flex flex-col place-content-center">
        <h4 className="font-semibold place-self-center">Add A Semester</h4>

        <label className="mb-1">Semester Name:</label>
        {isNameError ? <p className="text-xs italic text-red-500">{nameError}</p> : null}
        <Input
          value={semesterName}
          onChange={(event) => {
            setSemesterName(event.target.value);
            validateSemester();
          }}
          className="mb-2"
          placeholder="Enter a name for the semester. (e.g 'Semester 1')"
        />

        <label className="mb-1">Time of Year:</label>
        <Select id="timeOfYear" className="mb-2 p-1" value={semesterTOY} onChange={(event) => {
          setSemesterTOY(event.target.value);
          validateSemester();
        }}>
          <option className="p-1" value="FALL">
                    FALL
          </option>
          <option className="p-1" value="WINTER">
                    WINTER
          </option>
          <option className="p-1" value="SUMMER">
                    SUMMER
          </option>
        </Select>

        <label className="mb-1">Year:</label>
        {isYearError ? <p className="text-xs italic text-red-500">{yearError}</p> : null}
        <Input
          value={semesterYear}
          onChange={(event) => {
            setSemesterYear(event.target.value);
            validateSemester();
          }}
          className="mb-2"
          placeholder="Enter the semester's year. (e.g '2022')"
        />

        <div className="flex flex-row place-content-center mt-8 space-x-12">
          <button
            onClick={submitSemester}
            className="w-36 h-8 place-self-start text-white rounded-md bg-green-500 hover:bg-green-600">
                    Add Semester
          </button>
          <button
            onClick={onClose}
            className="w-36 h-8 place-self-start text-white rounded-md bg-red-500 hover:bg-red-600">
                    Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
