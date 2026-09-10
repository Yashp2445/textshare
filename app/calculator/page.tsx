import { ScientificCalculator } from "@/components/ScientificCalculator";

export const metadata = {
  title: "Scientific Calculator — LiveShare",
  description: "Desmos-grade scientific calculator with trigonometric functions, logarithms, exponents, parentheses, and calculation history.",
};

export default function CalculatorPage() {
  return <ScientificCalculator />;
}
