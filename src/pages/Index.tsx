
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PreLoader from "@/components/PreLoader";

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page after a short delay
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <PreLoader />;
};

export default Index;
