"use client";

import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import { AuthProvider } from "@/contexts/AuthContext";
import QuickViewModal from "@/components/Common/QuickViewModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";
import { Toaster } from "react-hot-toast";

import ScrollToTop from "@/components/Common/ScrollToTop";
import CartInitializer from "@/components/Common/CartInitializer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning={true}>
      <body className="font-sans">
        <ReduxProvider>
          <AuthProvider>
            <CartModalProvider>
              <ModalProvider>
                <PreviewSliderProvider>
                  <CartInitializer />
                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      duration: 3000,
                    }}
                  />

                  <Header />
                  {children}

                  <QuickViewModal />
                  <CartSidebarModal />
                  <PreviewSliderModal />
                </PreviewSliderProvider>
              </ModalProvider>
            </CartModalProvider>
          </AuthProvider>
        </ReduxProvider>
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}
