import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin — Dialectify.ai",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
