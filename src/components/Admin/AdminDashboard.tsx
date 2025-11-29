import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import adminService from "../../services/admin";
import AdminStats from "./AdminStats";
import CategoryManager from "./CategoryManager";
import ProductManager from "./ProductManager";
import OrderManager from "./OrderManager";
import UserManager from "./UserManager";

interface DashboardStats {
  totalCategories: number;
  activeCategories: number;
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalUsers: number;
  activeUsers: number;
  recentOrders: any[];
  recentUsers: any[];
}

const AdminDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get("tab");
    return tabParam && ["dashboard", "categories", "products", "orders", "users"].includes(tabParam)
      ? tabParam
      : "dashboard";
  });
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      setLoading(true);
      const dashboardStats = await adminService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error: any) {
      console.error("Failed to fetch dashboard stats:", error);
      toast.error("Không thể tải thống kê bảng điều khiển");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update URL
    if (tab === "dashboard") {
      router.replace("/admin", { scroll: false });
    } else {
      router.replace(`/admin?tab=${tab}`, { scroll: false });
    }

    // Refresh stats when returning to dashboard
    if (tab === "dashboard") {
      fetchStats();
    }
  };

  const tabs = [
    { id: "dashboard", name: "Bảng điều khiển", icon: "📊" },
    { id: "categories", name: "Danh mục", icon: "🏷️" },
    { id: "products", name: "Sản phẩm", icon: "🛍️" },
    { id: "orders", name: "Đơn hàng", icon: "📦" },
    { id: "users", name: "Người dùng", icon: "👥" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 my-8">
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển quản trị</h1>
          <p className="text-gray-600 mt-2">
            Quản lý danh mục, sản phẩm, đơn hàng và người dùng của cửa hàng thương mại điện tử
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-blue text-blue"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {loading && activeTab === "dashboard" ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && <AdminStats stats={stats} />}
              {activeTab === "categories" && <CategoryManager onUpdate={fetchStats} />}
              {activeTab === "products" && <ProductManager onUpdate={fetchStats} />}
              {activeTab === "orders" && <OrderManager onUpdate={fetchStats} />}
              {activeTab === "users" && <UserManager onUpdate={fetchStats} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;