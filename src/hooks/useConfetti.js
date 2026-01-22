// hooks/useConfetti.js
import { useCallback } from "react";

export default function useConfetti() {
  const burst = useCallback((x, y) => {
    const count = 10;

    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      const isY2K =
        document.documentElement.getAttribute("data-theme") === "y2k";

      span.textContent = isY2K ? "🫧" : "🐊";
      span.className = "gator-burst";

      span.style.left = `${x}px`;
      span.style.top = `${y}px`;

      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 35;

      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance * -1;
      const rot = `${Math.random() * 90 - 45}deg`;

      span.style.setProperty("--tx", `${tx}px`);
      span.style.setProperty("--ty", `${ty}px`);
      span.style.setProperty("--rot", rot);

      span.style.fontSize = `${16 + Math.floor(Math.random() * 10)}px`;

      document.body.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
    }
  }, []);

  const celebrateFromEvent = useCallback(
    (e) => {
      if (!e?.clientX || !e?.clientY) return;
      burst(e.clientX, e.clientY);
    },
    [burst]
  );

  return { burst, celebrateFromEvent };
}