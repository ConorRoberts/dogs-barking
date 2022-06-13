import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import { PlannerSemesterData } from "@typedefs/DegreePlan";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { useSelector } from "react-redux";
import { Button, Input, Modal } from "./form";

interface Props {
  open: boolean;
  onClose: () => void;
  semester: PlannerSemesterData;
}

const RequestRegistrationModal = ({ open, onClose, semester }: Props) => {
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  return (
    <Modal onClose={onClose} open={open} className="max-w-lg">
      <h3 className="text-center">Request Automated Registration</h3>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values) => {
          try {
            const { data } = await axios.post(`/api/degree-plan/semester/${semester.id}/request-registration`, values, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            console.log(data);
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <Form>
          <div className="flex flex-col gap-4 mt-8">
            <Field name="username" placeholder="Username" component={Input} />
            <Field name="password" type="password" placeholder="Password" component={Input} />
            <div className="mx-auto">
              <Button type="submit">Submit Request</Button>
            </div>
          </div>
        </Form>
      </Formik>
    </Modal>
  );
};

export default RequestRegistrationModal;
