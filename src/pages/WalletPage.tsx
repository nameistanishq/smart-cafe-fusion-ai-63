
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useWallet } from "@/contexts/WalletContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from "@/components/ui/dialog";
import { TabsContent, TabsList, TabsTrigger, Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, 
  PlusCircle, 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight,
  Calendar,
  Clock,
  CreditCard as CardIcon,
  BadgeIndianRupee
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WalletPage: React.FC = () => {
  const { balance, transactions, addFunds } = useWallet();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("card");

  const handleAddFunds = async () => {
    setIsLoading(true);
    
    try {
      const numAmount = parseFloat(amount);
      
      if (isNaN(numAmount) || numAmount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid amount to add.",
          variant: "destructive",
        });
        return;
      }
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await addFunds(numAmount);
      setAmount("");
      setIsAddFundsOpen(false);
      
      toast({
        title: "Funds Added Successfully",
        description: `₹${numAmount.toFixed(2)} has been added to your wallet.`,
      });
    } catch (error) {
      console.error("Error adding funds:", error);
      toast({
        title: "Error",
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-cafe-text">Your Wallet</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-2"
        >
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-cafe-text">
                <Wallet className="mr-2 h-5 w-5 text-cafe-primary" />
                Digital Wallet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <p className="text-cafe-text/70">Available Balance</p>
                  <p className="text-3xl font-bold text-cafe-primary">₹{balance.toFixed(2)}</p>
                </div>
                <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-cafe-primary hover:bg-cafe-primary/90">
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
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cafe-text">₹</span>
                          <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="100.00"
                            className="pl-8 bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div
                            className={`p-4 rounded-md border cursor-pointer transition ${
                              selectedPaymentMethod === "card"
                                ? "border-cafe-primary bg-cafe-primary/10"
                                : "border-cafe-primary/20 hover:border-cafe-primary/40"
                            }`}
                            onClick={() => setSelectedPaymentMethod("card")}
                          >
                            <div className="flex items-center justify-center">
                              <CardIcon className="h-5 w-5 text-cafe-primary mr-2" />
                              <span>Card</span>
                            </div>
                          </div>
                          <div
                            className={`p-4 rounded-md border cursor-pointer transition ${
                              selectedPaymentMethod === "upi"
                                ? "border-cafe-primary bg-cafe-primary/10"
                                : "border-cafe-primary/20 hover:border-cafe-primary/40"
                            }`}
                            onClick={() => setSelectedPaymentMethod("upi")}
                          >
                            <div className="flex items-center justify-center">
                              <BadgeIndianRupee className="h-5 w-5 text-cafe-primary mr-2" />
                              <span>UPI</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {selectedPaymentMethod === "card" && (
                        <div className="space-y-4 border border-cafe-primary/20 p-4 rounded-md bg-cafe-dark/30">
                          <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input
                              id="card-number"
                              placeholder="4242 4242 4242 4242"
                              className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input
                                id="expiry"
                                placeholder="MM/YY"
                                className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedPaymentMethod === "upi" && (
                        <div className="space-y-2 border border-cafe-primary/20 p-4 rounded-md bg-cafe-dark/30">
                          <Label htmlFor="upi-id">UPI ID</Label>
                          <Input
                            id="upi-id"
                            placeholder="yourname@upi"
                            className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                          />
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddFundsOpen(false)}
                        className="border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddFunds}
                        disabled={isLoading || !amount || parseFloat(amount) <= 0}
                        className="bg-cafe-primary hover:bg-cafe-primary/90"
                      >
                        {isLoading ? (
                          <>
                            <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          "Add Funds"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-cafe-text">Account Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-cafe-primary/20 flex items-center justify-center">
                  <span className="text-lg font-semibold text-cafe-primary">
                    {user?.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-cafe-text">{user?.name}</p>
                  <p className="text-sm text-cafe-text/70">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-6"
      >
        <Card className="bg-cafe-surface border-cafe-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-cafe-text">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="bg-cafe-dark/50 mb-4">
                <TabsTrigger 
                  value="all"
                  className="data-[state=active]:bg-cafe-primary data-[state=active]:text-white"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="credit"
                  className="data-[state=active]:bg-cafe-primary data-[state=active]:text-white"
                >
                  Added
                </TabsTrigger>
                <TabsTrigger 
                  value="debit"
                  className="data-[state=active]:bg-cafe-primary data-[state=active]:text-white"
                >
                  Spent
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {renderTransactions(transactions)}
              </TabsContent>
              
              <TabsContent value="credit">
                {renderTransactions(transactions.filter(tx => tx.type === "credit"))}
              </TabsContent>
              
              <TabsContent value="debit">
                {renderTransactions(transactions.filter(tx => tx.type === "debit"))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );

  function renderTransactions(txs: any[]) {
    if (txs.length === 0) {
      return (
        <div className="text-center py-6 text-cafe-text/70">
          No transactions found
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {txs.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between border-b border-cafe-primary/10 pb-4"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  transaction.type === "credit"
                    ? "bg-green-500/20 text-green-500"
                    : "bg-red-500/20 text-red-500"
                }`}
              >
                {transaction.type === "credit" ? (
                  <ArrowDownLeft className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-cafe-text">
                  {transaction.description}
                </p>
                <div className="flex items-center text-xs text-cafe-text/70">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>
                    {formatDateTime(transaction.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${
                  transaction.type === "credit"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {transaction.type === "credit" ? "+" : "-"}₹
                {transaction.amount.toFixed(2)}
              </p>
              <Badge
                variant="outline"
                className={`text-xs ${
                  transaction.type === "credit"
                    ? "bg-green-500/10 text-green-500 border-green-500/30"
                    : "bg-red-500/10 text-red-500 border-red-500/30"
                }`}
              >
                {transaction.type === "credit" ? "Added" : "Spent"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default WalletPage;
