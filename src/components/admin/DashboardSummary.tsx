
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useWaste } from "@/contexts/WasteContext";
import { useAi } from "@/contexts/AiContext";
import { TrendingUp, ShoppingCart, DollarSign, Boxes, BarChart3, AlertTriangle, Sparkles } from "lucide-react";

const DashboardSummary: React.FC = () => {
  const { analytics, isLoading: isAnalyticsLoading } = useAnalytics();
  const { getLowStockItems } = useInventory();
  const { aiSuggestions } = useAi();
  const { getTotalWasteCost } = useWaste();

  const lowStockItems = getLowStockItems();
  const wasteTotal = getTotalWasteCost();

  // Color palette for charts
  const colors = {
    primary: "#FF7E33",
    secondary: "#8B5CF6",
    accent: "#10B981",
    background: "#121212",
    surface: "#1E1E1E",
    text: "#F8F9FA",
    chart: ["#FF7E33", "#8B5CF6", "#10B981", "#F472B6", "#60A5FA"]
  };

  const pieData = analytics?.popularItems.slice(0, 5).map(item => ({
    name: item.name,
    value: item.totalSold
  })) || [];

  // Format currency
  const formatCurrency = (value: number) => {
    return `₹${value.toFixed(2)}`;
  };

  // Empty states for loading
  if (isAnalyticsLoading || !analytics) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="bg-cafe-surface border-cafe-primary/20">
            <CardContent className="p-6">
              <div className="h-24 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-4 border-cafe-primary/30 border-t-cafe-primary animate-spin"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-cafe-text">
                Today's Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-cafe-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cafe-text">
                {formatCurrency(analytics.dailySales[analytics.dailySales.length - 1].revenue)}
              </div>
              <p className="text-xs text-cafe-text/70 mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+{((analytics.dailySales[analytics.dailySales.length - 1].revenue / analytics.dailySales[analytics.dailySales.length - 2].revenue - 1) * 100).toFixed(1)}%</span> from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-cafe-text">
                Orders Today
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-cafe-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cafe-text">
                {analytics.dailySales[analytics.dailySales.length - 1].orders}
              </div>
              <p className="text-xs text-cafe-text/70 mt-1">
                <TrendingUp className="h-3 w-3 inline mr-1 text-green-500" />
                <span className="text-green-500 font-medium">+{((analytics.dailySales[analytics.dailySales.length - 1].orders / analytics.dailySales[analytics.dailySales.length - 2].orders - 1) * 100).toFixed(1)}%</span> from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-cafe-text">
                Low Stock Items
              </CardTitle>
              <Boxes className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cafe-text">
                {lowStockItems.length}
              </div>
              <p className="text-xs text-cafe-text/70 mt-1">
                {lowStockItems.length > 0 ? (
                  <span className="text-amber-500 font-medium flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Requires attention
                  </span>
                ) : (
                  <span className="text-green-500 font-medium">All items well-stocked</span>
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-cafe-text">
                Food Waste Value
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cafe-text">
                {formatCurrency(wasteTotal)}
              </div>
              <p className="text-xs text-cafe-text/70 mt-1">
                <span className="text-red-500 font-medium">Last 7 days waste cost</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader>
              <CardTitle className="text-cafe-text">Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analytics.dailySales}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8}/>
                        <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      stroke={colors.text + "80"}
                      tick={{ fill: colors.text + "80", fontSize: 12 }}
                    />
                    <YAxis 
                      stroke={colors.text + "80"}
                      tick={{ fill: colors.text + "80", fontSize: 12 }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.text + "20"} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: colors.surface, 
                        borderColor: colors.primary + "40",
                        color: colors.text
                      }}
                      formatter={(value: number) => [`₹${value}`, "Revenue"]}
                      labelStyle={{ color: colors.text }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke={colors.primary} 
                      fillOpacity={1}
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader>
              <CardTitle className="text-cafe-text">Popular Items</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <div className="flex flex-col md:flex-row items-center justify-between h-full">
                    <div className="w-full md:w-1/2 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={3}
                            dataKey="value"
                            label={({ name }) => name}
                            labelLine={false}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={colors.chart[index % colors.chart.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: colors.surface, 
                              borderColor: colors.primary + "40",
                              color: colors.text
                            }}
                            formatter={(value: number) => [`${value} units`, "Sold"]}
                            labelStyle={{ color: colors.text }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analytics.popularItems.slice(0, 5)}
                          layout="vertical"
                          margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
                        >
                          <XAxis 
                            type="number" 
                            stroke={colors.text + "80"}
                            tick={{ fill: colors.text + "80", fontSize: 12 }}
                          />
                          <YAxis 
                            type="category" 
                            dataKey="name" 
                            stroke={colors.text + "80"}
                            tick={{ fill: colors.text + "80", fontSize: 12 }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: colors.surface, 
                              borderColor: colors.primary + "40",
                              color: colors.text
                            }}
                            formatter={(value: number) => [`${value} units`, "Sold"]}
                            labelStyle={{ color: colors.text }}
                          />
                          <Bar dataKey="totalSold" fill={colors.secondary} radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card className="bg-cafe-surface border-cafe-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center text-cafe-text">
              <Sparkles className="mr-2 h-5 w-5 text-cafe-secondary" />
              AI Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-cafe-primary/20 bg-cafe-dark"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-cafe-text font-medium">{suggestion.title}</h3>
                    <Badge className={`${
                      suggestion.priority === "high" 
                        ? "bg-red-500"
                        : suggestion.priority === "medium"
                        ? "bg-amber-500"
                        : "bg-green-500"
                    }`}>
                      {suggestion.priority} priority
                    </Badge>
                  </div>
                  <p className="text-cafe-text/70 text-sm">{suggestion.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardSummary;
