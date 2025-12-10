import React from "react";

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

interface AdminStatsProps {
  stats: DashboardStats | null;
}

const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải thống kê bảng điều khiển...</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Tổng danh mục",
      value: stats.totalCategories,
      subtitle: `${stats.activeCategories} đang hoạt động`,
      color: "bg-purple-500",
      icon: "🏷️",
    },
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts,
      subtitle: `${stats.activeProducts} đang hoạt động`,
      color: "bg-blue-500",
      icon: "🛍️",
    },
    {
      title: "Tổng đơn hàng",
      value: stats.totalOrders,
      subtitle: `${stats.pendingOrders} đang chờ`,
      color: "bg-green-500",
      icon: "📦",
    },
    {
      title: "Tổng người dùng",
      value: stats.totalUsers,
      subtitle: `${stats.activeUsers} đang hoạt động`,
      color: "bg-orange-500",
      icon: "👥",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`${card.color} rounded-lg p-3 text-white text-2xl`}>
                {card.icon}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{card.value}</h3>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-xs text-gray-500">{card.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
          </div>
          <div className="p-6">
            {stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {stats.recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Đơn hàng #{order.id?.toString().slice(-8) || `#${index + 1}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.customerName || "Khách hàng chưa xác định"} • ${order.finalAmount || "0"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status === "PENDING" ? "ĐANG CHỜ" : order.status === "COMPLETED" ? "HOÀN THÀNH" : order.status || "KHÔNG XÁC ĐỊNH"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Không có đơn hàng gần đây</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Người dùng gần đây</h3>
          </div>
          <div className="p-6">
            {stats.recentUsers.length > 0 ? (
              <div className="space-y-4">
                {stats.recentUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{user.fullName || "Người dùng chưa xác định"}</p>
                      <p className="text-sm text-gray-600">{user.email || "Không có email"}</p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive !== false
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive !== false ? "Đang hoạt động" : "Không hoạt động"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Không có người dùng gần đây</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = "/admin?tab=categories";
              }
            }}
            className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">➕</div>
            <p className="text-sm text-gray-600">Add Category</p>
          </button>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = "/admin?tab=products";
              }
            }}
            className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">🛍️</div>
            <p className="text-sm text-gray-600">Add Product</p>
          </button>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = "/admin?tab=orders";
              }
            }}
            className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">📋</div>
            <p className="text-sm text-gray-600">View Orders</p>
          </button>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = "/admin?tab=users";
              }
            }}
            className="p-4 text-center rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">👤</div>
            <p className="text-sm text-gray-600">Manage Users</p>
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default AdminStats;