
import React from "react";
import WasteManager from "@/components/admin/WasteManager";

const WastePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-cafe-text">Food Waste Management</h1>
      <WasteManager />
    </div>
  );
};

export default WastePage;
