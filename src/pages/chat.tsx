import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Button } from "@/components/ui/moving-border";
import { Dice6, X } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";
import { SparklesCore } from "@/components/ui/sparkles";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

const loadingStates = [
  { text: "Travelling to the future" },
  { text: "Listening to your future self" },
  { text: "Reflecting on your dreams" },
];

// Shake animation for the pop-up
const shakeAnimation = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 }
};

function ChatPage() {
  const placeholders = [
    "Travel the world and explore cultures",
    "Write a bestselling novel one day",
    "Build a sustainable future for all",
    "Start a business that inspires change",
    "Master the art of cooking gourmet meals",
  ];

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dreamReflection, setDreamReflection] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [showInvalidPopup, setShowInvalidPopup] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [isTextAnimationComplete, setIsTextAnimationComplete] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isWordCountExceeded, setIsWordCountExceeded] = useState(false);
  const maxWords = 200;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const words = e.target.value.trim().split(/\s+/);
    setWordCount(words.length);
    setIsWordCountExceeded(words.length > maxWords);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (wordCount > maxWords) {
      setIsWordCountExceeded(true);
      return;
    }

    setLoading(true);
    setShowSparkles(false);

    try {
      const validationResponse = await axios.post("https://future-self-server.onrender.com/validate_dream", {
        dreams: inputValue,
      });

      if (validationResponse.data.content === "valid") {
        const dreamResponse = await axios.post("https://future-self-server.onrender.com/dreams", {
          dreams: inputValue,
        });

        await new Promise((resolve) => setTimeout(resolve, 800));

        setDreamReflection(dreamResponse.data.content);
        setShowInput(false);
        setShowSparkles(true);
      } else {
        console.log("Dream validation failed:", validationResponse.data.content);
        setShowInvalidPopup(true);
        setShakeKey(prevKey => prevKey + 1);
      }
    } catch (error) {
      console.error("Error during dream validation or creation:", error);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const handleGenerateRandom = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://future-self-server.onrender.com/random_dream");
      console.log("Random dream response:", response.data.content);
      setInputValue(response.data.content);
      const words = response.data.content.trim().split(/\s+/);
      setWordCount(words.length);
      setIsWordCountExceeded(words.length > maxWords); // Update exceeded state
    } catch (error) {
      console.error("Error generating random dream:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleTextAnimationComplete = () => {
    setIsTextAnimationComplete(true);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showInvalidPopup) {
      timer = setTimeout(() => {
        setShowInvalidPopup(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [showInvalidPopup]);

  return (
    <BackgroundGradientAnimation>
      <motion.div 
        className="relative min-h-screen w-full flex flex-col justify-center items-center px-4"
        animate={showInvalidPopup ? shakeAnimation : {}}
        key={shakeKey}
      >
        {loading ? (
          <Loader loadingStates={loadingStates} loading={loading} duration={1000} loop={false} />
        ) : (
          <>
            {showSparkles && (
              <div className="w-full absolute inset-0 h-screen z-0">
                <SparklesCore
                  id="tsparticlesfullpage"
                  background="transparent"
                  minSize={0.6}
                  maxSize={1.4}
                  particleDensity={100}
                  className="w-full h-full"
                  particleColor="#fab4d7"
                />
              </div>
            )}

            {showInput ? (
              <div className="mt-[-10%] z-10">
                <h2 className="mb-6 sm:mb-10 text-xl text-center sm:text-5xl text-black dark:text-white z-10">
                  What Are Your Dreams In Life?
                </h2>
                <div className="w-full max-w-3xl relative">
                  <PlaceholdersAndVanishInput
                    placeholders={placeholders}
                    onChange={handleChange}
                    onSubmit={onSubmit}
                    value={inputValue}
                    maxWords={maxWords}
                  />
                  <div 
                    className={`absolute bottom-[-1.5rem] right-[2rem] text-sm ${isWordCountExceeded ? 'text-red-500' : 'text-gray-500'} dark:text-gray-400`}
                  >
                    {wordCount}/{maxWords} words
                  </div>
                </div>

                <div className="mt-12 pointer-events-auto text-center">
                  <Button
                    borderRadius="1.75rem"
                    className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 z-20"
                    onClick={handleGenerateRandom}
                    disabled={isLoading}
                  >
                    <Dice6 className="w-4 h-4 mr-2" />
                    {isLoading ? "Loading..." : "Generate Random"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-[-10%] z-10 w-full">
                {dreamReflection && (
                  <div className="max-w-8xl mx-auto px-8 py-12 h-[calc(100vh-200px)] sm:h-auto overflow-y-auto scrollbar-hide">
                    <TextGenerateEffect 
                      words={dreamReflection}
                      onAnimationComplete={handleTextAnimationComplete}
                    />
                  </div>
                )}
                
                <AnimatePresence>
                  {isTextAnimationComplete && (
                    <motion.div
                      initial={{ y: 100, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 100, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="absolute bottom-10 left-0 right-0 flex justify-center z-20"
                    >
                      <HoverBorderGradient
                        containerClassName="rounded-full"
                        className="dark:bg-black bg-white text-black dark:text-white px-6 py-3 text-sm md:text-base inline-block cursor-pointer"
                        onClick={handleRefresh}
                      >
                        Keep Dreaming
                      </HoverBorderGradient>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <AnimatePresence>
              {showInvalidPopup && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed bottom-4 left-0 right-0 flex justify-center z-50"
                >
                  <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
                    <span className="mr-2">
                      {wordCount > maxWords
                        ? `Please limit your input to ${maxWords} words.`
                        : "Please enter a valid query"}
                    </span>
                    <button
                      onClick={() => setShowInvalidPopup(false)}
                      className="ml-2 focus:outline-none"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </BackgroundGradientAnimation>
  );
}

export default ChatPage;
