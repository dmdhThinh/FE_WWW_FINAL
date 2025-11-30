import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import adminService from "../../services/admin";
import { PaginatedResponse } from "@/types/category";
import { User } from "@/types/auth";

interface UserManagerProps {
  onUpdate: () => void;
}

const UserManager: React.FC<UserManagerProps> = ({ onUpdate }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginatedResponse<User>>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0,
    first: true,
    last: true,
    numberOfElements: 0,
  });

  const fetchUsers = async (page = 0, size = 10) => {
    try {
      setLoading(true);
      const data = (await adminService.getAllUsers(page, size)) as unknown as PaginatedResponse<User>;
      setUsers(data.content || []);
      setPagination(data);
    } catch (error: any) {
      console.error("Failed to fetch users:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(0, pagination.size);
  }, []);

  const toggleUserStatus = async (user: any) => {
    const action = user.isActive !== false ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      if (user.isActive !== false) {
        await adminService.deactivateUser(user.id);
        toast.success("Vô hiệu hóa người dùng thành công");
      } else {
        await adminService.activateUser(user.id);
        toast.success("Kích hoạt người dùng thành công");
      }
      fetchUsers();
      onUpdate();
    } catch (error: any) {
      console.error("Failed to update user status:", error);
      toast.error("Không thể cập nhật trạng thái người dùng");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Xác thực
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tham gia
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue flex items-center justify-center text-white font-medium">
                            {user.fullName?.charAt(0).toUpperCase() || "U"}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.phone || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isAdmin
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isAdmin ? "Quản trị viên" : "Người dùng"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isVerified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isActive !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive !== false ? "Đang hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(user.createdAt || "").toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleUserStatus(user)}
                        className={`${
                          user.isActive !== false
                            ? "text-orange hover:text-orange-600"
                            : "text-green hover:text-green-600"
                        }`}
                        disabled={user.isAdmin} // Prevent deactivating admin users
                      >
                        {user.isAdmin ? "Quản trị viên" : (user.isActive !== false ? "Vô hiệu hóa" : "Kích hoạt")}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              Hiển thị{" "}
              <span className="font-medium">
                {pagination.number * pagination.size + 1}
              </span>{" "}
              đến{" "}
              <span className="font-medium">
                {pagination.number * pagination.size + pagination.numberOfElements}
              </span>{" "}
              trong <span className="font-medium">{pagination.totalElements}</span>{" "}
              người dùng
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => fetchUsers(pagination.number - 1, pagination.size)}
                disabled={pagination.first}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Trước
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i).map((page) => (
                <button
                  key={page}
                  onClick={() => fetchUsers(page, pagination.size)}
                  className={`px-3 py-1 border rounded ${
                    page === pagination.number
                      ? "bg-blue text-white border-blue"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page + 1}
                </button>
              ))}
              <button
                onClick={() => fetchUsers(pagination.number + 1, pagination.size)}
                disabled={pagination.last}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;