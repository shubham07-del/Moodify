import { useState } from "react";

/**
 * Loader — a small set of loading animation variants in one component.
 * Usage: <Loader variant="spinner" size="md" label="Loading" />
 */
export default function Loader({ variant = "spinner", size = "md", label = "Loading" }) {
  const sizes = {
    sm: { box: "w-4 h-4", dot: "w-1.5 h-1.5", bar: "w-1", text: "text-xs" },
    md: { box: "w-8 h-8", dot: "w-2.5 h-2.5", bar: "w-1.5", text: "text-sm" },
    lg: { box: "w-12 h-12", dot: "w-3.5 h-3.5", bar: "w-2", text: "text-base" },
  }[size];

  return (
    <div role="status" aria-label={label} className="flex flex-col items-center justify-center gap-3">
      {variant === "spinner" && (
        <div
          className={`${sizes.box} rounded-full border-[3px] border-[#2c2822] border-t-[#e8823c] animate-spin`}
        />
      )}

      {variant === "dots" && (
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`${sizes.dot} rounded-full bg-[#e8823c] animate-bounce`}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {variant === "bars" && (
        <div className="flex items-end gap-1 h-8">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`${sizes.bar} bg-[#e8823c] rounded-sm animate-pulse`}
              style={{
                height: `${40 + (i % 2) * 30}%`,
                animationDelay: `${i * 0.12}s`,
                animationDuration: "0.9s",
              }}
            />
          ))}
        </div>
      )}

      {variant === "pulse" && (
        <div className="relative flex items-center justify-center">
          <span className={`${sizes.box} absolute rounded-full bg-[#e8823c]/40 animate-ping`} />
          <span className={`${sizes.box} rounded-full bg-[#e8823c]`} />
        </div>
      )}

      {label && <span className={`${sizes.text} text-[#8a8377] font-medium`}>{label}…</span>}
    </div>
  );
}

/* Demo wrapper showing all variants side by side */
export function LoaderDemo() {
  const [size, setSize] = useState("md");
  const variants = ["spinner", "dots", "bars", "pulse"];

  return (
    <div className="min-h-screen bg-[#141310] flex flex-col items-center justify-center gap-10 p-8">
      <div className="flex gap-2">
        {["sm", "md", "lg"].map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors
              ${size === s
                ? "bg-[#e8823c] text-[#141310] border-[#e8823c]"
                : "border-[#2c2822] text-[#a39c8c] hover:border-[#3d382f]"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-10">
        {variants.map((v) => (
          <div key={v} className="bg-[#1c1a16] border border-[#2c2822] rounded-xl p-8 flex flex-col items-center gap-3">
            <Loader variant={v} size={size} label={v} />
          </div>
        ))}
      </div>
    </div>
  );
}