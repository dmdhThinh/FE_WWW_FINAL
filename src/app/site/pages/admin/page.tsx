import { Metadata } from "next";
import AdminClient from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin Panel - PC E-commerce",
  description: "Manage products, categories, orders, and users in the PC e-commerce admin panel",
  keywords: "admin, ecommerce, management, pc, computer, dashboard",
};

export default function AdminPage() {
  return <AdminClient />;
}