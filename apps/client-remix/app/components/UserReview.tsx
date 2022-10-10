import React from "react";

const UserReview = (props) => {
  const { user } = props;
  const { rating } = props;
  return (
    <>
      <div>
        <h4>{user}</h4>
        <p className="block mb-2 text-sm font-medium text-gray-900">{rating}</p>
      </div>
    </>
  );
};

export default UserReview;
