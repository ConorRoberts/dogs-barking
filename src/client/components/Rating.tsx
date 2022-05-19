import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import RatingData from "@typedefs/RatingData";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { EmptyStarIcon, FilledStarIcon, Loading } from "./Icons";

interface RatingProps {
  courseId: string;
  ratingType: "difficulty" | "usefulness" | "timeSpent";
  initialRating: number;
  name: string;
  setRatingCount?: (count: number) => void;
}

const Rating = ({ courseId, ratingType, initialRating, name, setRatingCount }: RatingProps) => {
  const [mouseIndex, setMouseIndex] = useState(-1);
  const [rating, setRating] = useState(initialRating);
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Update rating on backend
  const submitRating = async ({ ratingValue }: { ratingValue: number }) => {
    if (!user.token) return;

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
    </div>
  );
};

export default Rating;
