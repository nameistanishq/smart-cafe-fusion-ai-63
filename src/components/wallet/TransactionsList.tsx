
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-cafe-text/70">No transactions yet</p>
      </div>
    );
  }

  const formatDate = (dateStr: Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: Date) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20 overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    {transaction.type === "credit" ? (
                      <ArrowDownLeft className="h-4 w-4 mr-2 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 mr-2 text-red-500" />
                    )}
                    <span className="font-medium text-cafe-text">
                      {transaction.description}
                    </span>
                  </div>
                  <p className="text-xs text-cafe-text/70 mt-1">
                    {formatDate(transaction.createdAt)} at {formatTime(transaction.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`font-bold ${
                      transaction.type === "credit"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}₹
                    {transaction.amount.toFixed(2)}
                  </span>
                  <Badge
                    variant={
                      transaction.status === "completed" ? "default" : "outline"
                    }
                    className={`text-xs mt-1 ${
                      transaction.status === "completed"
                        ? "bg-green-600"
                        : transaction.status === "pending"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  >
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default TransactionsList;
