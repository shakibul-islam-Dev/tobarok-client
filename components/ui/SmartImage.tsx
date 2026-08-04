"use client";

import Image from "next/image";

interface SmartImageProps extends Omit<React.ComponentProps<typeof Image>, "src"> {
  src: string;
}

export default function SmartImage({ src, alt, ...props }: SmartImageProps) {
  return <Image src={src} alt={alt} {...props} />;
}
