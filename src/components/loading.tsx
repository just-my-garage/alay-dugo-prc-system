import { Cardio } from "ldrs/react";
import "ldrs/react/Cardio.css";

// Default values shown

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-4">
        <Cardio size="117" stroke="5" speed="3.7" color="red" />
        <h1 className="text-xl font-medium tracking-tighter">
          Saving lives, Join our cause
        </h1>
      </div>
    </div>
  );
};

export default Loading;
