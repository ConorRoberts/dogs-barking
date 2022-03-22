import React, { useState } from "react";
import { Button } from "./form";

/**
 *
 * @returns
 */
const UserReviewForm = () => {
  const [review, setReview] = useState(false);
  const [userReviewContent, setUserReviewContent] = useState("");
  return (
    <div className="self-center">
      {!review && (
        <Button
          className="w-36 h-8 text-white rounded-md bg-blue-500 hover:bg-blue-400"
          onClick={() => setReview(true)}>
          Leave a Review
        </Button>
      )}
      {review && (
        <form id="leaveReview-click" className="md:block dark:bg-gray-500 p-2">
          <div className="mb-6">
            <label htmlFor="review" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              This is where the user will select the rating
            </label>
            <input
              type="text"
              id="review"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="What should others know about the course?"
              required
              onChange={(e) => setUserReviewContent(e.target.value)}></input>
          </div>
          <button
            className="w-36 h-8 text-white rounded-md bg-blue-500 hover:bg-blue-400"
            onClick={() => setReview(false)}>
            Submit rating
          </button>
        </form>
      )}
    </div>
  );
};

export default UserReviewForm;
