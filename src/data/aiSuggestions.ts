
import { AiSuggestion } from "@/types";

export const aiSuggestions: AiSuggestion[] = [
  {
    title: "Low Rice Stock Alert",
    description: "Rice stock is running low. Consider restocking within 2 days based on current consumption rate.",
    type: "inventory",
    priority: "high",
    date: new Date()
  },
  {
    title: "Waste Reduction Opportunity",
    description: "High waste detected in Masala Dosa. Consider reducing batch size for evening preparation.",
    type: "waste",
    priority: "medium",
    date: new Date()
  },
  {
    title: "Menu Optimization",
    description: "Vegetable Biryani sales have increased by 30% this week. Consider creating a special promotion.",
    type: "menu",
    priority: "low",
    date: new Date()
  },
  {
    title: "Sales Trend Detected",
    description: "Morning coffee sales have decreased by 15%. Consider bundling with breakfast items to boost sales.",
    type: "sales",
    priority: "medium",
    date: new Date()
  },
  {
    title: "Inventory Optimization",
    description: "Yogurt usage is inconsistent. Suggest ordering smaller quantities more frequently to reduce waste.",
    type: "inventory",
    priority: "low",
    date: new Date()
  },
  {
    title: "Predicted Stock Out",
    description: "At current rate, Onions will be out of stock by Friday. Place order immediately.",
    type: "inventory",
    priority: "high",
    date: new Date()
  },
  {
    title: "Menu Item Performance",
    description: "Mysore Pak is consistently the most profitable dessert. Consider featuring it prominently.",
    type: "menu",
    priority: "medium",
    date: new Date()
  },
  {
    title: "Waste Pattern Detected",
    description: "End-of-day waste is significantly higher on Wednesdays. Consider adjusting production schedule.",
    type: "waste",
    priority: "medium",
    date: new Date()
  }
];
