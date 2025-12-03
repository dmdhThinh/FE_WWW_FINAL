import React from "react";
import { Order } from "../../types/order";
import orderService from "../../services/order";

const OrderDetails = ({ orderItem }: { orderItem: Order }) => {
  return (
    <>
      <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex ">
        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Order</p>
        </div>
        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Date</p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Status</p>
        </div>

        {/* <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Title</p>
        </div> */}

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Total</p>
        </div>

        {/* <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">Action</p>
        </div> */}
      </div>

      <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
        <div className="min-w-[111px]">
          <p className="text-custom-sm text-red">
            #
            {orderItem.orderCode?.slice(-8) ||
              orderItem.id?.toString().slice(-8)}
          </p>
        </div>
        <div className="min-w-[175px]">
          <p className="text-custom-sm text-dark">
            {orderItem.formattedCreatedAt ||
              orderService.formatDate(orderItem.createdAt)}
          </p>
        </div>

        <div className="min-w-[128px]">
          <p
            className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] capitalize ${orderItem.statusColor || orderService.getStatusColor(orderItem.status as any)}`}
          >
            {orderService.getStatusLabel(orderItem.status as any)}
          </p>
        </div>

        <div className="min-w-[113px]">
          <p className="text-custom-sm text-dark">
            {orderItem.formattedTotal ||
              orderService.formatCurrency(orderItem.finalAmount || 0)}
          </p>
        </div>
      </div>

      {/* Order Items */}
      {orderItem.items && orderItem.items.length > 0 && (
        <div className="px-7.5 w-full mt-4">
          <p className="font-bold mb-3">Order Items:</p>
          {orderItem.items.map((item, index) => (
            <div
              key={item.id || index}
              className="flex justify-between items-center py-2 border-b border-gray-2 last:border-b-0"
            >
              <div className="flex-1">
                <p className="text-sm text-dark font-medium">
                  {item.productName}
                </p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-dark">
                  {item.price || orderService.formatCurrency(item.price || 0)}
                </p>
                <p className="text-xs text-gray-500">
                  Subtotal:{" "}
                  {item.price ||
                    orderService.formatCurrency(item.subTotal || 0)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment and Shipping Info */}
      <div className="px-7.5 w-full mt-4 space-y-3">
        <div>
          <p className="font-bold">Payment Method:</p>{" "}
          <p>
            {orderService.getPaymentMethodLabel(orderItem.paymentMethod as any)}
          </p>
        </div>

        <div>
          <p className="font-bold">Payment Status:</p>{" "}
          <p
            className={`inline-block text-sm py-0.5 px-2.5 rounded-full ${
              orderItem.paymentStatus === "COMPLETED"
                ? "text-green bg-green-light-6"
                : orderItem.paymentStatus === "PENDING"
                  ? "text-yellow bg-yellow-light-4"
                  : orderItem.paymentStatus === "FAILED"
                    ? "text-red bg-red-light-6"
                    : "text-gray bg-gray-light-6"
            }`}
          >
            {orderService.getPaymentStatusLabel(orderItem.paymentStatus as any)}
          </p>
        </div>

        <div>
          <p className="font-bold">Shipping Address:</p>{" "}
          <p>{orderItem.shippingAddress || "Not provided"}</p>
        </div>

        {orderItem.note && (
          <div>
            <p className="font-bold">Order Note:</p> <p>{orderItem.note}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-gray-3">
          <p className="font-bold">Total Amount:</p>
          <p className="font-bold text-lg">
            {orderItem.formattedTotal ||
              orderService.formatCurrency(orderItem.finalAmount || 0)}
          </p>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
