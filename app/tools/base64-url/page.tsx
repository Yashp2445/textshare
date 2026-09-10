import { Base64UrlTool } from "@/components/tools/Base64UrlTool";

export const metadata = {
  title: "Base64 & URL Encoder/Decoder | LiveShare DevTools",
  description: "Encode and decode Base64 and URL-encoded string components instantly client-side.",
};

export default function Base64UrlPage() {
  return (
    <div className="tool-page-wrapper">
      <Base64UrlTool />
    </div>
  );
}
