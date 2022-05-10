import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import getToken from "@utils/getToken";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { EmptyStarIcon, FilledStarIcon, Loading } from "./Icons";

interface RatingProps {
  courseId: string;
  ratingType: "difficulty" | "usefulness" | "timeSpent";
  initialRating: number;
}

const Rating = ({ courseId, ratingType, initialRating }: RatingProps) => {
  const [mouseIndex, setMouseIndex] = useState(-1);
  const [rating, setRating] = useState(initialRating);
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Update rating on backend
  const submitRating = async ({ ratingValue }: { ratingValue: number }) => {
    setUpdateLoading(true);
    if (!user) return;
    setMouseIndex(-1);
    try {
      const { data } = await axios.post(
        `/api/course/${courseId}/rating`,
        {
          courseId,
          ratingValue,
          ratingType,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      setRating(data[ratingType]);
    } catch (error) {
      console.error(error);
    }
    setUpdateLoading(false);
  };

  return (
    <div>
      {!updateLoading && (
        <div className="flex gap-1 text-2xl">
          {[...new Array(5)].map((_, index) =>
            index + 1 <= rating ? (
              <FilledStarIcon
                className={`transform transition ${
                  mouseIndex >= index && user ? "scale-125 text-yellow-500" : "dark:text-white"
                } cursor-pointer`}
                onMouseEnter={() => setMouseIndex(index)}
                onMouseLeave={() => setMouseIndex(-1)}
                onClick={() => submitRating({ ratingValue: index + 1 })}
                key={`rating-star-${index}-${courseId}`}
              />
            ) : (
              <EmptyStarIcon
                onMouseEnter={() => setMouseIndex(index)}
                onMouseLeave={() => setMouseIndex(-1)}
                className={` transform transition ${
                  mouseIndex >= index && user ? "scale-125 text-yellow-500" : "dark:text-white"
                } cursor-pointer`}
                onClick={() => submitRating({ ratingValue: index + 1 })}
                key={`rating-star-${index}-${courseId}`}
              />
            )
          )}
        </div>
      )}
      {updateLoading && <Loading className="animate-spin w-5 h-5 text-gray-700 dark:text-gray-400 mx-auto mt-2" />}
    </div>
  );
};

export default Rating;
