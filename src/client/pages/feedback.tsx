import { Button, Input, TextArea } from "@components/form";
import React, { useState } from "react";
import axios from "axios";

const FeedbackPage = () => {
  const [heading, setHeading] = useState("");
  const [body, setBody] = useState("");
  const [renderError, setRenderError] = useState(false);
  const [renderSuccess, setRenderSuccess] = useState(false, true);

  const sendFeedback = async () => {
    console.log(heading);
    console.log(body);
    if (!heading || !body) {
        alert("Please enter a heading/message");
        return;
    }
    const response = await axios.post(`http://localhost:3001/api/feedback`, {title: heading, message: body})
      .catch((err) => {
            console.error(err);
            setRenderError(false);
        });
    response.status === 200 && setRenderSuccess(true);
  };
    
  return (
    <div className="flex flex-col">
      {renderError &&
        <div className="flex width-50 justify-center items-end">
            <div className="flex flex-col">
                <p>An error occured when making your request</p>
                <p>Please retry/wait if the error persists</p>
            </div>
            <div className=""> 
                <Button className="" onClick={() => setRenderError(false)}> Ok </Button>
            </div>
        </div>
      }
      {renderSuccess &&
       <div className="flex justify-center width-50 items-end">
            <div className="flex flex-col">
                <p className="py-3">Thank you for your feedback</p>
                <Button className="" onClick={() => setRenderSuccess(false)}> Ok </Button>
            </div>
            <div className=""> 
                
            </div>
        </div>
      }
      <div className="flex flex-col justify-center items-center px-2 py-2">
        <h1>Tell us about your visit!</h1>
        <p>Your feedback is crucial to the improvement of your experience.</p>
      </div>
      <div className="flex items-center justify-center">
        <form onSubmit={sendFeedback}>
          <div id="feedbackHeading" className="flex flex-col items-center justify-center">
            <label className="text-slate-600" htmlFor="headingInput">Message Title</label>
            <Input id="headingInput" onChange={(e) => setHeading(e.target.value)} placeholder="Message Title"/>
          </div>
          <div id="feedbackBody" className="py-1 width-100">
            <TextArea className="w-96 h-48" onChange={(e) => setBody(e.target.value)} placeholder="Enter details about your experience"/>
          </div>
          <div id="submitButton" className="flex justify-center items-center">
            <Button onClick={()=> sendFeedback()}>Submit Feedback</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;