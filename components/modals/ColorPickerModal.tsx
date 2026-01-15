import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Palette, X, Check, Droplet } from "lucide-react";

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (color: string) => void;
}

const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#3B82F6"); // Default blue
  const [hexInput, setHexInput] = useState("#3B82F6");
  const colorWheelRef = useRef<HTMLDivElement>(null);

  const presets = [
    "#EF4444",
    "#F97316",
    "#F59E0B",
    "#EAB308",
    "#84CC16",
    "#22C55E",
    "#14B8A6",
    "#06B6D4",
    "#0EA5E9",
    "#3B82F6",
    "#6366F1",
    "#8B5CF6",
    "#A855F7",
    "#D946EF",
    "#EC4899",
    "#F43F5E",
    "#64748B",
    "#10B981",
  ];

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    setHexInput(selectedColor);
  }, [selectedColor]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHexInput(e.target.value);
    if (/^[0-9A-F]{6}$/i.test(e.target.value)) {
      // Check for 6 hex characters
      setSelectedColor("#" + e.target.value.toUpperCase()); // Prepend # and convert to uppercase
    }
  };

  const handleColorPick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!colorWheelRef.current) return;
    const rect = colorWheelRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Simple logic mapping X to Hue (0-360) and Y to Lightness/Saturation sort of
    // This is a basic simulation to make it "runnable" without a heavy library
    const width = rect.width;
    const height = rect.height;

    const hue = (x / width) * 360;
    const saturation = 100; // Keep saturation high for vibrant colors
    // Adjust lightness based on Y position, from 20% to 80%
    const lightness = 20 + ((height - y) / height) * 60;

    // HSL to Hex conversion helper
    const hslToHex = (h: number, s: number, l: number) => {
      s /= 100;
      l /= 100;
      let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0;

      if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
      }
      let rHex = Math.round((r + m) * 255).toString(16);
      let gHex = Math.round((g + m) * 255).toString(16);
      let bHex = Math.round((b + m) * 255).toString(16);

      if (rHex.length === 1) rHex = "0" + rHex;
      if (gHex.length === 1) gHex = "0" + gHex;
      if (bHex.length === 1) bHex = "0" + bHex;

      return "#" + rHex + gHex + bHex;
    };

    const newHex = hslToHex(hue, saturation, lightness).toUpperCase();
    setSelectedColor(newHex);
  };

  if (!shouldRender) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out",
        isAnimating ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative bg-white rounded-3xl w-full max-w-[500px] shadow-2xl transform transition-all duration-300 ease-out max-h-[90vh] overflow-y-auto",
          isAnimating ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        )}
      >
        {/* Header */}
        <div className="bg-[#F8FAFC] p-6 border-b border-stroke sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary italic">
                Custom Color Picker
              </h2>
              <p className="text-body text-sm italic">
                Choose or create your perfect theme color
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Color Wheel & Hex Code section */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label className="text-xs text-placeholder italic mb-2 block">
                Color Wheel
              </label>
              <div
                ref={colorWheelRef}
                className="h-32 w-full rounded-lg shadow-inner cursor-crosshair relative overflow-hidden"
                style={{
                  background: `
                                linear-gradient(to top, rgba(0,0,0,0.8), transparent),
                                linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)
                            `,
                }}
                onClick={handleColorPick}
              >
                {/* Selection indicator simulation */}
                <div className="absolute inset-0 pointer-events-none border-2 border-white/20 rounded-lg"></div>
              </div>
            </div>

            <div className="w-full sm:w-1/3 space-y-6">
              <div>
                <label className="text-xs text-placeholder italic mb-2 block">
                  Hex Code
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-placeholder text-sm">
                    #
                  </span>
                  <input
                    type="text"
                    value={hexInput.replace("#", "")}
                    onChange={handleHexChange}
                    className="w-full border border-stroke rounded-lg pl-7 pr-3 py-2 text-sm text-body italic focus:outline-none focus:border-primary uppercase"
                    maxLength={6}
                  />
                </div>
              </div>

              {/* Color Preview Small */}
              <div>
                <label className="text-xs text-placeholder italic mb-2 block">
                  Preview
                </label>
                <div
                  className="h-10 w-full rounded-lg shadow-sm border border-stroke"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
            </div>
          </div>

          {/* Color Preview Large */}
          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-stroke flex items-center justify-between">
            <div className="text-sm font-bold text-mainText italic">
              Active Color
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium italic text-body">
                {selectedColor}
              </span>
              <div
                className="h-8 w-8 rounded-full shadow-sm ring-2 ring-white"
                style={{ backgroundColor: selectedColor }}
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-xs text-placeholder italic mb-2 block">
              Quick Presets
            </label>
            <div className="grid grid-cols-9 gap-2">
              {presets.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none flex items-center justify-center",
                    selectedColor.toUpperCase() === color.toUpperCase()
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                >
                  {selectedColor.toUpperCase() === color.toUpperCase() && (
                    <Check className="h-4 w-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stroke flex gap-4 bg-white sticky bottom-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-primary text-primary text-sm font-bold italic hover:bg-blue-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (onApply) onApply(selectedColor);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-full bg-primary text-white text-sm font-bold italic hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
          >
            Apply Color
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPickerModal;
