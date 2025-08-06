import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin">
        <Loader2 size={30} />
      </div>
    </div>
  );
};

export default Loading;
