import { AuthState } from "@redux/auth";
import { RootState } from "@redux/store";
import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { EmptyStarIcon, FilledStarIcon, Loading } from "./Icons";

interface RatingProps {
  nodeId: string;
  ratingType: "difficulty" | "usefulness" | "timeSpent";
  initialRating: number;
}

const Rating = ({ nodeId, ratingType, initialRating }: RatingProps) => {
  const [mouseIndex, setMouseIndex] = useState(-1);
  const [rating, setRating] = useState(initialRating);
  const { user } = useSelector<RootState, AuthState>((state) => state.auth);

  // Update rating on backend
  const { isLoading: submitRatingLoading, mutate: submitRating } = useMutation(
    async ({ rating }: { rating: number }) => {
      if (!user) return;
      setMouseIndex(-1);
      try {
        const { data } = await axios.post("/api/rating", {
          courseNodeId: nodeId,
          userId: user.sub,
          rating,
          ratingType,
        });

        setRating(data[ratingType]);
      } catch (error) {
        console.error(error);
      }
    }
  );
  return (
    <div>
      {!submitRatingLoading && (
        <div className="flex gap-1 text-2xl">
          {[...new Array(5)].map((_, index) =>
            index + 1 <= rating ? (
              <FilledStarIcon
                className={`transform transition ${
                  mouseIndex >= index && user ? "scale-125 text-yellow-500" : "dark:text-white"
                } cursor-pointer`}
                onMouseEnter={() => setMouseIndex(index)}
                onMouseLeave={() => setMouseIndex(-1)}
                onClick={() => submitRating({ rating: index + 1 })}
                key={`rating-star-${index}-${nodeId}`}
              />
            ) : (
              <EmptyStarIcon
                onMouseEnter={() => setMouseIndex(index)}
                onMouseLeave={() => setMouseIndex(-1)}
                className={` transform transition ${
                  mouseIndex >= index && user ? "scale-125 text-yellow-500" : "dark:text-white"
                } cursor-pointer`}
                onClick={() => submitRating({ rating: index + 1 })}
                key={`rating-star-${index}-${nodeId}`}
              />
            )
          )}
        </div>
      )}
      {submitRatingLoading && (
        <Loading className="animate-spin w-5 h-5 text-gray-700 dark:text-gray-400 mx-auto mt-2" />
      )}
    </div>
  );
};

export default Rating;
