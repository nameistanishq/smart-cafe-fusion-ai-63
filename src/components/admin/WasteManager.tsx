
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWaste } from "@/contexts/WasteContext";
import { WasteRecord } from "@/types";
import {
  Search,
  Plus,
  Trash2,
  Info,
  BarChart3,
  PieChart,
  CalendarRange,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

const WasteManager: React.FC = () => {
  const { wasteRecords, addRecord, getTotalWasteCost, isLoading } = useWaste();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New waste record form state
  const [newRecord, setNewRecord] = useState<Omit<WasteRecord, "id">>({
    itemName: "",
    quantity: 0,
    reason: "End of day leftovers",
    date: new Date(),
    cost: 0,
  });

  const handleAddRecord = async () => {
    if (!newRecord.itemName || newRecord.quantity <= 0 || newRecord.cost <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please fill all required fields with valid values.",
      });
      return;
    }

    setIsSaving(true);

    try {
      await addRecord({
        ...newRecord,
        date: new Date(),
      });
      setIsAddDialogOpen(false);
      setNewRecord({
        itemName: "",
        quantity: 0,
        reason: "End of day leftovers",
        date: new Date(),
        cost: 0,
      });
      toast({
        title: "Record Added",
        description: "The waste record has been added successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add record. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Filter records
  const filteredRecords = wasteRecords.filter((record) =>
    record.itemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get statistics for charts
  const getChartData = () => {
    // Group by reasons
    const reasonsData = filteredRecords.reduce((acc, record) => {
      const reason = record.reason;
      if (!acc[reason]) {
        acc[reason] = {
          name: reason,
          value: 0,
          cost: 0,
        };
      }
      acc[reason].value += record.quantity;
      acc[reason].cost += record.cost;
      return acc;
    }, {} as Record<string, { name: string; value: number; cost: number }>);

    // Group by item names (top items)
    const itemsData = filteredRecords.reduce((acc, record) => {
      const item = record.itemName;
      if (!acc[item]) {
        acc[item] = {
          name: item,
          value: 0,
          cost: 0,
        };
      }
      acc[item].value += record.quantity;
      acc[item].cost += record.cost;
      return acc;
    }, {} as Record<string, { name: string; value: number; cost: number }>);

    // Sort by cost and limit to top 5
    const topItems = Object.values(itemsData)
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5);

    // Group by date (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const dailyData: Record<string, { date: string; cost: number }> = {};

    // Initialize all days in the past week
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = { date: dateStr, cost: 0 };
    }

    // Fill in data
    filteredRecords.forEach((record) => {
      const recordDate = new Date(record.date);
      if (recordDate >= oneWeekAgo) {
        const dateStr = recordDate.toISOString().split('T')[0];
        if (dailyData[dateStr]) {
          dailyData[dateStr].cost += record.cost;
        }
      }
    });

    return {
      reasonsData: Object.values(reasonsData),
      topItems,
      dailyData: Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date)),
    };
  };

  const { reasonsData, topItems, dailyData } = getChartData();

  // Chart colors
  const colors = ["#FF7E33", "#8B5CF6", "#10B981", "#F472B6", "#60A5FA"];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (value: number) => {
    return `₹${value.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cafe-text/50" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search waste records..."
            className="pl-10 bg-cafe-surface border-cafe-primary/20 text-cafe-text"
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cafe-primary hover:bg-cafe-primary/90">
              <Plus className="mr-2 h-4 w-4" /> Add Waste Record
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
            <DialogHeader>
              <DialogTitle>Add Waste Record</DialogTitle>
              <DialogDescription className="text-cafe-text/70">
                Document food waste for better inventory management.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  value={newRecord.itemName}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, itemName: e.target.value })
                  }
                  placeholder="Enter item name"
                  className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newRecord.quantity || ""}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        quantity: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.1"
                    placeholder="0"
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cost">Cost Value (₹)</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={newRecord.cost || ""}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        cost: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  value={newRecord.reason}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, reason: e.target.value })
                  }
                  placeholder="Explain the reason for waste"
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
                onClick={handleAddRecord}
                disabled={isSaving}
                className="bg-cafe-primary hover:bg-cafe-primary/90"
              >
                {isSaving ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                ) : null}
                {isSaving ? "Saving..." : "Add Record"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-cafe-surface border-cafe-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-cafe-primary" />
              <h3 className="text-lg font-medium text-cafe-text">
                Total Waste Cost
              </h3>
            </div>
            <div className="mt-2 text-2xl font-bold text-cafe-text">
              {formatCurrency(getTotalWasteCost())}
            </div>
            <p className="text-xs text-cafe-text/70 mt-1">
              Cumulative waste value
            </p>
          </CardContent>
        </Card>

        <Card className="bg-cafe-surface border-cafe-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-cafe-secondary" />
              <h3 className="text-lg font-medium text-cafe-text">
                Total Incidents
              </h3>
            </div>
            <div className="mt-2 text-2xl font-bold text-cafe-text">
              {wasteRecords.length}
            </div>
            <p className="text-xs text-cafe-text/70 mt-1">
              Recorded waste incidents
            </p>
          </CardContent>
        </Card>

        <Card className="bg-cafe-surface border-cafe-primary/20 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Info className="h-5 w-5 text-cafe-accent" />
              <h3 className="text-lg font-medium text-cafe-text">Waste Insights</h3>
            </div>
            <p className="mt-2 text-cafe-text/70">
              Top waste reasons: 
              {reasonsData.length > 0 
                ? ` ${reasonsData
                    .sort((a, b) => b.cost - a.cost)
                    .slice(0, 3)
                    .map(r => r.name)
                    .join(', ')}`
                : ' No data available'
              }
            </p>
            <p className="mt-1 text-cafe-text/70">
              Most wasted item: 
              {topItems.length > 0 
                ? ` ${topItems[0].name} (${formatCurrency(topItems[0].cost)})`
                : ' No data available'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="records" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto bg-cafe-surface">
          <TabsTrigger value="records" className="data-[state=active]:bg-cafe-primary data-[state=active]:text-white">
            Records
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-cafe-primary data-[state=active]:text-white">
            Trends
          </TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-cafe-primary data-[state=active]:text-white">
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="mt-4">
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-cafe-text">Waste Records</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-cafe-primary" />
                </div>
              ) : filteredRecords.length === 0 ? (
                <div className="text-center py-8 text-cafe-text/70">
                  {searchTerm
                    ? "No records match your search."
                    : "No waste records found. Start tracking food waste to optimize your inventory."}
                </div>
              ) : (
                <div className="rounded-md border border-cafe-primary/20 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-cafe-dark hover:bg-cafe-dark/90">
                        <TableHead className="text-cafe-text/70">
                          Item Name
                        </TableHead>
                        <TableHead className="text-cafe-text/70 text-right">
                          Quantity
                        </TableHead>
                        <TableHead className="text-cafe-text/70">
                          Reason
                        </TableHead>
                        <TableHead className="text-cafe-text/70 text-right">
                          Cost Value
                        </TableHead>
                        <TableHead className="text-cafe-text/70 text-right">
                          Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow
                          key={record.id}
                          className="bg-cafe-surface border-t border-cafe-primary/10 hover:bg-cafe-primary/5"
                        >
                          <TableCell className="font-medium text-cafe-text">
                            {record.itemName}
                          </TableCell>
                          <TableCell className="text-right text-cafe-text">
                            {record.quantity}
                          </TableCell>
                          <TableCell className="text-cafe-text/70">
                            {record.reason}
                          </TableCell>
                          <TableCell className="text-right font-medium text-cafe-text">
                            {formatCurrency(record.cost)}
                          </TableCell>
                          <TableCell className="text-right text-cafe-text/70">
                            {formatDate(record.date)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card className="bg-cafe-surface border-cafe-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-cafe-text">
                <CalendarRange className="mr-2 h-5 w-5 text-cafe-primary" />
                Daily Waste Trends (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF20" />
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
                        color: "#F8F9FA"
                      }}
                      formatter={(value: number) => [`₹${value}`, "Waste Cost"]}
                      labelStyle={{ color: "#F8F9FA" }}
                    />
                    <Bar dataKey="cost" fill="#FF7E33" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="mt-4">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <Card className="bg-cafe-surface border-cafe-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-cafe-text">
                  <PieChart className="mr-2 h-5 w-5 text-cafe-secondary" />
                  Waste by Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={reasonsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={3}
                        dataKey="cost"
                        label={({ name }) => name}
                        labelLine={{ stroke: "#F8F9FA40" }}
                      >
                        {reasonsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1E1E1E", 
                          borderColor: "#FF7E3340",
                          color: "#F8F9FA"
                        }}
                        formatter={(value: number) => [`₹${value}`, "Cost"]}
                        labelStyle={{ color: "#F8F9FA" }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-cafe-surface border-cafe-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center text-cafe-text">
                  <BarChart3 className="mr-2 h-5 w-5 text-cafe-accent" />
                  Top Wasted Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topItems}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#FFFFFF20" />
                      <XAxis 
                        type="number" 
                        stroke="#F8F9FA80"
                        tick={{ fill: "#F8F9FA80", fontSize: 12 }}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        stroke="#F8F9FA80"
                        tick={{ fill: "#F8F9FA80", fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1E1E1E", 
                          borderColor: "#FF7E3340",
                          color: "#F8F9FA"
                        }}
                        formatter={(value: number) => [`₹${value}`, "Waste Cost"]}
                        labelStyle={{ color: "#F8F9FA" }}
                      />
                      <Bar dataKey="cost" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WasteManager;
