
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useMenu } from "@/contexts/MenuContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MenuItem } from "@/types";
import {
  Search,
  Plus,
  Edit,
  Tag,
  Grid,
  List,
  Filter,
  MoreVertical,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MenuManagerPage: React.FC = () => {
  const { menuItems, isLoading, addMenuItem, updateMenuItem, toggleItemAvailability } = useMenu();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showUnavailable, setShowUnavailable] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);

  // New menu item state
  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    category: "",
    tags: [],
    isAvailable: true,
    image: "/assets/menu/placeholder.jpg",
    ingredients: [],
  });

  // Get all categories from menu items
  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  ).sort();

  // Get all tags from menu items
  const allTags = Array.from(
    new Set(menuItems.flatMap((item) => item.tags))
  ).sort();

  // Filter menu items based on search, category, and availability
  const filteredItems = menuItems.filter(
    (item) =>
      (showUnavailable || item.isAvailable) &&
      (selectedCategory === null || item.category === selectedCategory) &&
      (searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  const handleAddItem = async () => {
    if (
      !newItem.name ||
      !newItem.description ||
      !newItem.category ||
      newItem.price <= 0
    ) {
      toast({
        title: "Invalid Input",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Format ingredients and tags
      const formattedIngredients = newItem.ingredients;
      const formattedTags = newItem.tags.filter((tag) => tag.trim() !== "");

      // Add menu item
      await addMenuItem({
        ...newItem,
        ingredients: formattedIngredients,
        tags: formattedTags,
      });

      // Reset form
      setNewItem({
        name: "",
        description: "",
        price: 0,
        category: "",
        tags: [],
        isAvailable: true,
        image: "/assets/menu/placeholder.jpg",
        ingredients: [],
      });

      // Close dialog
      setIsAddDialogOpen(false);

      toast({
        title: "Item Added",
        description: "The menu item has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast({
        title: "Error",
        description: "Failed to add menu item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditItem = async () => {
    if (!editItem) return;

    if (
      !editItem.name ||
      !editItem.description ||
      !editItem.category ||
      editItem.price <= 0
    ) {
      toast({
        title: "Invalid Input",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Format ingredients and tags
      const formattedIngredients = editItem.ingredients;
      const formattedTags = editItem.tags.filter((tag) => tag.trim() !== "");

      // Update menu item
      await updateMenuItem(editItem.id, {
        ...editItem,
        ingredients: formattedIngredients,
        tags: formattedTags,
      });

      // Close dialog
      setIsEditDialogOpen(false);
      setEditItem(null);

      toast({
        title: "Item Updated",
        description: "The menu item has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating menu item:", error);
      toast({
        title: "Error",
        description: "Failed to update menu item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleAvailability = async (id: string, isAvailable: boolean) => {
    try {
      await toggleItemAvailability(id, isAvailable);
      toast({
        title: isAvailable ? "Item Available" : "Item Unavailable",
        description: `The item is now ${
          isAvailable ? "available" : "unavailable"
        } on the menu.`,
      });
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast({
        title: "Error",
        description: "Failed to update availability. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle input change for new item
  const handleNewItemChange = (
    field: keyof Omit<MenuItem, "id">,
    value: any
  ) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  // Handle input change for edit item
  const handleEditItemChange = (field: keyof MenuItem, value: any) => {
    if (editItem) {
      setEditItem((prev) => ({ ...prev!, [field]: value }));
    }
  };

  // Open edit dialog
  const openEditDialog = (item: MenuItem) => {
    setEditItem(item);
    setIsEditDialogOpen(true);
  };

  // Handle tag input for new item
  const handleNewItemTagsChange = (value: string) => {
    const tags = value.split(",").map((tag) => tag.trim());
    setNewItem((prev) => ({ ...prev, tags }));
  };

  // Handle tag input for edit item
  const handleEditItemTagsChange = (value: string) => {
    if (editItem) {
      const tags = value.split(",").map((tag) => tag.trim());
      setEditItem((prev) => ({ ...prev!, tags }));
    }
  };

  // Handle ingredients input for new item
  const handleNewItemIngredientsChange = (value: string) => {
    const ingredients = value.split(",").map((item) => item.trim());
    setNewItem((prev) => ({ ...prev, ingredients }));
  };

  // Handle ingredients input for edit item
  const handleEditItemIngredientsChange = (value: string) => {
    if (editItem) {
      const ingredients = value.split(",").map((item) => item.trim());
      setEditItem((prev) => ({ ...prev!, ingredients }));
    }
  };

  return (
    <div className="pb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-cafe-text">Menu Management</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cafe-primary hover:bg-cafe-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
              <DialogDescription className="text-cafe-text/70">
                Fill out the details below to add a new item to the menu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={newItem.name}
                    onChange={(e) =>
                      handleNewItemChange("name", e.target.value)
                    }
                    placeholder="Masala Dosa"
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <div className="flex gap-2">
                    <Input
                      id="category"
                      value={newItem.category}
                      onChange={(e) =>
                        handleNewItemChange("category", e.target.value)
                      }
                      placeholder="Breakfast"
                      className="bg-cafe-dark border-cafe-primary/20 text-cafe-text flex-1"
                      list="category-list"
                    />
                    <datalist id="category-list">
                      {categories.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) =>
                    handleNewItemChange("description", e.target.value)
                  }
                  placeholder="Delicious crispy rice pancake served with potato filling and chutneys"
                  className="bg-cafe-dark border-cafe-primary/20 text-cafe-text min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newItem.price || ""}
                    onChange={(e) =>
                      handleNewItemChange(
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    placeholder="100.00"
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="availability">Available</Label>
                    <Switch
                      id="availability"
                      checked={newItem.isAvailable}
                      onCheckedChange={(checked) =>
                        handleNewItemChange("isAvailable", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">
                  Tags (comma separated)
                </Label>
                <Input
                  id="tags"
                  value={newItem.tags.join(", ")}
                  onChange={(e) => handleNewItemTagsChange(e.target.value)}
                  placeholder="vegetarian, spicy, popular"
                  className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">
                  Ingredients (comma separated)
                </Label>
                <Input
                  id="ingredients"
                  value={newItem.ingredients.join(", ")}
                  onChange={(e) =>
                    handleNewItemIngredientsChange(e.target.value)
                  }
                  placeholder="rice, potato, spices"
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
                onClick={handleAddItem}
                disabled={isProcessing}
                className="bg-cafe-primary hover:bg-cafe-primary/90"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Item"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cafe-text/50" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search menu items..."
            className="pl-10 bg-cafe-surface border-cafe-primary/20 text-cafe-text"
          />
        </div>

        <div className="md:col-span-4 flex items-center space-x-2">
          <div className="flex items-center space-x-2 flex-1">
            <Filter className="h-4 w-4 text-cafe-text/70" />
            <select
              value={selectedCategory || ""}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value === "" ? null : e.target.value
                )
              }
              className="flex-1 bg-cafe-surface border border-cafe-primary/20 text-cafe-text h-10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cafe-primary"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="show-unavailable"
              checked={showUnavailable}
              onCheckedChange={setShowUnavailable}
            />
            <Label htmlFor="show-unavailable" className="text-cafe-text text-sm">
              Show Unavailable
            </Label>
          </div>
        </div>

        <div className="md:col-span-3 flex justify-end space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className={
              viewMode === "grid"
                ? "bg-cafe-primary hover:bg-cafe-primary/90"
                : "border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
            }
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            className={
              viewMode === "list"
                ? "bg-cafe-primary hover:bg-cafe-primary/90"
                : "border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
            }
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Menu Items */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-cafe-primary" />
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="bg-cafe-surface border-cafe-primary/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-cafe-text/30 mb-4" />
            <h3 className="text-xl font-medium mb-2 text-cafe-text">
              No menu items found
            </h3>
            <p className="text-cafe-text/70 mb-6 text-center max-w-md">
              {searchTerm || selectedCategory
                ? "Try adjusting your search or filter criteria."
                : "Start by adding your first menu item."}
            </p>
            {searchTerm || selectedCategory ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="border-cafe-primary/20 text-cafe-primary hover:bg-cafe-primary/10"
              >
                Clear Filters
              </Button>
            ) : (
              <DialogTrigger asChild>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="bg-cafe-primary hover:bg-cafe-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Item
                </Button>
              </DialogTrigger>
            )}
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full bg-cafe-surface border-cafe-primary/20 hover:shadow-md transition-shadow duration-300">
                <div className="relative h-36 bg-cafe-dark/30">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={`${
                        item.isAvailable
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-cafe-text">{item.name}</h3>
                    <span className="font-semibold text-cafe-primary">
                      ₹{item.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-cafe-text/70 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs bg-cafe-primary/10 text-cafe-primary border-transparent"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between">
                  <div className="flex items-center">
                    <Label
                      htmlFor={`availability-${item.id}`}
                      className="mr-2 text-cafe-text text-sm"
                    >
                      Available
                    </Label>
                    <Switch
                      id={`availability-${item.id}`}
                      checked={item.isAvailable}
                      onCheckedChange={(checked) =>
                        handleToggleAvailability(item.id, checked)
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(item)}
                    className="h-8 w-8 text-cafe-primary hover:bg-cafe-primary/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="bg-cafe-surface border-cafe-primary/20">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[300px] text-cafe-text/70">
                    Item Name
                  </TableHead>
                  <TableHead className="text-cafe-text/70">Category</TableHead>
                  <TableHead className="text-cafe-text/70">Tags</TableHead>
                  <TableHead className="text-right text-cafe-text/70">
                    Price
                  </TableHead>
                  <TableHead className="text-center text-cafe-text/70">
                    Availability
                  </TableHead>
                  <TableHead className="text-right text-cafe-text/70">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-cafe-primary/5 border-b border-cafe-primary/10"
                  >
                    <TableCell className="font-medium text-cafe-text">
                      {item.name}
                      <p className="text-xs text-cafe-text/60 mt-1 line-clamp-1">
                        {item.description}
                      </p>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs bg-cafe-primary/10 text-cafe-primary border-transparent"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{item.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        id={`availability-list-${item.id}`}
                        checked={item.isAvailable}
                        onCheckedChange={(checked) =>
                          handleToggleAvailability(item.id, checked)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(item)}
                        className="h-8 w-8 text-cafe-primary hover:bg-cafe-primary/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription className="text-cafe-text/70">
              Update the details for this menu item.
            </DialogDescription>
          </DialogHeader>
          {editItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Item Name</Label>
                  <Input
                    id="edit-name"
                    value={editItem.name}
                    onChange={(e) =>
                      handleEditItemChange("name", e.target.value)
                    }
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <div className="flex gap-2">
                    <Input
                      id="edit-category"
                      value={editItem.category}
                      onChange={(e) =>
                        handleEditItemChange("category", e.target.value)
                      }
                      className="bg-cafe-dark border-cafe-primary/20 text-cafe-text flex-1"
                      list="edit-category-list"
                    />
                    <datalist id="edit-category-list">
                      {categories.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editItem.description}
                  onChange={(e) =>
                    handleEditItemChange("description", e.target.value)
                  }
                  className="bg-cafe-dark border-cafe-primary/20 text-cafe-text min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (₹)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editItem.price || ""}
                    onChange={(e) =>
                      handleEditItemChange(
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="edit-availability">Available</Label>
                    <Switch
                      id="edit-availability"
                      checked={editItem.isAvailable}
                      onCheckedChange={(checked) =>
                        handleEditItemChange("isAvailable", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-tags">
                  Tags (comma separated)
                </Label>
                <Input
                  id="edit-tags"
                  value={editItem.tags.join(", ")}
                  onChange={(e) => handleEditItemTagsChange(e.target.value)}
                  className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-ingredients">
                  Ingredients (comma separated)
                </Label>
                <Input
                  id="edit-ingredients"
                  value={editItem.ingredients.join(", ")}
                  onChange={(e) =>
                    handleEditItemIngredientsChange(e.target.value)
                  }
                  className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                />
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
              disabled={isProcessing}
              className="bg-cafe-primary hover:bg-cafe-primary/90"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuManagerPage;
