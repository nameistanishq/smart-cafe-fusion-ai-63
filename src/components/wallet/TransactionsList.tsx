
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWallet } from "@/contexts/WalletContext";
import { ArrowDownCircle, ArrowUpCircle, ShoppingCart, Loader2 } from "lucide-react";

const TransactionsList: React.FC = () => {
  const { transactions, isLoading } = useWallet();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-cafe-primary" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="bg-cafe-surface border-cafe-primary/20">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-cafe-primary/70" />
            <h3 className="text-lg font-medium text-cafe-text">No Transactions Yet</h3>
            <p className="text-cafe-text/70 mt-1">Your transaction history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Sort transactions by date, newest first
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="bg-cafe-surface border-cafe-primary/20">
      <CardHeader>
        <CardTitle className="text-cafe-text">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedTransactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {transaction.type === "deposit" ? (
                    <ArrowDownCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowUpCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-cafe-text">
                    {transaction.type === "deposit" ? "Added Funds" : "Payment"}
                  </h4>
                  <p className="text-cafe-text/70 text-sm">{transaction.description}</p>
                  <p className="text-cafe-text/50 text-xs mt-1">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`font-medium ${
                    transaction.type === "deposit"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.type === "deposit" ? "+" : "-"}₹
                  {transaction.amount.toFixed(2)}
                </span>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className="text-xs border-cafe-primary/20 bg-cafe-primary/5 text-cafe-primary"
                  >
                    {transaction.type}
                  </Badge>
                </div>
              </div>
            </div>
            <Separator className="my-3 bg-cafe-primary/10" />
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
