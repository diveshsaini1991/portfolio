"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const STEP_DELAYS = [400, 600, 400];

async function fetchUserIp() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    if (!res.ok) throw new Error("IP fetch failed");
    const data = await res.json();
    return data.ip || "Unknown IP";
  } catch {
    return "Unknown IP";
  }
}

function getDeviceInfo() {
  const ua = navigator.userAgent;
  let device = "Unknown Device";
  if (/Mac/.test(ua)) device = "Mac";
  else if (/Windows/.test(ua)) device = "Windows";
  else if (/Android/.test(ua)) device = "Android";
  else if (/iPhone|iPad/.test(ua)) device = "iOS";

  const browserMatch = ua.match(/(Chrome|Firefox|Safari|Edge)\/([\d.]+)/);
  const browser = browserMatch ? browserMatch[1] : "Unknown Browser";
  const version = browserMatch ? browserMatch[2] : "Unknown Version";

  return `${device}/${browser}/${version}`;
}

export default function Terminal({ onContinue }: { onContinue: () => void }) {
  const router = useRouter();

  const [terminalText, setTerminalText] = useState("");
  const [inputActive, setInputActive] = useState(false);
  const [userInput, setUserInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const deviceInfo = getDeviceInfo();
  const terminalPrompt = `/${deviceInfo} : `;

  useEffect(() => {
    let cancelled = false; // cleanup flag

    async function runSequence() {
      const lines = [`${terminalPrompt}Requesting access...`];
      setTerminalText(lines.join("\n"));
      await new Promise((r) => setTimeout(r, 600));

      const ip = await fetchUserIp();
      lines.push(`${terminalPrompt}Access granted to IP: ${ip}`);
      setTerminalText(lines.join("\n"));
      await new Promise((r) => setTimeout(r, 600));

      lines.push(`${terminalPrompt}Loading user environment...`);
      setTerminalText(lines.join("\n"));
      await new Promise((r) => setTimeout(r, STEP_DELAYS[0]));

      lines.push(`${terminalPrompt}Done.`);
      setTerminalText(lines.join("\n"));
      await new Promise((r) => setTimeout(r, STEP_DELAYS[1]));

      lines.push(`${terminalPrompt}Do you want to continue? (y/n)`);
      setTerminalText(lines.join("\n"));
      await new Promise((r) => setTimeout(r, STEP_DELAYS[2]));
      if (!cancelled) {
        setInputActive(true);
        setTimeout(() => {
          if (inputRef.current) inputRef.current.focus();
        }, 100);
      }
    }

    runSequence();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const answer = userInput.trim().toLowerCase();
      if (answer === "y") {
        // Add user input and a blank line (like real terminal)
        setTerminalText((prev) => prev + "\n" + terminalPrompt + userInput + "\n");
        setInputActive(false);
        onContinue();
      } else if (answer === "n") {
        setTerminalText(
          (prev) =>
            prev +
            "\n" +
            terminalPrompt +
            userInput +
            "\n" +
            terminalPrompt +
            "Access Denied. Redirecting..."
        );
        setInputActive(false);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setTerminalText(
          (prev) =>
            prev +
            "\n" +
            terminalPrompt +
            userInput +
            "\n" +
            terminalPrompt +
            "Please enter 'y' or 'n'"
        );
        setUserInput("");
      }
    }
  };

  return (
    <textarea
      ref={inputRef}
      value={
        inputActive
          ? terminalText + "\n" + terminalPrompt + userInput
          : terminalText
      }
      onChange={(e) => {
        if (inputActive) {
          const val = e.target.value;
          const lastLine = val.split("\n").pop() || "";
          if (lastLine.startsWith(terminalPrompt)) {
            setUserInput(lastLine.slice(terminalPrompt.length));
            setTerminalText(
              val.substring(0, val.length - (lastLine.length + 1))
            );
          }
        }
      }}
      onKeyDown={handleInputKeyDown}
      spellCheck={false}
      rows={20}
      className="w-full h-screen resize-none bg-black text-green-400 font-mono p-2 sm:p-4 text-xs sm:text-sm md:text-base rounded-none border-0 focus:outline-none focus:ring-0"
    />
  );
}
