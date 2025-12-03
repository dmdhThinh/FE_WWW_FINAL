import React, { useState } from "react";

interface PaymentMethodProps {
  onPaymentChange: (method: 'VNPAY' | 'CASH_ON_DELIVERY') => void;
}

const PaymentMethod = ({ onPaymentChange }: PaymentMethodProps) => {
  const [payment, setPayment] = useState<'VNPAY' | 'CASH_ON_DELIVERY'>("VNPAY");

  const handlePaymentChange = (method: 'VNPAY' | 'CASH_ON_DELIVERY') => {
    setPayment(method);
    onPaymentChange(method);
  };
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Phương thức thanh toán</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          <label
            htmlFor="vnpay"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio"
                name="payment"
                id="vnpay"
                className="sr-only"
                checked={payment === "VNPAY"}
                onChange={() => handlePaymentChange("VNPAY")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "VNPAY"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:-translate-y-0.5 w-full bg-gradient-to-r from-[#005AAA] via-[#0f6bd8] to-[#D6001C] text-white ${
                payment === "VNPAY"
                  ? "border-transparent shadow-[0_10px_25px_-12px_rgba(0,0,0,0.35)] ring-2 ring-blue ring-offset-2"
                  : "border-white/30 shadow-[0_5px_15px_-5px_rgba(0,0,0,0.2)] opacity-90"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="pr-2.5">
                  <div className="w-10 h-10 rounded flex items-center justify-center text-white font-bold text-sm bg-white/15">
                    VN
                  </div>
                </div>

                <div className="pl-2.5 border-l flex-1 border-white/40">
                  <p className="text-base font-semibold text-white">VNPAY</p>
                  <p className="text-xs text-white/80">Thanh toán online qua VNPAY</p>
                </div>
              </div>
            </div>
          </label>

          <label
            htmlFor="cash"
            className="flex cursor-pointer select-none items-center gap-4"
          >
            <div className="relative">
              <input
                type="radio"
                name="payment"
                id="cash"
                className="sr-only"
                checked={payment === "CASH_ON_DELIVERY"}
                onChange={() => handlePaymentChange("CASH_ON_DELIVERY")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  payment === "CASH_ON_DELIVERY"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div
              className={`rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:-translate-y-0.5 w-full bg-gradient-to-r from-[#10B981] via-[#059669] to-[#047857] text-white ${
                payment === "CASH_ON_DELIVERY"
                  ? "border-transparent shadow-[0_10px_25px_-12px_rgba(0,0,0,0.35)] ring-2 ring-green-500 ring-offset-2"
                  : "border-white/30 shadow-[0_5px_15px_-5px_rgba(0,0,0,0.2)] opacity-90"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="pr-2.5">
                  <div className="w-10 h-10 rounded flex items-center justify-center text-white font-bold text-sm bg-white/15">
                    <svg 
                      className="w-6 h-6" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" 
                      />
                    </svg>
                  </div>
                </div>

                <div className="pl-2.5 border-l flex-1 border-white/40">
                  <p className="text-base font-semibold text-white">Thanh toán khi nhận hàng</p>
                  <p className="text-xs text-white/80">Thanh toán bằng tiền mặt khi nhận hàng</p>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
