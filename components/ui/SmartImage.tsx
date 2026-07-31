"use client";

import Image from "next/image";
import { useState } from "react";
import { FALLBACK_IMAGE } from "@/lib/data";

interface SmartImageProps extends Omit<React.ComponentProps<typeof Image>, "src"> {
  src: string;
}

export default function SmartImage({ src, alt, ...props }: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <Image
      src={failed ? FALLBACK_IMAGE : src}
      alt={alt}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
