import React, { useState } from "react";
import { Order } from "../../types/order";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";
import orderService from "../../services/order";

const SingleOrder = ({ orderItem, smallView }: { orderItem: Order; smallView: boolean }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const toggleModal = (status: boolean) => {
    setShowDetails(status);
    setShowEdit(status);
  };

  return (
    <>
      {!smallView && (
        <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
          <div className="min-w-[111px]">
            <p className="text-custom-sm text-red">
              #{orderItem.orderCode?.slice(-8) || orderItem.id?.toString().slice(-8)}
            </p>
          </div>
          <div className="min-w-[175px]">
            <p className="text-custom-sm text-dark">{orderItem.formattedCreatedAt || orderService.formatDate(orderItem.createdAt)}</p>
          </div>

          <div className="min-w-[128px]">
            <p
              className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] capitalize ${orderItem.statusColor || orderService.getStatusColor(orderItem.status as any)}`}
            >
              {orderService.getStatusLabel(orderItem.status as any)}
            </p>
          </div>

          <div className="min-w-[213px]">
            <p className="text-custom-sm text-dark">
              {orderItem.items && orderItem.items.length > 0
                ? `${orderItem.items[0].productName}${orderItem.items.length > 1 ? ` +${orderItem.items.length - 1} more` : ''}`
                : `Order #${orderItem.id}`
              }
            </p>
          </div>

          <div className="min-w-[113px]">
            <p className="text-custom-sm text-dark">{orderItem.formattedTotal || orderService.formatCurrency(orderItem.finalAmount || 0)}</p>
          </div>

          <div className="flex gap-5 items-center">
            <OrderActions
              toggleDetails={toggleDetails}
              toggleEdit={toggleEdit}
            />
          </div>
        </div>
      )}

      {smallView && (
        <div className="block md:hidden">
          <div className="py-4.5 px-7.5">
            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2"> Order:</span> #
                {orderItem.orderCode?.slice(-8) || orderItem.id?.toString().slice(-8)}
              </p>
            </div>
            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Date:</span>{" "}
                {orderItem.formattedCreatedAt || orderService.formatDate(orderItem.createdAt)}
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Status:</span>{" "}
                <span
                  className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] capitalize ${orderItem.statusColor || orderService.getStatusColor(orderItem.status as any)}`}
                >
                  {orderService.getStatusLabel(orderItem.status as any)}
                </span>
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Title:</span>{" "}
                {orderItem.items && orderItem.items.length > 0
                  ? `${orderItem.items[0].productName}${orderItem.items.length > 1 ? ` +${orderItem.items.length - 1} more` : ''}`
                  : `Order #${orderItem.id}`
                }
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Total:</span>{" "}
                {orderItem.formattedTotal || orderService.formatCurrency(orderItem.finalAmount || 0)}
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark flex items-center">
                <span className="font-bold pr-2">Actions:</span>{" "}
                <OrderActions
                  toggleDetails={toggleDetails}
                  toggleEdit={toggleEdit}
                />
              </p>
            </div>
          </div>
        </div>
      )}

      <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={orderItem}
      />
    </>
  );
};

export default SingleOrder;
