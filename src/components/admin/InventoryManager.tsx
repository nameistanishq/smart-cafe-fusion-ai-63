
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { useInventory } from "@/contexts/InventoryContext";
import { InventoryItem } from "@/types";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  SortAsc,
  SortDesc,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InventoryManager: React.FC = () => {
  const {
    inventoryItems,
    addItem,
    updateItem,
    isLoading,
    getLowStockItems,
  } = useInventory();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof InventoryItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isSaving, setIsSaving] = useState(false);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState<Omit<InventoryItem, "id">>({
    name: "",
    unit: "kg",
    currentStock: 0,
    lowStockThreshold: 5,
    price: 0,
    lastRestocked: new Date(),
  });

  // Edit item form state
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  const handleAddItem = async () => {
    if (
      !newItem.name ||
      !newItem.unit ||
      newItem.currentStock < 0 ||
      newItem.price <= 0
    ) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please fill all required fields with valid values.",
      });
      return;
    }

    setIsSaving(true);

    try {
      await addItem({
        ...newItem,
        lastRestocked: new Date(),
      });
      setIsAddDialogOpen(false);
      setNewItem({
        name: "",
        unit: "kg",
        currentStock: 0,
        lowStockThreshold: 5,
        price: 0,
        lastRestocked: new Date(),
      });
      toast({
        title: "Item Added",
        description: "The inventory item has been added successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStock = async (
    id: string,
    currentStock: number,
    newStock: number
  ) => {
    if (newStock < 0) {
      toast({
        variant: "destructive",
        title: "Invalid Stock",
        description: "Stock cannot be negative.",
      });
      return;
    }

    try {
      await updateItem(id, {
        currentStock: newStock,
        lastRestocked: newStock > currentStock ? new Date() : undefined,
      });
      toast({
        title: "Stock Updated",
        description: "The inventory stock has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update stock. Please try again.",
      });
    }
  };

  const openEditDialog = (item: InventoryItem) => {
    setEditItem({ ...item });
    setIsEditDialogOpen(true);
  };

  const handleEditItem = async () => {
    if (!editItem) return;

    if (
      !editItem.name ||
      !editItem.unit ||
      editItem.currentStock < 0 ||
      editItem.price <= 0
    ) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please fill all required fields with valid values.",
      });
      return;
    }

    setIsSaving(true);

    try {
      await updateItem(editItem.id, {
        name: editItem.name,
        unit: editItem.unit,
        currentStock: editItem.currentStock,
        lowStockThreshold: editItem.lowStockThreshold,
        price: editItem.price,
      });
      setIsEditDialogOpen(false);
      setEditItem(null);
      toast({
        title: "Item Updated",
        description: "The inventory item has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update item. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort items
  const filteredItems = inventoryItems
    .filter(
      (item) =>
        (showLowStockOnly
          ? item.currentStock <= item.lowStockThreshold
          : true) &&
        (searchTerm
          ? item.name.toLowerCase().includes(searchTerm.toLowerCase())
          : true)
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

  // Count of low stock items
  const lowStockItems = getLowStockItems();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cafe-text/50" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inventory items..."
            className="pl-10 bg-cafe-surface border-cafe-primary/20 text-cafe-text"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`border-cafe-primary/20 ${
              showLowStockOnly
                ? "bg-amber-500/20 text-amber-500"
                : "text-cafe-text hover:bg-cafe-primary/10"
            }`}
          >
            <AlertTriangle
              className={`mr-2 h-4 w-4 ${
                showLowStockOnly ? "text-amber-500" : ""
              }`}
            />
            {showLowStockOnly ? "Show All" : `Low Stock (${lowStockItems.length})`}
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cafe-primary hover:bg-cafe-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
                <DialogDescription className="text-cafe-text/70">
                  Add a new item to your inventory tracking system.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    placeholder="Enter item name"
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentStock">Current Stock</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      value={newItem.currentStock || ""}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          currentStock: parseFloat(e.target.value) || 0,
                        })
                      }
                      min="0"
                      placeholder="0"
                      className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newItem.unit}
                      onChange={(e) =>
                        setNewItem({ ...newItem, unit: e.target.value })
                      }
                      placeholder="kg, liter, etc."
                      className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={newItem.lowStockThreshold || ""}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          lowStockThreshold: parseFloat(e.target.value) || 0,
                        })
                      }
                      min="0"
                      placeholder="5"
                      className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="price">Price per Unit (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newItem.price || ""}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                    />
                  </div>
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
                  onClick={handleAddItem}
                  disabled={isSaving}
                  className="bg-cafe-primary hover:bg-cafe-primary/90"
                >
                  {isSaving ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
                  ) : null}
                  {isSaving ? "Saving..." : "Add Item"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="bg-cafe-surface border-cafe-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-cafe-text">Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-cafe-primary" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8 text-cafe-text/70">
              {searchTerm || showLowStockOnly
                ? "No items match your current filters."
                : "No inventory items found. Add your first item to get started."}
            </div>
          ) : (
            <div className="rounded-md border border-cafe-primary/20 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-cafe-dark hover:bg-cafe-dark/90">
                    <TableHead
                      className="text-cafe-text/70 cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        Item Name
                        {sortField === "name" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <SortAsc className="h-4 w-4" />
                            ) : (
                              <SortDesc className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-cafe-text/70 text-right cursor-pointer"
                      onClick={() => handleSort("currentStock")}
                    >
                      <div className="flex items-center justify-end">
                        Current Stock
                        {sortField === "currentStock" && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? (
                              <SortAsc className="h-4 w-4" />
                            ) : (
                              <SortDesc className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-cafe-text/70 text-center">
                      Unit
                    </TableHead>
                    <TableHead className="text-cafe-text/70 text-right">
                      Status
                    </TableHead>
                    <TableHead className="text-cafe-text/70 text-right">
                      Last Restocked
                    </TableHead>
                    <TableHead className="text-cafe-text/70 text-right">
                      Price (₹)
                    </TableHead>
                    <TableHead className="text-cafe-text/70 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow
                      key={item.id}
                      className="bg-cafe-surface border-t border-cafe-primary/10 hover:bg-cafe-primary/5"
                    >
                      <TableCell className="font-medium text-cafe-text">
                        {item.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-cafe-primary hover:bg-cafe-primary/10"
                            onClick={() =>
                              handleUpdateStock(
                                item.id,
                                item.currentStock,
                                Math.max(0, item.currentStock - 1)
                              )
                            }
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <span
                            className={`${
                              item.currentStock <= item.lowStockThreshold
                                ? "text-amber-500 font-bold"
                                : "text-cafe-text"
                            }`}
                          >
                            {item.currentStock}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-cafe-primary hover:bg-cafe-primary/10"
                            onClick={() =>
                              handleUpdateStock(
                                item.id,
                                item.currentStock,
                                item.currentStock + 1
                              )
                            }
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-cafe-text">
                        {item.unit}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.currentStock <= item.lowStockThreshold ? (
                          <Badge variant="outline" className="bg-amber-500/20 text-amber-500 border-amber-500/40">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge className="bg-green-600">In Stock</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-cafe-text/70">
                        {formatDate(item.lastRestocked)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-cafe-text">
                        {item.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-cafe-primary hover:bg-cafe-primary/10"
                            onClick={() => openEditDialog(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription className="text-cafe-text/70">
              Update the details of this inventory item.
            </DialogDescription>
          </DialogHeader>

          {editItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Item Name</Label>
                <Input
                  id="edit-name"
                  value={editItem.name}
                  onChange={(e) =>
                    setEditItem({ ...editItem, name: e.target.value })
                  }
                  className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-currentStock">Current Stock</Label>
                  <Input
                    id="edit-currentStock"
                    type="number"
                    value={editItem.currentStock || ""}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        currentStock: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-unit">Unit</Label>
                  <Input
                    id="edit-unit"
                    value={editItem.unit}
                    onChange={(e) =>
                      setEditItem({ ...editItem, unit: e.target.value })
                    }
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-lowStockThreshold">
                    Low Stock Threshold
                  </Label>
                  <Input
                    id="edit-lowStockThreshold"
                    type="number"
                    value={editItem.lowStockThreshold || ""}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        lowStockThreshold: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Price per Unit (₹)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editItem.price || ""}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.01"
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditItem}
              disabled={isSaving}
              className="bg-cafe-primary hover:bg-cafe-primary/90"
            >
              {isSaving ? (
                <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin mr-2" />
              ) : null}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManager;
