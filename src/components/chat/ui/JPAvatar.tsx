import Image from "next/image";

interface JPAvatarProps {
  size: number;
  rounded?: boolean;
}

export function JPAvatar({ size, rounded = true }: JPAvatarProps) {
  return (
    <div
      className={`bg-white p-0.5 shrink-0 flex items-center justify-center ${
        rounded ? "rounded-full" : "rounded-full"
      }`}
    >
      <Image
        src="/vm-avatar.png"
        alt="Juan Pablo"
        width={size}
        height={size}
        loading="lazy"
        className="object-contain rounded-full"
      />
    </div>
  );
}
