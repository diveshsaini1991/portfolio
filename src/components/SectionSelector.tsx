"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import TiltedCard from "@/components/TiltedCard";
import LetterGlitch from "@/components/LetterGlitch";
import Orb from "@/components/Orb";

export default function SectionSelector() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="flex flex-col md:flex-row items-center justify-center gap-20 w-full max-w-md"
    >
      {/* 👨‍💻 Developer Card */}
      <TiltedCard
        backgroundComponent={
          <LetterGlitch
            glitchColors={["#8D53FF", "#7581FF", "#53A1FF"]}
            glitchSpeed={50}
            centerVignette={true}
            outerVignette={false}
            smooth={true}
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789"
          />
        }
        captionText="👨‍💻 Developer"
        containerHeight="300px"
        containerWidth="300px"
        rotateAmplitude={12}
        scaleOnHover={1.1}
        showMobileWarning={false}
        showTooltip={true}
        displayOverlayContent={true}
        overlayContent={
          <p className="tilted-card-demo-text text-white text-xl font-bold">
            Developer
          </p>
        }
        onClick={() => router.push("/developer")}
        className="cursor-pointer"
      />

      {/* 🧠 Non-Tech / HR Card */}
      <TiltedCard
        backgroundComponent={
          <Orb
            hoverIntensity={0}
            rotateOnHover={true}
            hue={0}
            forceHoverState={true}
          />
        }
        captionText="🧠 Non-Tech / HR"
        containerHeight="300px"
        containerWidth="300px"
        rotateAmplitude={12}
        scaleOnHover={1.1}
        showMobileWarning={false}
        showTooltip={true}
        displayOverlayContent={true}
        overlayContent={
          <p className="tilted-card-demo-text text-white text-xl font-bold">
            Non‑Tech / HR
          </p>
        }
        onClick={() => router.push("/non-dev")}
        className="cursor-pointer"
      />
    </motion.div>
  );
}
