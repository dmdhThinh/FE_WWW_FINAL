import { selectCartTotal, selectCartItems } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import React from "react";
import { CartItem } from "@/types/cart";
import Link from "next/link";

const OrderSummary = () => {
  const cartItems = useAppSelector(selectCartItems);
  const totalPrice = useAppSelector(selectCartTotal);

  return (
    <div className="lg:max-w-[455px] w-full">
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">Tóm tắt đơn hàng</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- title --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">Sản phẩm</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">Tổng tiền</h4>
            </div>
          </div>

          {/* <!-- product item --> */}
          {cartItems.map((item: CartItem, key: number) => (
            <div
              key={key}
              className="flex items-center justify-between py-5 border-b border-gray-3"
            >
              <div>
                <p className="text-dark">{item.productName || "Product"}</p>
              </div>
              <div>
                <p className="text-dark text-right">
                  $
                  {(
                    item.subtotal || (item.price || 0) * (item.quantity || 0)
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          {/* <!-- total --> */}
          <div className="flex items-center justify-between pt-5">
            <div>
              <p className="font-medium text-lg text-dark">Tổng cộng</p>
            </div>
            <div>
              <p className="font-medium text-lg text-dark text-right">
                ${totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* <!-- checkout button --> */}
          <Link
            href="/checkout"
            className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
          >
            Thanh toán
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
