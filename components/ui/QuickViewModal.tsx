"use client";

import React, { useState } from "react";
import {
  X,
  Heart,
  Plus,
  Minus,
  Star,
  ChevronUp,
  ChevronDown,
  ShoppingBag,
} from "lucide-react";
import { CURRENCY, type Product } from "@/lib/data";
import SmartImage from "@/components/ui/SmartImage";
import { useStore } from "@/components/store/StoreProvider";

const formatPrice = (n: number) => `${CURRENCY}${n.toLocaleString("en-BD")}`;

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
}: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toggleWishlist, isWishlisted } = useStore();

  if (!isOpen || !product) return null;

  const activeImage = selectedImage || product.image;
  const wishlisted = isWishlisted(product.id);

  // Mock secondary thumbnails (or use product gallery array if available)
  const thumbnails = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column: Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails Sidebar */}
            <div className="flex flex-col items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600">
                <ChevronUp size={18} />
              </button>

              <div className="flex flex-col gap-2 overflow-hidden">
                {thumbnails.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative h-14 w-14 overflow-hidden rounded-lg border transition-all ${
                      activeImage === img && idx === 0
                        ? "border-emerald-600 ring-1 ring-emerald-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <SmartImage
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>

              <button className="text-gray-400 hover:text-gray-600">
                <ChevronDown size={18} />
              </button>
            </div>

            {/* Main Active Image */}
            <div className="relative aspect-square flex-1 overflow-hidden rounded-xl bg-gray-50">
              <SmartImage
                src={activeImage}
                alt={product.title}
                fill
                sizes="400px"
                className="object-contain p-4"
              />
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col justify-center">
            {/* Title & Badge */}
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">
                {product.title}
              </h2>
              <span className="rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                In Stock
              </span>
            </div>

            {/* Rating & SKU */}
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                  <Star size={14} className="fill-gray-200 text-gray-200" />
                </div>
                <span className="font-medium text-gray-700">4 Review</span>
              </div>
              <span>•</span>
              <span>SKU: 2,51,594</span>
            </div>

            {/* Price section */}
            <div className="mt-4 flex items-baseline gap-3">
              {product.originalPrice && (
                <del className="text-lg text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </del>
              )}
              <span className="text-2xl font-bold text-emerald-600">
                {formatPrice(product.price)}
              </span>
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-500">
                64% Off
              </span>
            </div>

            <hr className="my-5 border-gray-100" />

            {/* Description / Brand info */}
            <p className="text-sm leading-relaxed text-gray-500">
              Class aptent taciti sociosqu ad litora torquent per conubia
              nostra, per inceptos himenaeos. Nulla nibh diam, blandit vel
              consequat nec, ultrices et ipsum.
            </p>

            {/* Quantity Selector & Add to Cart */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-1 text-gray-500 hover:text-gray-800"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-1 text-gray-500 hover:text-gray-800"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-[0.98]"
              >
                <span>Add to Cart</span>
                <ShoppingBag size={16} />
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 transition-colors ${
                  wishlisted
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            <hr className="my-5 border-gray-100" />

            {/* Category & Tags */}
            <div className="space-y-1.5 text-xs text-gray-500">
              <p>
                <strong className="font-semibold text-gray-700">
                  Category:
                </strong>{" "}
                Vegetables
              </p>
              <p>
                <strong className="font-semibold text-gray-700">Tag:</strong>{" "}
                Vegetables Healthy <span className="underline">Chinese</span>{" "}
                Cabbage Green Cabbage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
