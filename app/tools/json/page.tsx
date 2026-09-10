import { JsonFormatter } from "@/components/tools/JsonFormatter";

export const metadata = {
  title: "JSON Formatter & Validator | LiveShare DevTools",
  description: "Validate, format, highlight, and inspect nested JSON tree structures instantly online.",
};

export default function JsonFormatterPage() {
  return (
    <div className="tool-page-wrapper">
      <JsonFormatter />
    </div>
  );
}
