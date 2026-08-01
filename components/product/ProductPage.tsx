"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Plus,
  Minus,
  Star,
  ChevronUp,
  ChevronDown,
  ShoppingBag,
  Play,
  CheckCircle2,
  Tag,
  Leaf,
  Eye,
} from "lucide-react";
import SmartImage from "@/components/ui/SmartImage";
import BackButton from "@/components/ui/BackButton";
import { CURRENCY, type Product } from "@/lib/data";
import { useStore } from "@/components/store/StoreProvider";

const formatPrice = (n: number) => `${CURRENCY}${n.toLocaleString("en-BD")}`;

// Inline fallback for ProductCard to eliminate missing module errors
function RelatedProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isWishlisted, addToCart } = useStore();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white p-3 transition-all duration-300 hover:border-emerald-500 hover:shadow-lg">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50">
        <SmartImage
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span className="absolute left-2 top-2 rounded bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
            {product.badge}
          </span>
        )}

        {/* Action Buttons */}
        <div className="absolute right-2 top-2 flex flex-col gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className={`flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm transition-colors ${
              wishlisted
                ? "text-red-500 border-red-200"
                : "text-gray-600 hover:text-emerald-600"
            }`}
          >
            <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
          </button>
          <Link
            href={`/product/${product.id}`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:text-emerald-600"
          >
            <Eye size={14} />
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/product/${product.id}`}
            className="line-clamp-1 text-sm font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
          >
            {product.title}
          </Link>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className="fill-amber-400 text-amber-400"
              />
            ))}
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-sm font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <del className="ml-1 text-xs text-gray-400">
                {formatPrice(product.originalPrice)}
              </del>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-700 transition-colors hover:bg-emerald-600 hover:text-white"
            aria-label="Add to cart"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProductPageProps {
  product: Product;
  related: Product[];
}

export default function ProductPage({ product, related }: ProductPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "descriptions" | "additional" | "feedback"
  >("descriptions");
  const { toggleWishlist, isWishlisted, addToCart } = useStore();
  const wishlisted = isWishlisted(product.id);

  const galleryImages = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];
  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton
        fallbackHref="/shop"
        label="Back to Shop"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-900"
      />
      {/* Top Main Product Details */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Left Column: Vertical Thumbnails + Main Image */}
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronUp size={18} />
            </button>

            <div className="flex flex-col gap-3 overflow-hidden">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative h-16 w-16 overflow-hidden rounded-lg border transition-all ${
                    selectedImage === img
                      ? "border-emerald-600 ring-1 ring-emerald-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <SmartImage
                    src={img}
                    alt={`${product.title} view ${idx + 1}`}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronDown size={18} />
            </button>
          </div>

          <div className="relative aspect-square flex-1 overflow-hidden rounded-2xl bg-gray-50 border border-gray-100">
            <SmartImage
              src={selectedImage}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-contain p-6"
            />
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.title}
            </h1>
            <span className="rounded bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              In Stock
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {[...Array(4)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
                <Star size={14} className="fill-gray-200 text-gray-200" />
              </div>
              <span className="font-medium text-gray-700">4 Review</span>
            </div>
            <span>•</span>
            <span>SKU: {product.id.toString().slice(-6)}</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            {product.originalPrice && (
              <del className="text-lg text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </del>
            )}
            <span className="text-2xl font-bold text-emerald-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-500">
                {Math.round(
                  ((product.originalPrice - product.price) / product.originalPrice) * 100
                )}
                % Off
              </span>
            )}
          </div>

          <hr className="my-5 border-gray-100" />

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <span>Brand:</span>
              <div className="flex items-center gap-1 rounded border border-gray-200 px-2 py-1 font-semibold text-gray-700">
                <Leaf size={14} className="text-emerald-600" /> Farmary
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span>Share item:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white transition-opacity hover:opacity-90"
                ></button>
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                ></button>
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                ></button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            Class aptent taciti sociosqu ad litora torquent per conubia nostra,
            per inceptos himenaeos. Nulla nibh diam, blandit vel consequat nec,
            ultrices et ipsum. Nulla varius magna a consequat pulvinar.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="p-1 text-gray-500 hover:text-gray-800 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-semibold text-gray-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="p-1 text-gray-500 hover:text-gray-800 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => addToCart(product.id, quantity)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
              <span>Add to Cart</span>
              <ShoppingBag size={16} />
            </button>

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 transition-colors ${
                wishlisted
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Wishlist product"
            >
              <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <hr className="my-5 border-gray-100" />

          <div className="space-y-1.5 text-xs text-gray-500">
            <p>
              <strong className="font-semibold text-gray-700">Category:</strong>{" "}
              Vegetables
            </p>
            <p>
              <strong className="font-semibold text-gray-700">Tag:</strong>{" "}
              Vegetables Healthy{" "}
              <span className="underline cursor-pointer hover:text-emerald-600">
                Chinese
              </span>{" "}
              Cabbage Green Cabbage
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="mt-16 border-b border-gray-200">
        <div className="flex justify-center gap-8 text-sm font-medium">
          {(["descriptions", "additional", "feedback"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`pb-4 transition-all capitalize ${
                activeTab === tab
                  ? "border-b-2 border-emerald-600 text-emerald-600 font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab === "descriptions"
                ? "Descriptions"
                : tab === "additional"
                  ? "Additional Information"
                  : "Customer Feedback"}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Body */}
      <div className="mt-8">
        {activeTab === "descriptions" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-4 text-xs leading-relaxed text-gray-500">
              <p>
                Sed commodo aliquam dui ac porta. Fusce ipsum felis, imperdiet
                at posuere ac, viverra at mauris. Maecenas tincidunt ligula a
                sem vestibulum pharetra. Maecenas auctor tortor lacus, nec
                laoreet nisi porttitor vel. Etiam tincidunt metus vel dui
                interdum sollicitudin.
              </p>
              <p>
                Nulla mauris tellus, feugiat quis pharetra sed, gravida ac dui.
                Sed iaculis, metus faucibus elementum tincidunt, turpis mi
                viverra velit, pellentesque tristique neque mi eget nulla.
              </p>

              <ul className="mt-4 space-y-2">
                {[
                  "100 g of fresh leaves provides.",
                  "Aliquam ac est at augue volutpat elementum.",
                  "Quisque nec enim eget sapien molestie.",
                  "Proin convallis odio volutpat finibus posuere.",
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-gray-700 font-medium"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-emerald-600 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100">
                <SmartImage
                  src={product.image}
                  alt="Product Video Preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                  aria-label="Play video"
                >
                  <Play size={22} className="ml-1 fill-white" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Tag size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">
                      64% Discount
                    </h4>
                    <p className="text-[10px] text-gray-400">
                      Save your 64% money with us
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Leaf size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">
                      100% Organic
                    </h4>
                    <p className="text-[10px] text-gray-400">
                      100% Organic Vegetables
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "additional" && (
          <div className="p-4 text-xs text-gray-500">
            <p>Weight: 1kg</p>
            <p className="mt-1">Color: Green</p>
            <p className="mt-1">Type: Organic Fresh Produce</p>
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="p-4 text-xs text-gray-500">
            <p>No customer reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {related && related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Related Products
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {related.map((relProduct) => (
              <RelatedProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
