"use client";

import Lottie from "lottie-react";
import { useEffect, useState } from "react";

const ConfettiBurst = ({ onComplete }: { onComplete?: () => void }) => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/lottie/confetti.json")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setAnimationData(data);
      })
      .catch(() => {
        if (isMounted) setAnimationData(null);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (!animationData) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 h-[100dvh] w-[100dvw]">
      <Lottie
        animationData={animationData}
        loop={false}
        autoplay
        // @ts-ignore
        speed={2}
        className="h-full w-full"
        rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }}
        onComplete={() => onComplete?.()}
      />
    </div>
  );
};

export default ConfettiBurst;
