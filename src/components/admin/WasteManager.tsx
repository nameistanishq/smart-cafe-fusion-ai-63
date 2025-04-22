
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useWaste } from "@/contexts/WasteContext";
import { useInventory } from "@/contexts/InventoryContext";
import { WasteRecord, InventoryItem } from "@/types";
import { Trash2, PlusCircle, CalendarDays, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const WasteManager: React.FC = () => {
  const { wasteRecords, addWasteRecord, isLoading, getTotalWasteCost } = useWaste();
  const { inventoryItems } = useInventory();
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">("week");

  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    // Process data for charts
    if (wasteRecords.length > 0) {
      processChartData();
      processPieData();
    }
  }, [wasteRecords, timeFrame]);

  const processChartData = () => {
    // Group waste records by day for the chart
    const startDate = new Date();
    if (timeFrame === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeFrame === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    } else {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const filteredRecords = wasteRecords.filter(
      (record) => new Date(record.date) >= startDate
    );

    // Group by day and sum costs
    const groupedData: { [key: string]: number } = {};
    
    filteredRecords.forEach((record) => {
      const dateStr = new Date(record.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      
      if (!groupedData[dateStr]) {
        groupedData[dateStr] = 0;
      }
      groupedData[dateStr] += record.cost;
    });

    // Convert to chart data format
    const chartData = Object.keys(groupedData).map((date) => ({
      date,
      cost: groupedData[date],
    }));

    // Sort by date
    chartData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });

    setChartData(chartData);
  };

  const processPieData = () => {
    // Group waste records by reason for the pie chart
    const groupedData: { [key: string]: number } = {};
    
    wasteRecords.forEach((record) => {
      if (!groupedData[record.reason]) {
        groupedData[record.reason] = 0;
      }
      groupedData[record.reason] += record.cost;
    });

    // Convert to pie chart data format
    const pieData = Object.keys(groupedData).map((reason) => ({
      name: reason,
      value: groupedData[reason],
    }));

    setPieData(pieData);
  };

  const handleSubmit = async () => {
    if (!selectedItem || quantity <= 0 || !reason) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields.",
      });
      return;
    }

    setIsSaving(true);

    try {
      const inventoryItem = inventoryItems.find(
        (item) => item.id === selectedItem
      );
      
      if (!inventoryItem) {
        throw new Error("Selected item not found");
      }

      // Calculate the cost based on inventory item price
      const cost = inventoryItem.price * quantity;

      await addWasteRecord({
        itemName: inventoryItem.name,
        quantity,
        reason,
        cost,
        date: new Date(),
      });

      setIsAddDialogOpen(false);
      setSelectedItem("");
      setQuantity(0);
      setReason("");

      toast({
        title: "Waste Record Added",
        description: "The waste record has been successfully added.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add waste record. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (value: number) => {
    return `₹${value.toFixed(2)}`;
  };

  // Colors for pie chart
  const COLORS = ["#FF7E33", "#8B5CF6", "#10B981", "#F472B6", "#60A5FA"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-cafe-text">Food Waste Management</h2>
          <p className="text-cafe-text/70">
            Track and analyze food waste to optimize inventory and reduce costs
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cafe-primary hover:bg-cafe-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Record Waste
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
            <DialogHeader>
              <DialogTitle>Record Food Waste</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="item">Item</Label>
                <Select
                  value={selectedItem}
                  onValueChange={setSelectedItem}
                >
                  <SelectTrigger
                    id="item"
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  >
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
                    {inventoryItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name} ({item.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity || ""}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="0.1"
                  step="0.1"
                  placeholder="0.0"
                  className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Why is this being wasted?"
                  className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                className="bg-cafe-primary hover:bg-cafe-primary/90"
              >
                {isSaving ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                ) : null}
                {isSaving ? "Saving..." : "Save Record"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center text-cafe-text">
                <DollarSign className="h-5 w-5 mr-2 text-red-500" />
                Total Waste Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cafe-text">
                {formatCurrency(getTotalWasteCost())}
              </div>
              <p className="text-cafe-text/70 text-sm">Last 30 days</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center text-cafe-text">
                <Trash2 className="h-5 w-5 mr-2 text-amber-500" />
                Total Waste Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cafe-text">
                {wasteRecords.length}
              </div>
              <p className="text-cafe-text/70 text-sm">All time records</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center text-cafe-text">
                <CalendarDays className="h-5 w-5 mr-2 text-blue-500" />
                Time Frame
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={timeFrame} onValueChange={(value: any) => setTimeFrame(value)}>
                <SelectTrigger className="bg-cafe-dark border-cafe-primary/20 text-cafe-text">
                  <SelectValue placeholder="Select time frame" />
                </SelectTrigger>
                <SelectContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader>
              <CardTitle className="text-cafe-text">Waste Cost Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="date"
                      stroke="#F8F9FA80"
                      tick={{ fill: "#F8F9FA80", fontSize: 12 }}
                    />
                    <YAxis
                      stroke="#F8F9FA80"
                      tick={{ fill: "#F8F9FA80", fontSize: 12 }}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1E1E1E",
                        borderColor: "#FF7E3340",
                        color: "#F8F9FA",
                      }}
                      formatter={(value: number) => [`₹${value}`, "Cost"]}
                      labelStyle={{ color: "#F8F9FA" }}
                    />
                    <Bar dataKey="cost" fill="#FF7E33" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader>
              <CardTitle className="text-cafe-text">Waste by Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`₹${value}`, "Cost"]}
                      contentStyle={{
                        backgroundColor: "#1E1E1E",
                        borderColor: "#FF7E3340",
                        color: "#F8F9FA",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className="bg-cafe-surface border-cafe-primary/20">
          <CardHeader>
            <CardTitle className="text-cafe-text">Recent Waste Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 rounded-full border-4 border-cafe-primary border-t-transparent animate-spin" />
              </div>
            ) : wasteRecords.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-cafe-text/70">No waste records found</p>
              </div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-cafe-primary/20">
                      <th className="pb-2 font-medium text-cafe-text/70">Date</th>
                      <th className="pb-2 font-medium text-cafe-text/70">Item</th>
                      <th className="pb-2 font-medium text-cafe-text/70">Quantity</th>
                      <th className="pb-2 font-medium text-cafe-text/70">Reason</th>
                      <th className="pb-2 font-medium text-cafe-text/70 text-right">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wasteRecords
                      .slice(0, 10)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record) => (
                        <tr
                          key={record.id}
                          className="border-b border-cafe-primary/10 hover:bg-cafe-primary/5"
                        >
                          <td className="py-3 text-cafe-text">
                            {formatDate(record.date)}
                          </td>
                          <td className="py-3 text-cafe-text">{record.itemName}</td>
                          <td className="py-3 text-cafe-text">
                            {record.quantity} {/* units */}
                          </td>
                          <td className="py-3 text-cafe-text">{record.reason}</td>
                          <td className="py-3 text-cafe-text text-right font-medium text-red-500">
                            {formatCurrency(record.cost)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default WasteManager;
