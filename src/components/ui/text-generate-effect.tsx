import React, { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  onAnimationComplete,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  onAnimationComplete?: () => void;
}) => {
  const [scope, animate] = useAnimate();
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  let wordsArray = words.split(" ");

  useEffect(() => {
    const animation = animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 2,
        delay: stagger(0.08),
      }
    );

    animation.then(() => {
      setIsAnimationComplete(true);
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, [scope.current, animate, duration, filter, onAnimationComplete]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="dark:text-white text-black opacity-0"
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className=" dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};