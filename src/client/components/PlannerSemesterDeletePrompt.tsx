import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal } from "./form";
import { LoadingIcon } from "./Icons";

interface Props {
  semester: string;
  onClose: () => void;
  onSubmit: () => void;
  open: boolean;
}

const PlannerSemesterDeletePrompt = ({ open, onClose, semester, onSubmit }: Props) => {
  const { token } = useSelector<RootState, AuthState>((state) => state.auth);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const deleteSemester = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/degree-plan/semester/${semester}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      onSubmit();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
    setDeleteLoading(false);
  };

  if (!open) return null;

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-4">
        <h3 className="capitalize">Are you sure you want to delete this semester?</h3>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={deleteSemester}>
            Delete {deleteLoading && <LoadingIcon className="animate-spin text-white" size={25} />}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PlannerSemesterDeletePrompt;
