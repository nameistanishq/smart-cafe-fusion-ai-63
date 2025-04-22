
import { MenuItem } from "@/types";

export const menuItems: MenuItem[] = [
  {
    id: "item-1",
    name: "Masala Dosa",
    description: "Crispy rice pancake stuffed with spiced potato filling, served with sambar and chutneys",
    price: 80,
    category: "cat-1", // Breakfast
    image: "/assets/menu/masala-dosa.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: true,
    prepTime: 10,
    ingredients: ["Rice batter", "Potatoes", "Onions", "Spices"],
    rating: 4.7,
    tags: ["popular", "breakfast", "lunch"]
  },
  {
    id: "item-2",
    name: "Idli Sambar",
    description: "Steamed rice cakes served with lentil soup and coconut chutney",
    price: 60,
    category: "cat-1", // Breakfast
    image: "/assets/menu/idli-sambar.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 5,
    ingredients: ["Rice", "Urad dal", "Lentils", "Vegetables"],
    rating: 4.5,
    tags: ["popular", "breakfast", "healthy", "low-sugar"]
  },
  {
    id: "item-3",
    name: "Vada",
    description: "Crispy savory donuts made from urad dal, served with sambar and chutney",
    price: 40,
    category: "cat-1", // Breakfast
    image: "/assets/menu/vada.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 8,
    ingredients: ["Urad dal", "Spices", "Green chilies"],
    rating: 4.3,
    tags: ["breakfast", "snack"]
  },
  {
    id: "item-4",
    name: "Pongal",
    description: "Rice and lentil porridge with cashews, ghee, and black pepper",
    price: 70,
    category: "cat-1", // Breakfast
    image: "/assets/menu/pongal.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 15,
    ingredients: ["Rice", "Moong dal", "Ghee", "Cashews", "Black pepper"],
    rating: 4.4,
    tags: ["breakfast", "healthy"]
  },
  {
    id: "item-5",
    name: "Upma",
    description: "Savory semolina porridge with vegetables and spices",
    price: 65,
    category: "cat-1", // Breakfast
    image: "/assets/menu/upma.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 12,
    ingredients: ["Semolina", "Vegetables", "Spices", "Ghee"],
    rating: 4.2,
    tags: ["breakfast", "healthy", "low-sugar"]
  },
  {
    id: "item-6",
    name: "Vegetable Biryani",
    description: "Fragrant rice dish with mixed vegetables and aromatic spices",
    price: 120,
    category: "cat-2", // Main Course
    image: "/assets/menu/veg-biryani.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: true,
    prepTime: 25,
    ingredients: ["Basmati rice", "Mixed vegetables", "Biryani masala", "Ghee"],
    rating: 4.6,
    tags: ["popular", "lunch", "dinner"]
  },
  {
    id: "item-7",
    name: "Sambar Rice",
    description: "Rice mixed with lentil-based vegetable stew",
    price: 90,
    category: "cat-2", // Main Course
    image: "/assets/menu/sambar-rice.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: true,
    prepTime: 20,
    ingredients: ["Rice", "Toor dal", "Vegetables", "Sambar powder"],
    rating: 4.3,
    tags: ["lunch", "healthy"]
  },
  {
    id: "item-8",
    name: "Curd Rice",
    description: "Yogurt rice with tempering of mustard seeds and curry leaves",
    price: 80,
    category: "cat-2", // Main Course
    image: "/assets/menu/curd-rice.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 10,
    ingredients: ["Rice", "Yogurt", "Mustard seeds", "Curry leaves"],
    rating: 4.2,
    tags: ["lunch", "dinner", "cool"]
  },
  {
    id: "item-9",
    name: "Lemon Rice",
    description: "Tangy rice dish with lemon juice, peanuts, and spices",
    price: 85,
    category: "cat-2", // Main Course
    image: "/assets/menu/lemon-rice.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 15,
    ingredients: ["Rice", "Lemon juice", "Peanuts", "Mustard seeds"],
    rating: 4.1,
    tags: ["lunch", "tangy"]
  },
  {
    id: "item-10",
    name: "Tomato Rice",
    description: "Rice cooked with tomatoes, onions, and spices",
    price: 85,
    category: "cat-2", // Main Course
    image: "/assets/menu/tomato-rice.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: true,
    prepTime: 15,
    ingredients: ["Rice", "Tomatoes", "Onions", "Spices"],
    rating: 4.2,
    tags: ["lunch", "dinner"]
  },
  {
    id: "item-11",
    name: "Medu Vada",
    description: "Deep-fried savory lentil donuts",
    price: 45,
    category: "cat-3", // Snacks
    image: "/assets/menu/medu-vada.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 12,
    ingredients: ["Urad dal", "Green chilies", "Curry leaves", "Oil"],
    rating: 4.4,
    tags: ["snack", "breakfast"]
  },
  {
    id: "item-12",
    name: "Mysore Bonda",
    description: "Deep-fried fluffy fritters made with flour and yogurt",
    price: 40,
    category: "cat-3", // Snacks
    image: "/assets/menu/mysore-bonda.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 10,
    ingredients: ["All-purpose flour", "Yogurt", "Spices", "Oil"],
    rating: 4.0,
    tags: ["snack", "evening"]
  },
  {
    id: "item-13",
    name: "Bajji",
    description: "Vegetables dipped in gram flour batter and deep-fried",
    price: 35,
    category: "cat-3", // Snacks
    image: "/assets/menu/bajji.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: true,
    prepTime: 8,
    ingredients: ["Gram flour", "Vegetables", "Spices", "Oil"],
    rating: 4.1,
    tags: ["snack", "evening", "rainy-day"]
  },
  {
    id: "item-14",
    name: "Mixture",
    description: "Savory snack mix with nuts, lentils, and spices",
    price: 30,
    category: "cat-3", // Snacks
    image: "/assets/menu/mixture.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: true,
    prepTime: 5,
    ingredients: ["Gram flour", "Peanuts", "Curry leaves", "Spices"],
    rating: 4.3,
    tags: ["snack", "evening", "crunchy"]
  },
  {
    id: "item-15",
    name: "Murukku",
    description: "Crunchy spiraled snack made from rice and urad dal flour",
    price: 25,
    category: "cat-3", // Snacks
    image: "/assets/menu/murukku.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 5,
    ingredients: ["Rice flour", "Urad dal flour", "Butter", "Spices"],
    rating: 4.2,
    tags: ["snack", "crunchy"]
  },
  {
    id: "item-16",
    name: "Sweet Pongal",
    description: "Sweet rice and lentil pudding with jaggery and cashews",
    price: 60,
    category: "cat-4", // Desserts
    image: "/assets/menu/sweet-pongal.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 20,
    ingredients: ["Rice", "Moong dal", "Jaggery", "Ghee", "Cashews"],
    rating: 4.5,
    tags: ["dessert", "sweet", "festival"]
  },
  {
    id: "item-17",
    name: "Kesari Bath",
    description: "Semolina dessert flavored with saffron and nuts",
    price: 55,
    category: "cat-4", // Desserts
    image: "/assets/menu/kesari-bath.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 15,
    ingredients: ["Semolina", "Sugar", "Saffron", "Ghee", "Nuts"],
    rating: 4.4,
    tags: ["dessert", "sweet"]
  },
  {
    id: "item-18",
    name: "Payasam",
    description: "Sweet rice or vermicelli pudding with milk and nuts",
    price: 65,
    category: "cat-4", // Desserts
    image: "/assets/menu/payasam.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 25,
    ingredients: ["Rice/Vermicelli", "Milk", "Sugar", "Nuts", "Cardamom"],
    rating: 4.6,
    tags: ["dessert", "sweet", "festival"]
  },
  {
    id: "item-19",
    name: "Mysore Pak",
    description: "Rich sweet made from gram flour, ghee, and sugar",
    price: 70,
    category: "cat-4", // Desserts
    image: "/assets/menu/mysore-pak.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 30,
    ingredients: ["Gram flour", "Sugar", "Ghee"],
    rating: 4.7,
    tags: ["dessert", "sweet", "popular"]
  },
  {
    id: "item-20",
    name: "Jalebi",
    description: "Spiral-shaped sweet made from fermented batter, deep-fried and soaked in sugar syrup",
    price: 50,
    category: "cat-4", // Desserts
    image: "/assets/menu/jalebi.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 20,
    ingredients: ["All-purpose flour", "Yogurt", "Sugar", "Saffron"],
    rating: 4.5,
    tags: ["dessert", "sweet", "popular"]
  },
  {
    id: "item-21",
    name: "Filter Coffee",
    description: "Traditional South Indian coffee made with milk and decoction",
    price: 30,
    category: "cat-5", // Beverages
    image: "/assets/menu/filter-coffee.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 5,
    ingredients: ["Coffee beans", "Milk", "Sugar"],
    rating: 4.8,
    tags: ["popular", "hot", "beverage"]
  },
  {
    id: "item-22",
    name: "Masala Chai",
    description: "Spiced Indian tea with milk",
    price: 25,
    category: "cat-5", // Beverages
    image: "/assets/menu/masala-chai.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 7,
    ingredients: ["Tea leaves", "Milk", "Sugar", "Spices"],
    rating: 4.3,
    tags: ["hot", "beverage", "morning"]
  },
  {
    id: "item-23",
    name: "Buttermilk",
    description: "Spiced yogurt drink with curry leaves and mustard seeds",
    price: 20,
    category: "cat-5", // Beverages
    image: "/assets/menu/buttermilk.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 3,
    ingredients: ["Yogurt", "Water", "Curry leaves", "Mustard seeds"],
    rating: 4.1,
    tags: ["beverage", "cool", "summer", "low-sugar"]
  },
  {
    id: "item-24",
    name: "Badam Milk",
    description: "Sweet almond-flavored milk drink",
    price: 40,
    category: "cat-5", // Beverages
    image: "/assets/menu/badam-milk.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 10,
    ingredients: ["Milk", "Almonds", "Sugar", "Cardamom"],
    rating: 4.4,
    tags: ["beverage", "sweet", "healthy"]
  },
  {
    id: "item-25",
    name: "Fresh Lime Soda",
    description: "Refreshing lime juice with soda water, sweetened or salted",
    price: 35,
    category: "cat-5", // Beverages
    image: "/assets/menu/lime-soda.jpg",
    isAvailable: true,
    isVegetarian: true,
    isSpicy: false,
    prepTime: 2,
    ingredients: ["Lime juice", "Soda water", "Sugar/Salt"],
    rating: 4.2,
    tags: ["beverage", "cool", "summer", "refreshing", "low-sugar"]
  }
];
