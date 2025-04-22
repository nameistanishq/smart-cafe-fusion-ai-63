
import React from "react";
import { motion } from "framer-motion";
import DashboardSummary from "@/components/admin/DashboardSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatBot from "@/components/ai/ChatBot";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardPage: React.FC = () => {
  const [showAiAssistant, setShowAiAssistant] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-cafe-text">Admin Dashboard</h1>
        <Button
          variant="outline"
          className="border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
          onClick={() => setShowAiAssistant(!showAiAssistant)}
        >
          <Bot className="mr-2 h-4 w-4" />
          {showAiAssistant ? "Hide AI Assistant" : "Show AI Assistant"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardSummary />
        </div>
        
        <div>
          {showAiAssistant ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ChatBot />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-cafe-surface border-cafe-primary/20">
                <CardHeader>
                  <CardTitle className="text-cafe-text">System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-cafe-text">Database</span>
                      <span className="text-green-500 font-medium">Healthy</span>
                    </div>
                    <div className="w-full h-2 bg-cafe-dark rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[95%]"></div>
                    </div>
                    <p className="text-xs text-cafe-text/70 mt-1">
                      Last backup: Today, 03:00 AM
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-cafe-text">API Services</span>
                      <span className="text-green-500 font-medium">Online</span>
                    </div>
                    <div className="w-full h-2 bg-cafe-dark rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-[99%]"></div>
                    </div>
                    <p className="text-xs text-cafe-text/70 mt-1">
                      Response time: 62ms
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-cafe-text">Storage</span>
                      <span className="text-amber-500 font-medium">70% Used</span>
                    </div>
                    <div className="w-full h-2 bg-cafe-dark rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[70%]"></div>
                    </div>
                    <p className="text-xs text-cafe-text/70 mt-1">
                      7GB free of 10GB total
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-cafe-text font-medium">System Message</p>
                    <p className="text-cafe-text/70 text-sm mt-1">
                      Next scheduled maintenance: April 30, 2025, 2:00 AM
                    </p>
                    <p className="text-cafe-text/70 text-sm mt-1">
                      All systems operating normally.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
