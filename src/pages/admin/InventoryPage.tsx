
import React from "react";
import InventoryManager from "@/components/admin/InventoryManager";

const InventoryPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-cafe-text">Inventory Management</h1>
      <InventoryManager />
    </div>
  );
};

export default InventoryPage;
