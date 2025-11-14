"use client";

import { useState } from "react";
import Terminal from "./components/Terminal";
import MainPortfolio from "./components/MainPortfolio";

export default function DeveloperPage() {
  const [showPortfolio, setShowPortfolio] = useState(false);

  return showPortfolio ? (
    <MainPortfolio />
  ) : (
    <Terminal onContinue={() => setShowPortfolio(true)} />
  );
}
