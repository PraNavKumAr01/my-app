import React, { useState, useEffect } from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import axios from "axios";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { useRouter } from "next/router";

const loadingStates = [
  { text: "Gathering resources" },
  { text: "Building the dream machine" },
  { text: "Testing the dream machine" },
  { text: "Preparing to launch the dream machine" },
  { text: "Finalizing features" },
  { text: "Optimizing performance" },
  { text: "Polishing the user experience" },
  { text: "Ready for lift-off!" },
];

export function BackgroundGradientAnimationDemo() {
  const [loading, setLoading] = useState(false);
  const [showText, setShowText] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      setShowText(true);
    }
  }, [loading]);

  const handleClick = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://future-self-server.onrender.com/health");

      if (response.status === 200) {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Error fetching /health:", error);
      setLoading(false);
      setShowText(false);
    }
  };

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

        {/* Loader Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
            <Loader loadingStates={loadingStates} loading={loading} duration={2000} />
          </div>
        )}

        <div className="pointer-events-auto">
          <HoverBorderGradient
            containerClassName="rounded-full"
            className="dark:bg-black bg-white text-black dark:text-white px-6 py-3 text-sm md:text-base inline-block cursor-pointer"
            onClick={handleClick}
            disabled={loading}
          >
            Start Dreaming
          </HoverBorderGradient>
        </div>

        {/* Bottom Text */}
        {showText && (
          <div className="absolute bottom-8 left-0 right-0 text-center z-50">
            <p className="text-gray-800 font-semibold">Thank you for your patience!</p>
            <p className="text-gray-600 text-sm">Expected load time: ~1 minute</p>
          </div>
        )}
      </div>
    </BackgroundGradientAnimation>
  );
}

export default BackgroundGradientAnimationDemo;