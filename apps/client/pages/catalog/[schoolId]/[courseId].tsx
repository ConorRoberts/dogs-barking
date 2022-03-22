import UserReview from "@components/UserReview";
import UserReviewForm from "@components/UserReviewForm";
import axios from "axios";
import React, { useEffect, useState } from "react";

const defaultRatings = [
  { user: "User 1", reviewContent: "This course was kinda dope." },
  { user: "User 2", reviewContent: "I barely passed, there was a lot of work with no time to do it." },
  {
    user: "User 3",
    reviewContent: "The content in this course is really interesting and great if you like challenging yourself.",
  },
  { user: "User 4", reviewContent: "Great intro course, extra bird" },
];

const page = () => {
  const [courseData, setCourseData] = useState(null);
  const [userRating, setUserRating] = useState([true, true, true, false, false]);

  // fetches course data from API
  useEffect(() => {
    if (courseData !== null) return;
    const path = window.location.pathname.split("/");
    axios
      .get(`/api/db/course/id/${path[3]}`, { params: { id: path[3], school: path[2] } })
      .then((res) => {
        //console.log(res.data.data)
        setCourseData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [courseData]);

  // updates the rating data
  useEffect(() => {
    //TODO: Take user rating state, send off to database
  });

  return (
    <>
      {courseData && (
        <div className="flex flex-col gap-4 mx-auto max-w-6xl w-full">
          <h3 className="text-center">
            {courseData.id}: {courseData.name}
          </h3>
          <h4 className="text-center">Department: {courseData.department}</h4>
          <ul className="flex justify-center">
            {userRating.map((rating) => {
              return rating === true ? (
                <li>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="star"
                    className="w-4 text-yellow-500 mr-1"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512">
                    <path
                      fill="currentColor"
                      d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                  </svg>
                </li>
              ) : (
                <li>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="star"
                    className="w-4 text-yellow-500"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512">
                    <path
                      fill="currentColor"
                      d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path>
                  </svg>
                </li>
              );
            })}
          </ul>
          <p className="text-lg font-medium">{courseData.description} </p>
        </div>
      )}

      <h5 className="text-center mt-6">Total Reviews ({defaultRatings.length})</h5>
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 place-content-center mb-6 h-48 ml-48 mr-48">
          {defaultRatings.map((rating) => {
            return <UserReview user={rating.user} rating={rating.reviewContent} />;
          })}
        </div>
      </div>
      <UserReviewForm />
    </>
  );
};

export default page;
