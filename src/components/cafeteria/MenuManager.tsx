
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMenu } from "@/contexts/MenuContext";
import { MenuItem, MenuCategory } from "@/types";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Check,
  X,
  Flame,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MenuManager: React.FC = () => {
  const { menuItems, menuCategories, updateItemAvailability, addNewMenuItem } =
    useMenu();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // New menu item form state
  const [newItem, setNewItem] = useState<Omit<MenuItem, "id">>({
    name: "",
    description: "",
    price: 0,
    category: "",
    image: "/assets/menu/placeholder.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 10,
    ingredients: [],
    tags: [],
  });

  const handleToggleAvailability = async (id: string, currentValue: boolean) => {
    try {
      await updateItemAvailability(id, !currentValue);
      toast({
        title: "Item updated",
        description: `Item availability has been ${!currentValue ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update item availability. Please try again.",
      });
    }
  };

  const handleAddMenuItem = async () => {
    if (!newItem.name || !newItem.description || newItem.price <= 0 || !newItem.category) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setIsSaving(true);

    try {
      await addNewMenuItem(newItem);
      setIsAddDialogOpen(false);
      // Reset form
      setNewItem({
        name: "",
        description: "",
        price: 0,
        category: "",
        image: "/assets/menu/placeholder.jpg",
        isAvailable: true,
        isVegetarian: true,
        isSpicy: false,
        prepTime: 10,
        ingredients: [],
        tags: [],
      });
      
      toast({
        title: "Success",
        description: "New menu item has been added.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add menu item. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Filter menu items based on search term and category
  const filteredItems = menuItems.filter(
    (item) =>
      (selectedCategory === null || item.category === selectedCategory) &&
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cafe-text/50" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search menu items..."
            className="pl-10 bg-cafe-surface border-cafe-primary/20 text-cafe-text"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select
            value={selectedCategory || ""}
            onValueChange={(value) =>
              setSelectedCategory(value === "" ? null : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[200px] bg-cafe-surface border-cafe-primary/20 text-cafe-text">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
              <SelectItem value="">All Categories</SelectItem>
              {menuCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cafe-primary hover:bg-cafe-primary/90">
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription className="text-cafe-text/70">
                  Fill in the details to add a new item to the menu.
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

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                    placeholder="Describe the menu item"
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (₹)</Label>
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

                  <div className="grid gap-2">
                    <Label htmlFor="prepTime">Prep Time (mins)</Label>
                    <Input
                      id="prepTime"
                      type="number"
                      value={newItem.prepTime || ""}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          prepTime: parseInt(e.target.value) || 0,
                        })
                      }
                      min="0"
                      placeholder="10"
                      className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) =>
                      setNewItem({ ...newItem, category: value })
                    }
                  >
                    <SelectTrigger
                      id="category"
                      className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-cafe-surface border-cafe-primary/20 text-cafe-text">
                      {menuCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={newItem.image}
                    onChange={(e) =>
                      setNewItem({ ...newItem, image: e.target.value })
                    }
                    placeholder="/assets/menu/your-image.jpg"
                    className="bg-cafe-dark border-cafe-primary/20 text-cafe-text"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isVegetarian">Vegetarian</Label>
                    <Switch
                      id="isVegetarian"
                      checked={newItem.isVegetarian}
                      onCheckedChange={(checked) =>
                        setNewItem({ ...newItem, isVegetarian: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isSpicy">Spicy</Label>
                    <Switch
                      id="isSpicy"
                      checked={newItem.isSpicy}
                      onCheckedChange={(checked) =>
                        setNewItem({ ...newItem, isSpicy: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isAvailable">Available</Label>
                    <Switch
                      id="isAvailable"
                      checked={newItem.isAvailable}
                      onCheckedChange={(checked) =>
                        setNewItem({ ...newItem, isAvailable: checked })
                      }
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
                  onClick={handleAddMenuItem}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden flex flex-col h-full bg-cafe-surface border-cafe-primary/20">
              <div className="h-40 overflow-hidden relative">
                <img
                  src={item.image || "/assets/menu/placeholder.jpg"}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {item.isVegetarian && (
                    <Badge className="bg-green-600">Veg</Badge>
                  )}
                  {item.isSpicy && (
                    <Badge className="bg-red-600">
                      <Flame className="h-3 w-3 mr-1" /> Spicy
                    </Badge>
                  )}
                </div>
                <div
                  className={`absolute inset-0 ${
                    !item.isAvailable ? "bg-black/70" : "bg-transparent"
                  } flex items-center justify-center transition-all duration-300`}
                >
                  {!item.isAvailable && (
                    <Badge variant="destructive" className="text-sm font-medium">
                      Currently Unavailable
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-cafe-text">{item.name}</h3>
                    <p className="text-cafe-text/70 text-sm line-clamp-2 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs border-cafe-primary/20 bg-cafe-primary/5 text-cafe-primary"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {item.prepTime} mins
                      </Badge>
                      <div className="text-cafe-primary font-bold">
                        ₹{item.price}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-cafe-text/70 hover:text-cafe-text"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-cafe-surface border-cafe-primary/20 text-cafe-text"
                      >
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleAvailability(item.id, item.isAvailable)
                          }
                        >
                          {item.isAvailable ? (
                            <>
                              <X className="h-4 w-4 mr-2" /> Mark Unavailable
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-2" /> Mark Available
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Switch
                      checked={item.isAvailable}
                      onCheckedChange={() =>
                        handleToggleAvailability(item.id, item.isAvailable)
                      }
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-cafe-text/70 text-lg">
            No menu items found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
