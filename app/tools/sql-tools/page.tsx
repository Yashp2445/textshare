import { SqlToolsHub } from "@/components/SqlToolsHub";

export const metadata = {
  title: "SQL Tools Hub — Free In-Browser SQLite Sandbox & ERD Generator | LiveShare",
  description: "Free in-browser SQLite WASM SQL playground, SQL query formatter, and automatic ER diagram generator running 100% client-side with zero backend cost.",
};

export default function SqlToolsPage() {
  return <SqlToolsHub />;
}
