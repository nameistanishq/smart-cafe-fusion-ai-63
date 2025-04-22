
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Wallet } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

const WalletCard: React.FC = () => {
  const { balance, addTransaction, isLoading } = useWallet();
  const [amount, setAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingFunds, setIsAddingFunds] = useState(false);

  const handleAddFunds = async () => {
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }
    
    setIsAddingFunds(true);
    
    try {
      await addTransaction("deposit", numAmount, "Wallet recharge");
      setAmount("");
      setIsDialogOpen(false);
    } finally {
      setIsAddingFunds(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-cafe-surface border-cafe-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-cafe-text">
            <Wallet className="mr-2 h-5 w-5" />
            Your Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-cafe-text mb-1">
              ₹{balance.toFixed(2)}
            </div>
            <p className="text-cafe-text/70">Available Balance</p>
          </div>
        </CardContent>
        <CardFooter>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-cafe-primary hover:bg-cafe-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Funds
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
              <DialogHeader>
                <DialogTitle>Add Funds to Wallet</DialogTitle>
                <DialogDescription className="text-cafe-text/70">
                  Enter the amount you want to add to your wallet.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount (₹)
                  </label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddFunds}
                  disabled={!amount || isAddingFunds}
                  className="bg-cafe-primary hover:bg-cafe-primary/90"
                >
                  {isAddingFunds ? "Processing..." : "Add Funds"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default WalletCard;
