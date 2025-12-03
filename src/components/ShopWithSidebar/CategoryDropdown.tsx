"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/category";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { selectCategories, selectCategoriesLoading, fetchAllCategories } from "@/redux/features/category-slice";

interface CategoryDropdownProps {
  selectedCategory?: number; // For backward compatibility
  selectedCategories?: number[]; // Support multiple categories
  onCategoryChange?: (categoryId: number) => void;
  onCategoriesChange?: (categoryIds: number[]) => void; // For multiple categories
}

interface CategoryItemProps {
  category: Category;
  isSelected: boolean;
  onSelect: (categoryId: number) => void;
  onToggle?: (categoryId: number) => void; // For multiple selection
}

const CategoryItem = ({ category, isSelected, onSelect, onToggle }: CategoryItemProps) => {
  const handleClick = () => {
    if (onToggle) {
      onToggle(category.id!);
    } else {
      onSelect(category.id!);
    }
  };

  return (
    <button
      className={`${
        isSelected && "text-blue"
      } group flex items-center justify-between ease-out duration-200 hover:text-blue `}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <div
          className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border ${
            isSelected ? "border-blue bg-blue" : "bg-white border-gray-3"
          }`}
        >
          <svg
            className={isSelected ? "block" : "hidden"}
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
              stroke="white"
              strokeWidth="1.94437"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span>{category.name}</span>
      </div>

      {/* <span
        className={`${
          isSelected ? "text-white bg-blue" : "bg-gray-2"
        } inline-flex rounded-[30px] text-custom-xs px-2 ease-out duration-200 group-hover:text-white group-hover:bg-blue`}
      >
        {category.productCount || 0}
      </span> */}
    </button>
  );
};

const CategoryDropdown = ({ 
  selectedCategory, 
  selectedCategories = [],
  onCategoryChange, 
  onCategoriesChange 
}: CategoryDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);
  const isLoading = useAppSelector(selectCategoriesLoading);

  useEffect(() => {
    dispatch(fetchAllCategories({ page: 0, size: 100 }));
  }, [dispatch]);

  // Determine if we're using multiple selection mode
  const isMultipleMode = !!onCategoriesChange;
  
  // Get selected state for a category
  const isCategorySelected = (categoryId?: number): boolean => {
    if (!categoryId) return false;
    if (isMultipleMode) {
      return selectedCategories.includes(categoryId);
    }
    return selectedCategory === categoryId;
  };

  // Handle category toggle for multiple selection
  const handleCategoryToggle = (categoryId: number) => {
    if (isMultipleMode && onCategoriesChange) {
      const newSelected = isCategorySelected(categoryId)
        ? selectedCategories.filter(id => id !== categoryId)
        : [...selectedCategories, categoryId];
      onCategoriesChange(newSelected);
    } else if (onCategoryChange) {
      // Single selection mode - toggle behavior
      if (selectedCategory === categoryId) {
        // Deselect if clicking the same category - pass undefined to clear
        onCategoryChange(0);
      } else {
        onCategoryChange(categoryId);
      }
    }
  };

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown && "shadow-filter"
        }`}
      >
        <p className="text-dark">Danh mục</p>
        <button
          aria-label="nút danh mục"
          className={`text-dark ease-out duration-200 ${
            toggleDropdown && "rotate-180"
          }`}
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      {/* dropdown && 'shadow-filter */}
      {/* <!-- dropdown menu --> */}
      <div
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue"></div>
          </div>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              isSelected={isCategorySelected(category.id)}
              onSelect={(categoryId) => onCategoryChange?.(categoryId)}
              onToggle={handleCategoryToggle}
            />
          ))
        ) : (
          <div className="text-center py-4 text-gray-500 text-sm">
            Không có danh mục nào
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDropdown;
