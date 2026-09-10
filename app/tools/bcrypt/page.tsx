import { BcryptTool } from "@/components/tools/BcryptTool";

export const metadata = {
  title: "Bcrypt Hasher & Verifier | LiveShare DevTools",
  description: "Generate and verify client-side bcrypt password hashes with configurable salt cost factor.",
};

export default function BcryptPage() {
  return (
    <div className="tool-page-wrapper">
      <BcryptTool />
    </div>
  );
}
