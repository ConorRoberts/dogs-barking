import RatingData from "~/types/RatingData";
import axios from "axios";
import { FC, useState } from "react";
import { Loading, RadioButtonEmptyIcon, RadioButtonFilledIcon } from "./Icons";
import { motion } from "framer-motion";
import { Toast } from "@conorroberts/beluga";
import { useAuthenticator } from "@aws-amplify/ui-react";
import getToken from "~/utils/getToken";

interface RatingProps {
  courseId: string;
  ratingType: "difficulty" | "usefulness" | "timeSpent";
  initialRating: number;
  name: string;
  setRatingCount?: (count: number) => void;
  tooltip: string;
  labelLow?: string;
  labelHigh?: string;
}

const Rating: FC<RatingProps> = ({
  courseId,
  ratingType,
  initialRating,
  name,
  setRatingCount,
  tooltip,
  labelLow,
  labelHigh,
}) => {
  const [mouseIndex, setMouseIndex] = useState(-1);
  const [rating, setRating] = useState(initialRating);
  const [ratingSubmissionError, setRatingSubmissionError] = useState("");
  const { user } = useAuthenticator();
  const [updateLoading, setUpdateLoading] = useState(false);

  // Update rating on backend
  const submitRating = async ({ ratingValue }: { ratingValue: number }) => {
    // Do we already have some error that we're waiting to timeout?
    // This stops overriding the timer on the error message.
    if (ratingSubmissionError.length > 0) {
      return;
    }

    // Check if user can rate course
    if (!user) {
      if (!user) {
        setRatingSubmissionError("You must be logged in to rate courses.");
      } else {
        setRatingSubmissionError("You cannot rate courses you have not taken.");
      }

      return setTimeout(() => {
        setRatingSubmissionError("");
      }, 2500);
    }

    try {
      setMouseIndex(-1);
      setUpdateLoading(true);

      const { data } = await axios.post<RatingData>(
        `/api/course/${courseId}/rating`,
        {
          courseId,
          ratingValue,
          ratingType,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken(user)}`,
          },
        }
      );

      setRating(data[ratingType]);

      if (setRatingCount) setRatingCount(data.count);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 min-w-max">
      <h3 className="text-center">{name}</h3>
      {!updateLoading && (
        <div className="flex gap-1 items-center justify-center">
          {labelLow && <p className="text-sm dark:text-gray-300">{labelLow}</p>}
          {[...new Array(5)].map((_, index) => (
            <motion.div
              key={`rating-star-${index}-${courseId}`}
              animate={{
                scale: mouseIndex >= index ? 1.2 : 1,
              }}
              transition={{ duration: 0.1, damping: 10, stiffness: 150, type: "spring" }}
              className={`cursor-pointer ${
                mouseIndex >= index ? "dark:text-gray-300 text-gray-700" : "dark:text-white"
              }`}
              onMouseEnter={() => setMouseIndex(index)}
              onMouseLeave={() => setMouseIndex(-1)}
              onClick={() => submitRating({ ratingValue: index + 1 })}
            >
              {index + 1 <= rating ? <RadioButtonFilledIcon size={25} /> : <RadioButtonEmptyIcon size={25} />}
            </motion.div>
          ))}
          {labelHigh && <p className="text-sm dark:text-gray-300">{labelHigh}</p>}
        </div>
      )}
      {updateLoading && (
        <motion.div>
          <Loading className="animate-spin text-gray-800 dark:text-gray-400 mx-auto" size={25} />
        </motion.div>
      )}
      <p className="dark:text-gray-400 text-gray-600 text-center text-xs">{tooltip}</p>
      <Toast open={ratingSubmissionError.length > 0} variant="error">
        <p>{ratingSubmissionError}</p>
      </Toast>
    </div>
  );
};

export default Rating;
