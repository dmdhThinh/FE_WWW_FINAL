"use client";

import React, { useEffect } from "react";
import SingleItem from "./SingleItem";
import Image from "next/image";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { fetchBestSellers, selectBestSellers, selectProductLoading } from "@/redux/features/product-details";
import ProductItem from "@/components/Common/ProductItem";

const BestSeller = () => {
  const dispatch = useAppDispatch();
  const bestSellers = useAppSelector(selectBestSellers);
  const isLoading = useAppSelector(selectProductLoading);

  useEffect(() => {
    // Fetch best sellers on component mount
    dispatch(fetchBestSellers(3));
  }, [dispatch]);

  return (
    <section className="overflow-hidden">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={17}
                height={17}
              />
              This Month
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              Best Sellers
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {/* <!-- Best Sellers item --> */}
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="relative overflow-hidden flex items-center justify-center rounded-lg bg-gray-200 min-h-[270px] mb-4">
                  <div className="w-32 h-32 bg-gray-300 rounded"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
          ) : bestSellers.length > 0 ? (
            bestSellers.map((product, key) => (
              <ProductItem item={product} key={product.id} />
            ))
          ) : (
            // Fallback or empty state
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No best sellers available at the moment.</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop-without-sidebar"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
