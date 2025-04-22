
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/shared/PageContainer";
import PageHeader from "@/components/shared/PageHeader";
import WalletCard from "@/components/wallet/WalletCard";
import TransactionsList from "@/components/wallet/TransactionsList";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const WalletPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-cafe-dark min-h-screen">
      <PageContainer>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PageHeader
            title="Wallet"
            description="Manage your wallet and transactions"
            action={
              <Button
                variant="outline"
                onClick={() => navigate("/menu")}
                className="border-cafe-primary/20 text-cafe-text hover:bg-cafe-primary/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Menu
              </Button>
            }
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1"
          >
            <WalletCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <TransactionsList />
          </motion.div>
        </div>
      </PageContainer>
    </div>
  );
};

export default WalletPage;
