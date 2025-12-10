import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import adminService from "../../services/admin";
import { Product } from "../../types/product";
import { PaginatedResponse } from "../../types/category";

interface ProductManagerProps {
  onUpdate: () => void;
}

const ProductManager: React.FC<ProductManagerProps> = ({ onUpdate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
    isActive: true,
  });

  // Pagination state
  const [pagination, setPagination] = useState<PaginatedResponse<Product>>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    size: 10,
    number: 0,
    first: true,
    last: true,
    numberOfElements: 0,
  });

  // Fetch products
  // Always fetch 10 items per page as requested
  const fetchProducts = async (page: number = 0, size: number = 10) => {
    try {
      setLoading(true);
      const response: PaginatedResponse<Product> =
        await adminService.getAllProductsForAdmin(page, size);

      // Handle paginated response
      setProducts(response.content);

      // Update pagination state with actual pagination data
      setPagination(response);
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const data = await adminService.getAllCategories(0, 1000); // Get all categories for dropdown
      setCategories(data.content);
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProducts(pagination.number, pagination.size);
    fetchCategories();
  }, []);

  // Helper function to get category name by ID
  const getCategoryName = (categoryId?: number): string => {
    if (!categoryId) return "-";
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "-";
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        categoryId: parseInt(formData.categoryId, 10) || null,
      };

      if (editingProduct) {
        // Update existing product
        await adminService.updateProduct(editingProduct.id, productData);
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        // Create new product
        await adminService.createProduct(productData);
        toast.success("Tạo sản phẩm thành công");
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        sku: "",
        stock: "",
        categoryId: "",
        imageUrl: "",
        isActive: true,
      });
      fetchProducts(pagination.number, pagination.size);
      onUpdate();
    } catch (error: any) {
      toast.error(error.message || "Không thể lưu sản phẩm");
    }
  };

  // Handle edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      sku: "",
      stock: product.stock?.toString() || "",
      categoryId: product.categoryId?.toString() || "",
      imageUrl: product.imageUrl || "",
      isActive: product.isActive !== false,
    });
    setShowModal(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      return;
    }

    try {
      await adminService.deleteProduct(id);
      toast.success("Xóa sản phẩm thành công");
      fetchProducts(pagination.number, pagination.size);
      onUpdate();
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      toast.error(error.message);
    }
  };

  // Toggle product status
  const toggleStatus = async (product: Product) => {
    try {
      await adminService.updateProduct(product.id, {
        ...product,
        isActive: !product.isActive,
      });
      toast.success(
        `Sản phẩm đã ${product.isActive ? "vô hiệu hóa" : "kích hoạt"} thành công`
      );
      fetchProducts(pagination.number, pagination.size);
      onUpdate();
    } catch (error: any) {
      console.error("Failed to update product status:", error);
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
        <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Thêm sản phẩm
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {(() => {
                          // Check if image URL is from via.placeholder.com and use fallback instead
                          const getImageSrc = () => {
                            if (!product.imageUrl) return null;
                            if (product.imageUrl.includes('via.placeholder.com')) {
                              return "/images/placeholder-product.jpg";
                            }
                            return product.imageUrl;
                          };
                          
                          const imageSrc = getImageSrc();
                          return imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={product.name || "Product"}
                              width={40}
                              height={40}
                              className="rounded-full mr-3"
                              unoptimized={imageSrc.startsWith('/images/')}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (!target.src.includes('placeholder-product.jpg')) {
                                  target.src = "/images/placeholder-product.jpg";
                                }
                              }}
                            />
                          ) : null;
                        })()}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {/* {product.sku} */}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getCategoryName(product.categoryId)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.stock || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.isActive ? "Đang hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue hover:text-blue-600 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => toggleStatus(product)}
                        className={`${
                          product.isActive
                            ? "text-orange hover:text-orange-600"
                            : "text-green hover:text-green-600"
                        } mr-3`}
                      >
                        {product.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id!)}
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
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    Không tìm thấy sản phẩm nào. Nhấp &quot;Thêm sản phẩm&quot; để tạo
                    your first product.
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
                fetchProducts(pagination.number - 1, pagination.size)
              }
              disabled={!pagination.first}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() =>
                fetchProducts(pagination.number + 1, pagination.size)
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
                {pagination.totalElements > 0 ? (
                  <>
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
                    <span className="font-medium">
                      {pagination.totalElements}
                    </span>{" "}
                    kết quả
                  </>
                ) : (
                  <>Không có kết quả</>
                )}
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Phân trang"
              >
                <button
                  onClick={() =>
                    fetchProducts(pagination.number - 1, pagination.size)
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
                    onClick={() => fetchProducts(page - 1, pagination.size)}
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
                    fetchProducts(pagination.number + 1, pagination.size)
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
              {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm
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
                  SKU
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tồn kho
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL hình ảnh
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
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
                    setEditingProduct(null);
                    setFormData({
                      name: "",
                      description: "",
                      price: "",
                      sku: "",
                      stock: "",
                      categoryId: "",
                      imageUrl: "",
                      isActive: true,
                    });
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {editingProduct ? "Cập nhật" : "Tạo mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
