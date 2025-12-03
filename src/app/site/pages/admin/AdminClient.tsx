"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminDashboard from "@/components/Admin/AdminDashboard";
import { authService } from "../../../../services/auth";
import { useAppSelector } from "@/redux/store";
import { selectIsAuthenticated, selectUser } from "@/redux/features/user-slice";

const AdminClient = () => {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      // Nếu không có token, chuyển về signin ngay
      if (!token) {
        setIsAdmin(false);
        setLoading(false);
        router.push("/signin");
        return;
      }

      // Có token, kiểm tra quyền admin bằng cách gọi API
      try {
        setLoading(true);
        const profileData = await authService.getProfile();
        const isUserAdmin = (profileData as any).isAdmin === true;

        if (!isUserAdmin) {
          setIsAdmin(false);
          setLoading(false);
          router.push("/my-account");
          return;
        }

        setIsAdmin(true);
        setLoading(false);
      } catch (error) {
        console.error("Failed to verify admin access:", error);
        // Token không hợp lệ hoặc đã hết hạn
        setIsAdmin(false);
        setLoading(false);
        router.push("/signin");
      }
    };

    checkAdminAccess();
  }, [router]); // Chỉ phụ thuộc vào router, không phụ thuộc vào isAuthenticated/user để tránh redirect khi reload

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-2">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-2">
        <div className="text-center">
          <div className="text-red text-6xl mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-dark mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don&apos;t have permission to access the admin panel.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Go to Main Page
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default AdminClient;