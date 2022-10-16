import { useAuthenticator } from "@aws-amplify/ui-react";
import { PlannerSemesterData } from "~/types/DegreePlan";
import getToken from "~/utils/getToken";
import axios from "axios";
import { Field, Form, Formik } from "formik";
import { Button, Input, Modal } from "@conorroberts/beluga";

interface Props {
  open: boolean;
  onClose: () => void;
  semester: PlannerSemesterData;
}

const RequestRegistrationModal = ({ open, onClose, semester }: Props) => {
  const { user } = useAuthenticator();

  return (
    <Modal onOpenChange={onClose} open={open}>
      <h3 className="text-center">Request Automated Registration</h3>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values) => {
          try {
            const { data } = await axios.post(`/api/degree-plan/semester/${semester.id}/request-registration`, values, {
              headers: { Authorization: `Bearer ${getToken(user)}` },
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
