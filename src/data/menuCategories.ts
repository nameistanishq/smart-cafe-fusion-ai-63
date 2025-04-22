
import { MenuCategory } from "@/types";
import { menuItems } from "./menuItems";

export const menuCategories: MenuCategory[] = [
  {
    id: "cat-1",
    name: "Breakfast",
    image: "/assets/categories/breakfast.jpg",
    description: "Start your day with our freshly made South Indian breakfast items",
    items: menuItems.filter(item => item.category === "cat-1")
  },
  {
    id: "cat-2",
    name: "Main Course",
    image: "/assets/categories/main-course.jpg",
    description: "Authentic South Indian rice-based dishes for a fulfilling meal",
    items: menuItems.filter(item => item.category === "cat-2")
  },
  {
    id: "cat-3",
    name: "Snacks",
    image: "/assets/categories/snacks.jpg",
    description: "Tasty South Indian snacks perfect for a quick bite",
    items: menuItems.filter(item => item.category === "cat-3")
  },
  {
    id: "cat-4",
    name: "Desserts",
    image: "/assets/categories/desserts.jpg",
    description: "Sweet treats to satisfy your cravings",
    items: menuItems.filter(item => item.category === "cat-4")
  },
  {
    id: "cat-5",
    name: "Beverages",
    image: "/assets/categories/beverages.jpg",
    description: "Refreshing drinks to complement your meal",
    items: menuItems.filter(item => item.category === "cat-5")
  }
];
