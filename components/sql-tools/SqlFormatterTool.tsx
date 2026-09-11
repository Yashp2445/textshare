"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, Sparkles } from "lucide-react";

export function SqlFormatterTool() {
  const [inputSql, setInputSql] = useState<string>(
    `select c.id, c.name, count(o.id) as total_orders, sum(o.amount) as total_spent from customers c left join orders o on c.id=o.customer_id where c.status='active' group by c.id, c.name having count(o.id)>0 order by total_spent desc limit 10;`
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Client-side SQL Beautifier & Keyword Uppercaser
  const formatSql = (sql: string): string => {
    if (!sql.trim()) return "";

    const keywords = [
      "SELECT",
      "FROM",
      "WHERE",
      "GROUP BY",
      "HAVING",
      "ORDER BY",
      "LIMIT",
      "OFFSET",
      "LEFT JOIN",
      "RIGHT JOIN",
      "INNER JOIN",
      "OUTER JOIN",
      "JOIN",
      "ON",
      "AND",
      "OR",
      "INSERT INTO",
      "VALUES",
      "UPDATE",
      "SET",
      "DELETE FROM",
      "CREATE TABLE",
      "ALTER TABLE",
      "DROP TABLE",
      "PRIMARY KEY",
      "FOREIGN KEY",
      "REFERENCES",
      "UNION ALL",
      "UNION",
      "AS",
    ];

    let result = sql.replace(/\s+/g, " ").trim();

    // Uppercase SQL keywords
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, "gi");
      result = result.replace(regex, kw);
    });

    // Add line breaks before major clause keywords
    const majorClauses = [
      "SELECT",
      "FROM",
      "WHERE",
      "GROUP BY",
      "HAVING",
      "ORDER BY",
      "LIMIT",
      "LEFT JOIN",
      "RIGHT JOIN",
      "INNER JOIN",
      "JOIN",
      "INSERT INTO",
      "VALUES",
      "UPDATE",
      "SET",
      "DELETE FROM",
    ];

    majorClauses.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, "g");
      result = result.replace(regex, `\n${kw}`);
    });

    // Add indentation after select items & clauses
    return result
      .split("\n")
      .map((line) => {
        const l = line.trim();
        if (
          l.startsWith("SELECT") ||
          l.startsWith("FROM") ||
          l.startsWith("WHERE") ||
          l.startsWith("GROUP BY") ||
          l.startsWith("HAVING") ||
          l.startsWith("ORDER BY") ||
          l.startsWith("LIMIT")
        ) {
          return l;
        }
        if (l.length > 0) return `  ${l}`;
        return "";
      })
      .join("\n")
      .trim();
  };

  const formattedSql = formatSql(inputSql);

  const handleCopy = () => {
    if (!formattedSql) return;
    navigator.clipboard.writeText(formattedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="calc-form-grid">
      {/* Input */}
      <div className="flex flex-col gap-4">
        <div className="calc-input-box">
          <label className="calc-input-label flex items-center gap-2">
            <Terminal size={16} className="text-violet" />
            Input SQL (Unformatted)
          </label>
          <div className="code-panel-box">
            <textarea
              className="code-panel-textarea font-mono"
              style={{ minHeight: "320px" }}
              value={inputSql}
              onChange={(e) => setInputSql(e.target.value)}
              placeholder="Paste unformatted SQL query here..."
            />
          </div>
        </div>
      </div>

      {/* Formatted Output */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <Terminal size={16} className="text-violet" />
            Formatted & Indented SQL
          </h3>

          <button
            type="button"
            className="calc-segmented-btn active-accent text-xs py-1 px-3 flex items-center gap-1.5"
            onClick={handleCopy}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            <span>{copied ? "Copied!" : "Copy SQL"}</span>
          </button>
        </div>

        <div className="code-panel-box" style={{ flex: 1, minHeight: "320px" }}>
          <pre className="code-panel-display font-mono text-emerald-300">
            {formattedSql}
          </pre>
        </div>

        <div className="status-banner" style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
          <Sparkles size={16} className="text-violet flex-shrink-0" />
          <span style={{ fontSize: "0.78rem", color: "var(--text-main)" }}>
            Formats keywords, clause line breaks, and indents SELECT fields instantly in browser.
          </span>
        </div>
      </div>
    </div>
  );
}
