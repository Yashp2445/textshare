import { ColorPickerTool } from "@/components/tools/ColorPickerTool";

export const metadata = {
  title: "Color Picker & Palette Generator | LiveShare DevTools",
  description: "Visual color picker and converter for HEX, RGB, HSL, CMYK with complementary and monochromatic palettes.",
};

export default function ColorPickerPage() {
  return (
    <div className="tool-page-wrapper">
      <ColorPickerTool />
    </div>
  );
}
