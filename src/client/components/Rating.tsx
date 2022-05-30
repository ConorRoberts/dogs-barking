import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import RatingData from "@typedefs/RatingData";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Loading, RadioButtonEmptyIcon, RadioButtonFilledIcon } from "./Icons";
import { motion } from "framer-motion";

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

const Rating = ({
  courseId,
  ratingType,
  initialRating,
  name,
  setRatingCount,
  tooltip,
  labelLow,
  labelHigh,
}: RatingProps) => {
  const [mouseIndex, setMouseIndex] = useState(-1);
  const [rating, setRating] = useState(initialRating);
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const [updateLoading, setUpdateLoading] = useState(false);

  const canRateCourse = user && user?.takenCourses.some((e) => e.id === courseId);

  // Update rating on backend
  const submitRating = async ({ ratingValue }: { ratingValue: number }) => {
    if (!user?.token || !canRateCourse) return;

    setUpdateLoading(true);
    setMouseIndex(-1);
    try {
      const { data } = await axios.post<RatingData>(
        `/api/course/${courseId}/rating`,
        {
          courseId,
          ratingValue,
          ratingType,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setRating(data[ratingType]);

      if (setRatingCount) setRatingCount(data.count);
    } catch (error) {
      console.error(error);
    }
    setUpdateLoading(false);
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
                scale: mouseIndex >= index && canRateCourse ? 1.2 : 1,
              }}
              transition={{ duration: 0.1, damping: 10, stiffness: 150, type: "spring" }}
              className={`cursor-pointer ${
                mouseIndex >= index && canRateCourse ? "dark:text-gray-300 text-gray-700" : "dark:text-white"
              }`}
              onMouseEnter={() => setMouseIndex(index)}
              onMouseLeave={() => setMouseIndex(-1)}
              onClick={() => submitRating({ ratingValue: index + 1 })}>
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
    </div>
  );
};

export default Rating;
