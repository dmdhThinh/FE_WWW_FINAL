import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import adminService from "../../services/admin";
import { Category, PaginatedResponse } from "../../types/category";

interface CategoryManagerProps {
  onUpdate: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({ onUpdate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  // Pagination state
  const [pagination, setPagination] = useState<PaginatedResponse<Category>>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0,
    first: true,
    last: true,
    numberOfElements: 0,
  });

  // Fetch categories
  const fetchCategories = async (page: number = 0, size: number = 10) => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Category> =
        await adminService.getAllCategories(page, size);

      // Handle paginated response
      setCategories(response.content);
      setPagination(response);
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        // Update existing category
        await adminService.updateCategory(editingCategory.id!, formData);
        toast.success("Cập nhật danh mục thành công");
      } else {
        // Create new category
        await adminService.createCategory(formData);
        toast.success("Tạo danh mục thành công");
      }

      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: "", description: "", isActive: true });
      fetchCategories(pagination.number, pagination.size);
      onUpdate();
    } catch (error: any) {
      console.error("Failed to save category:", error);
      toast.error(error.message);
    }
  };

  // Handle edit
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive !== false,
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
      return;
    }

    try {
      await adminService.deleteCategory(id);
      toast.success("Xóa danh mục thành công");
      fetchCategories(pagination.number, pagination.size);
      onUpdate();
    } catch (error: any) {
      console.error("Failed to delete category:", error);
      toast.error(error.message);
    }
  };

  // Toggle category status
  const toggleStatus = async (category: Category) => {
    try {
      await adminService.updateCategory(category.id!, {
        isActive: !category.isActive,
      });
      toast.success(
        `Danh mục đã ${category.isActive ? "vô hiệu hóa" : "kích hoạt"} thành công`
      );
      fetchCategories(pagination.number, pagination.size);
      onUpdate();
    } catch (error: any) {
      console.error("Failed to update category status:", error);
      toast.error(error.message);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Quản lý danh mục
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Thêm danh mục
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th> */}
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th> */}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {category.description || "-"}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(category as any).createdAt
                        ? new Date(
                            (category as any).createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue hover:text-blue-600 mr-3"
                      >
                        Sửa
                      </button>
                      {/* <button
                        onClick={() => toggleStatus(category)}
                        className={`${
                          category.isActive
                            ? "text-orange hover:text-orange-600"
                            : "text-green hover:text-green-600"
                        } mr-3`}
                      >
                        {category.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                      </button> */}
                      <button
                        onClick={() => handleDelete(category.id!)}
                        className="text-red hover:text-red-600"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Không tìm thấy danh mục nào. Nhấp &quot;Thêm danh mục&quot; để
                    create your first category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() =>
                fetchCategories(pagination.number - 1, pagination.size)
              }
              disabled={!pagination.first}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() =>
                fetchCategories(pagination.number + 1, pagination.size)
              }
              disabled={pagination.last}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị{" "}
                <span className="font-medium">
                  {pagination.number * pagination.size + 1}
                </span>{" "}
                đến{" "}
                <span className="font-medium">
                  {pagination.number * pagination.size +
                    pagination.numberOfElements}
                </span>{" "}
                trong{" "}
                <span className="font-medium">{pagination.totalElements}</span>{" "}
                kết quả
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Phân trang"
              >
                <button
                  onClick={() =>
                    fetchCategories(pagination.number - 1, pagination.size)
                  }
                  disabled={!pagination.first}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Trước</span>
                  {/* Previous icon */}
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchCategories(page - 1, pagination.size)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === pagination.number + 1
                        ? "z-10 bg-blue border-blue text-white"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    fetchCategories(pagination.number + 1, pagination.size)
                  }
                  disabled={pagination.last}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Sau</span>
                  {/* Next icon */}
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="h-4 w-4 text-blue focus:ring-blue border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Đang hoạt động
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCategory(null);
                    setFormData({ name: "", description: "", isActive: true });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {editingCategory ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
