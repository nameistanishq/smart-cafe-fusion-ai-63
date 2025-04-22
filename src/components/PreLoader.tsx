
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PreLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const cookingAnimations = [
    {
      id: "dosa",
      title: "Crispy Dosa",
      description: "South Indian rice pancake",
    },
    {
      id: "idli",
      title: "Steamed Idli",
      description: "Soft rice cakes",
    },
    {
      id: "biryani",
      title: "Vegetable Biryani",
      description: "Aromatic rice dish",
    },
  ];

  const [currentAnimation, setCurrentAnimation] = useState(0);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setCurrentAnimation((prev) => (prev + 1) % cookingAnimations.length);
      }, 900);
      return () => clearInterval(interval);
    }
  }, [loading, cookingAnimations.length]);

  const animation = cookingAnimations[currentAnimation];

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cafe-dark"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <motion.h1 
              className="animated-gradient-bg bg-clip-text text-transparent text-5xl font-bold mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Smart Cafeteria
            </motion.h1>
            <motion.p 
              className="text-cafe-text/80 text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Intelligent Dining Experience
            </motion.p>
          </motion.div>

          <div className="relative w-64 h-64 mb-8">
            <motion.div
              key={animation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                <div className="w-24 h-24 border-4 border-cafe-primary/30 border-t-cafe-primary rounded-full animate-spin-slow"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="animate-cooking inline-block">
                    {animation.id === "dosa" ? (
                      <span className="text-4xl">🥞</span>
                    ) : animation.id === "idli" ? (
                      <span className="text-4xl">🍚</span>
                    ) : (
                      <span className="text-4xl">🍚</span>
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            key={`text-${animation.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <h3 className="text-cafe-primary text-xl font-medium mb-1">
              {animation.title}
            </h3>
            <p className="text-cafe-text/70 text-sm">{animation.description}</p>
          </motion.div>

          <motion.div 
            className="mt-8 flex space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {cookingAnimations.map((anim, index) => (
              <div 
                key={anim.id}
                className={`w-2 h-2 rounded-full ${
                  currentAnimation === index 
                    ? "bg-cafe-primary" 
                    : "bg-cafe-primary/30"
                }`}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PreLoader;
