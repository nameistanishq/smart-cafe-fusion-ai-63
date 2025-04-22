
import { User } from "@/types";

export const users: User[] = [
  {
    id: "user-1",
    name: "Raj Kumar",
    email: "student@example.com",
    role: "student",
    walletBalance: 500,
    profileImage: "/assets/avatars/student.jpg",
    createdAt: new Date(2023, 0, 15)
  },
  {
    id: "user-2",
    name: "Priya Sharma",
    email: "staff@example.com",
    role: "staff",
    walletBalance: 750,
    profileImage: "/assets/avatars/staff.jpg",
    createdAt: new Date(2023, 1, 10)
  },
  {
    id: "user-3",
    name: "Anand Patel",
    email: "cafeteria@example.com",
    role: "cafeteria",
    profileImage: "/assets/avatars/cafeteria.jpg",
    createdAt: new Date(2022, 10, 5)
  },
  {
    id: "user-4",
    name: "Arjun Singh",
    email: "admin@example.com",
    role: "admin",
    profileImage: "/assets/avatars/admin.jpg",
    createdAt: new Date(2022, 8, 20)
  }
];
