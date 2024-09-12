import React from "react";
import Link from "next/link";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export function BackgroundGradientAnimationDemo() {
  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex flex-col items-center justify-center text-black pointer-events-none">
        <h1 className="font-bold px-4 text-3xl text-center md:text-4xl lg:text-7xl mb-2">
          <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-black/80 to-black/50">
            Your Future Self
          </p>
        </h1>

        <p className="text-gray-600 text-sm md:text-base lg:text-lg text-center mb-8">
          A journey towards your aspirations and dreams.
        </p>

        <div className="pointer-events-auto">
          <Link href="/chat" passHref legacyBehavior>
            <HoverBorderGradient
              containerClassName="rounded-full"
              className="dark:bg-black bg-white text-black dark:text-white px-6 py-3 text-sm md:text-base inline-block cursor-pointer"
            >
              Start Dreaming
            </HoverBorderGradient>
          </Link>
        </div>
      </div>
    </BackgroundGradientAnimation>
  );
}

export default BackgroundGradientAnimationDemo;