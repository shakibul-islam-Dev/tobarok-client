/**
 * Customer order data (demo).
 *
 * Single source of truth for the signed-in customer's own orders. The order
 * history list, the order detail page and the dashboard all read from here so
 * totals and item counts can never disagree between pages.
 */

import { images } from "./data";

export type UserOrderStatus =
  | "Processing"
  | "On the way"
  | "Completed"
  | "Cancelled";

export interface OrderItem {
  title: string;
  qty: number;
  price: number;
  image: string;
}

export interface OrderAddress {
  name: string;
  phone: string;
  email: string;
  area: string;
  district: string;
}

export interface UserOrder {
  id: string;
  date: string;
  status: UserOrderStatus;
  payment: "COD" | "bKash" | "Wallet";
  items: OrderItem[];
  delivery: number;
  address: OrderAddress;
}

/** Badge colours per status, shared by the list and detail views. */
export const orderStatusStyles: Record<UserOrderStatus, string> = {
  Processing: "bg-amber-100 text-amber-700",
  "On the way": "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

/** Number of units bought in an order (sum of quantities). */
export function orderItemCount(order: UserOrder): number {
  return order.items.reduce((sum, item) => sum + item.qty, 0);
}

/** Subtotal = sum of line totals, excluding delivery. */
export function orderSubtotal(order: UserOrder): number {
  return order.items.reduce((sum, item) => sum + item.qty * item.price, 0);
}

export const userOrders: UserOrder[] = [
  {
    id: "#738",
    date: "8 Sep, 2026",
    status: "Processing",
    payment: "Wallet",
    delivery: 0,
    items: [
      {
        title: "Drop Shoulder T-Shirt (Spiderman BND)",
        qty: 2,
        price: 560,
        image: images.teeMock,
      },
      {
        title: "Classic Yellow Polo with Black Collar",
        qty: 1,
        price: 720,
        image: images.manGrey,
      },
      {
        title: "Solid T-Shirt - Pure Black",
        qty: 1,
        price: 320,
        image: images.whiteTee,
      },
    ],
    address: {
      name: "Rahim Uddin",
      phone: "+880 1712-345678",
      email: "rahim@example.com",
      area: "House 12, Road 5, Dhanmondi",
      district: "Dhaka",
    },
  },
  {
    id: "#703",
    date: "24 May, 2026",
    status: "On the way",
    payment: "COD",
    delivery: 90,
    items: [
      {
        title: "Kids Solid T-Shirt - Pink",
        qty: 1,
        price: 250,
        image: images.pinkTee,
      },
    ],
    address: {
      name: "Sumaiya Akter",
      phone: "+880 1812-345678",
      email: "sumaiya@example.com",
      area: "Flat 3B, Uttara Sector 7",
      district: "Dhaka",
    },
  },
  {
    id: "#130",
    date: "22 Oct, 2026",
    status: "Completed",
    payment: "bKash",
    delivery: 0,
    items: [
      {
        title: "Premium Solid Polo: Deep Brown",
        qty: 2,
        price: 499,
        image: images.foldedTees,
      },
      {
        title: "Drop Shoulder T-Shirt (Wings of Freedom)",
        qty: 1,
        price: 560,
        image: images.teeHanger,
      },
      {
        title: "Solid SweatPant - Grey Melange",
        qty: 1,
        price: 899,
        image: images.rack2,
      },
    ],
    address: {
      name: "Tanvir Ahmed",
      phone: "+880 1512-345678",
      email: "tanvir@example.com",
      area: "Road 27, Banani",
      district: "Dhaka",
    },
  },
  {
    id: "#561",
    date: "1 Feb, 2026",
    status: "Completed",
    payment: "COD",
    delivery: 90,
    items: [
      {
        title: "Solid T-Shirt - Pure Black",
        qty: 1,
        price: 320,
        image: images.whiteTee,
      },
    ],
    address: {
      name: "Nusrat Jahan",
      phone: "+880 1612-345678",
      email: "nusrat@example.com",
      area: "GEC Circle",
      district: "Chattogram",
    },
  },
  {
    id: "#536",
    date: "21 Sep, 2026",
    status: "Completed",
    payment: "Wallet",
    delivery: 0,
    items: [
      {
        title: "Drop Shoulder T-Shirt (Ragnar Lothbrok)",
        qty: 2,
        price: 560,
        image: images.manGrey,
      },
      {
        title: "Drop Shoulder T-Shirt (Birds)",
        qty: 2,
        price: 560,
        image: images.rack,
      },
      {
        title: "Premium Solid Polo: Deep Brown",
        qty: 3,
        price: 499,
        image: images.foldedTees,
      },
      {
        title: "Solid T-Shirt - Urban Grey",
        qty: 2,
        price: 320,
        image: images.shirts,
      },
      {
        title: "Solid T-Shirt - Yellow",
        qty: 1,
        price: 320,
        image: images.manWhite,
      },
    ],
    address: {
      name: "Mehedi Hasan",
      phone: "+880 1912-345678",
      email: "mehedi@example.com",
      area: "Zindabazar",
      district: "Sylhet",
    },
  },
  {
    id: "#492",
    date: "22 Oct, 2026",
    status: "Cancelled",
    payment: "bKash",
    delivery: 90,
    items: [
      {
        title: "Half Sleeve Turtle Neck (Black)",
        qty: 2,
        price: 399,
        image: images.store,
      },
      {
        title: "Kids Solid T-Shirt - Maroon",
        qty: 1,
        price: 250,
        image: images.teeHanger,
      },
    ],
    address: {
      name: "Farhana Islam",
      phone: "+880 1312-345678",
      email: "farhana@example.com",
      area: "Mirpur 10",
      district: "Dhaka",
    },
  },
];

/** Lookup by order id, accepting either "#738" or "738". */
export function getOrderById(id: string): UserOrder | undefined {
  const normalized = id.replace(/^#/, "");
  return userOrders.find((order) => order.id.replace(/^#/, "") === normalized);
}
