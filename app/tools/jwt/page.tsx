import { JwtDecoder } from "@/components/tools/JwtDecoder";

export const metadata = {
  title: "JWT Decoder | LiveShare DevTools",
  description: "Decode JSON Web Token headers, payloads, and signatures instantly in your browser.",
};

export default function JwtDecoderPage() {
  return (
    <div className="tool-page-wrapper">
      <JwtDecoder />
    </div>
  );
}
