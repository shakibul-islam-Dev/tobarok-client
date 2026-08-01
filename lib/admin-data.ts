import { images } from "./data";

export type ProductStatus = "pending" | "approved" | "rejected";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface AdminProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  image: string;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: OrderStatus;
  date: string;
}

export const productStatusLabel: Record<ProductStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const initialProducts: AdminProduct[] = [
  {
    id: "p-101",
    title: "Classic Yellow Polo with Black Collar",
    category: "Polo",
    price: 720,
    stock: 24,
    status: "approved",
    image: images.manGrey,
    createdAt: "12 Jul, 2026",
  },
  {
    id: "p-102",
    title: "Drop Shoulder T-Shirt (Spiderman BND)",
    category: "Drop Shoulder",
    price: 560,
    stock: 40,
    status: "approved",
    image: images.teeMock,
    createdAt: "11 Jul, 2026",
  },
  {
    id: "p-103",
    title: "Solid T Shirt - Pure Black",
    category: "T-Shirt",
    price: 320,
    stock: 0,
    status: "approved",
    image: images.whiteTee,
    createdAt: "9 Jul, 2026",
  },
  {
    id: "p-104",
    title: "Premium Solid Polo: Deep Brown",
    category: "Polo",
    price: 499,
    stock: 18,
    status: "pending",
    image: images.foldedTees,
    createdAt: "8 Jul, 2026",
  },
  {
    id: "p-105",
    title: "Drop Shoulder T-Shirt (Wings of Freedom)",
    category: "Drop Shoulder",
    price: 560,
    stock: 30,
    status: "pending",
    image: images.teeHanger,
    createdAt: "7 Jul, 2026",
  },
  {
    id: "p-106",
    title: "Kids Solid T-Shirt - Pink",
    category: "Kiddo",
    price: 250,
    stock: 60,
    status: "approved",
    image: images.pinkTee,
    createdAt: "5 Jul, 2026",
  },
  {
    id: "p-107",
    title: "Solid SweatPant - Grey Melange",
    category: "Sweatpant",
    price: 899,
    stock: 12,
    status: "rejected",
    image: images.rack2,
    createdAt: "3 Jul, 2026",
  },
  {
    id: "p-108",
    title: "Half Sleeve Turtle Neck (Black)",
    category: "Turtle Neck",
    price: 399,
    stock: 22,
    status: "approved",
    image: images.shirts,
    createdAt: "1 Jul, 2026",
  },
];

export const initialOrders: AdminOrder[] = [
  {
    id: "#738",
    customer: "Rahim Uddin",
    email: "rahim@example.com",
    items: 5,
    total: 1350,
    status: "processing",
    date: "8 Sep, 2026",
  },
  {
    id: "#703",
    customer: "Sumaiya Akter",
    email: "sumaiya@example.com",
    items: 1,
    total: 250,
    status: "shipped",
    date: "24 May, 2026",
  },
  {
    id: "#130",
    customer: "Tanvir Ahmed",
    email: "tanvir@example.com",
    items: 4,
    total: 2500,
    status: "delivered",
    date: "22 Oct, 2026",
  },
  {
    id: "#561",
    customer: "Nusrat Jahan",
    email: "nusrat@example.com",
    items: 1,
    total: 350,
    status: "delivered",
    date: "1 Feb, 2026",
  },
  {
    id: "#536",
    customer: "Mehedi Hasan",
    email: "mehedi@example.com",
    items: 13,
    total: 5780,
    status: "pending",
    date: "21 Sep, 2026",
  },
  {
    id: "#492",
    customer: "Farhana Islam",
    email: "farhana@example.com",
    items: 7,
    total: 3450,
    status: "cancelled",
    date: "22 Oct, 2026",
  },
  {
    id: "#410",
    customer: "Sakib Rahman",
    email: "sakib@example.com",
    items: 2,
    total: 1120,
    status: "pending",
    date: "14 Nov, 2026",
  },
  {
    id: "#388",
    customer: "Afia Anjum",
    email: "afia@example.com",
    items: 3,
    total: 1680,
    status: "shipped",
    date: "9 Nov, 2026",
  },
];

export const productCategories = [
  "T-Shirt",
  "Polo",
  "Drop Shoulder",
  "Kiddo",
  "Sweatpant",
  "Hoodie",
  "Turtle Neck",
  "Accessory",
];
