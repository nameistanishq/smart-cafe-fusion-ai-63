
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import RazorpayCheckout from '@/components/payment/RazorpayCheckout';

const WalletOperations: React.FC = () => {
  const { balance, addTransaction, refreshWallet } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>('');
  const [showRazorpay, setShowRazorpay] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimals
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const handleAddMoney = () => {
    setShowRazorpay(true);
  };

  const handleWithdrawMoney = async () => {
    const withdrawAmount = parseFloat(amount);
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Please enter a valid amount to withdraw.",
      });
      return;
    }

    if (withdrawAmount > balance) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "You don't have enough balance to withdraw this amount.",
      });
      return;
    }

    setIsWithdrawing(true);
    
    try {
      await addTransaction('withdrawal', withdrawAmount, 'Wallet withdrawal');
      setAmount('');
      toast({
        title: "Withdrawal Successful",
        description: `₹${withdrawAmount} has been withdrawn from your wallet.`,
      });
      
      // Refresh wallet balance
      await refreshWallet();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Withdrawal Failed",
        description: "Failed to process your withdrawal. Please try again.",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleRazorpaySuccess = async (orderId: string) => {
    setShowRazorpay(false);
    const addAmount = parseFloat(amount);
    
    setIsAdding(true);
    
    try {
      await addTransaction('deposit', addAmount, 'Wallet top-up', orderId);
      setAmount('');
      toast({
        title: "Deposit Successful",
        description: `₹${addAmount} has been added to your wallet.`,
      });
      
      // Refresh wallet balance
      await refreshWallet();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Deposit Failed",
        description: "Failed to update your wallet. Please contact support.",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRazorpayFailure = (error: string) => {
    setShowRazorpay(false);
    toast({
      variant: "destructive",
      title: "Payment Failed",
      description: error,
    });
  };

  return (
    <Card className="bg-cafe-surface border-cafe-primary/20">
      <CardHeader>
        <CardTitle className="text-cafe-text">Wallet Operations</CardTitle>
        <CardDescription className="text-cafe-text/70">
          Add or withdraw money from your wallet
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-cafe-text">Amount (₹)</Label>
          <Input
            id="amount"
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {showRazorpay ? (
            <RazorpayCheckout 
              amount={parseFloat(amount) || 0}
              onSuccess={handleRazorpaySuccess}
              onFailure={handleRazorpayFailure}
            />
          ) : (
            <Button
              onClick={handleAddMoney}
              disabled={!amount || parseFloat(amount) <= 0 || isAdding}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isAdding ? (
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
              ) : (
                <PlusCircle className="h-4 w-4 mr-2" />
              )}
              Add Money
            </Button>
          )}
          
          <Button
            onClick={handleWithdrawMoney}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance || isWithdrawing}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isWithdrawing ? (
              <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-2" />
            )}
            Withdraw
          </Button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-cafe-primary/10">
          <div className="flex justify-between">
            <span className="text-cafe-text/70">Available Balance:</span>
            <span className="text-cafe-primary font-bold">₹{balance.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletOperations;
