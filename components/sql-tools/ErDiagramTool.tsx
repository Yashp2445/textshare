"use client";

import React, { useState } from "react";
import { Layers, Sparkles, Key, Link as LinkIcon } from "lucide-react";

interface ParsedColumn {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
}

interface ParsedTable {
  name: string;
  columns: ParsedColumn[];
  foreignKeys: { col: string; refTable: string; refCol: string }[];
}

export function ErDiagramTool() {
  const [ddlInput, setDdlInput] = useState<string>(
    `CREATE TABLE users (
  id INT PRIMARY KEY,
  username VARCHAR(50),
  email VARCHAR(100)
);

CREATE TABLE posts (
  id INT PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title VARCHAR(200),
  content TEXT
);

CREATE TABLE comments (
  id INT PRIMARY KEY,
  post_id INT REFERENCES posts(id),
  user_id INT REFERENCES users(id),
  comment_text TEXT
);`
  );

  const parseDdl = (sql: string): ParsedTable[] => {
    const tables: ParsedTable[] = [];
    const tableRegex = /create\s+table\s+(\w+)\s*\(([\s\S]*?)\);/gi;

    let match;
    while ((match = tableRegex.exec(sql)) !== null) {
      const tableName = match[1];
      const body = match[2];

      const columns: ParsedColumn[] = [];
      const foreignKeys: { col: string; refTable: string; refCol: string }[] = [];

      const lines = body.split(",\n").map((l) => l.trim()).filter((l) => l.length > 0);

      for (const line of lines) {
        const lower = line.toLowerCase();
        if (lower.startsWith("foreign key") || lower.startsWith("constraint")) {
          const fkMatch = line.match(/foreign\s+key\s*\((\w+)\)\s*references\s+(\w+)\s*\((\w+)\)/i);
          if (fkMatch) {
            foreignKeys.push({ col: fkMatch[1], refTable: fkMatch[2], refCol: fkMatch[3] });
          }
          continue;
        }

        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          const colName = parts[0];
          const colType = parts[1];
          const isPk = lower.includes("primary key");

          let isFk = false;
          const inlineFk = line.match(/references\s+(\w+)\s*\((\w+)\)/i);
          if (inlineFk) {
            isFk = true;
            foreignKeys.push({ col: colName, refTable: inlineFk[1], refCol: inlineFk[2] });
          }

          columns.push({ name: colName, type: colType, isPk, isFk });
        }
      }

      tables.push({ name: tableName, columns, foreignKeys });
    }

    return tables;
  };

  const parsedTables = parseDdl(ddlInput);

  return (
    <div className="calc-form-grid">
      {/* Input DDL */}
      <div className="flex flex-col gap-4">
        <div className="calc-input-box">
          <label className="calc-input-label flex items-center gap-2">
            <Layers size={16} className="text-violet" />
            CREATE TABLE DDL Statements
          </label>
          <div className="code-panel-box">
            <textarea
              className="code-panel-textarea font-mono text-xs"
              style={{ minHeight: "340px" }}
              value={ddlInput}
              onChange={(e) => setDdlInput(e.target.value)}
              placeholder="Paste CREATE TABLE statements..."
            />
          </div>
        </div>
      </div>

      {/* Visual ER Diagram Canvas */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <Layers size={16} className="text-violet" />
            Entity-Relationship Diagram ({parsedTables.length} Tables)
          </h3>
        </div>

        {parsedTables.length === 0 ? (
          <div className="py-12 text-center text-muted text-sm">
            No valid CREATE TABLE statements detected. Paste DDL statements on the left.
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-h-[460px] overflow-y-auto pr-1">
            {parsedTables.map((tbl) => (
              <div
                key={tbl.name}
                className="bg-surface border border-dim rounded-lg p-3 shadow-md flex flex-col gap-2"
              >
                <div className="flex justify-between items-center border-b border-dim pb-2 font-bold text-violet text-sm">
                  <span className="flex items-center gap-2">
                    <Layers size={15} />
                    {tbl.name}
                  </span>
                  <span className="text-xs text-muted font-normal">
                    {tbl.columns.length} columns
                  </span>
                </div>

                <div className="flex flex-col gap-1 text-xs font-mono">
                  {tbl.columns.map((col) => (
                    <div
                      key={col.name}
                      className="flex justify-between items-center py-1 px-2 rounded bg-input/50"
                    >
                      <span className="flex items-center gap-1.5 text-main font-semibold">
                        {col.isPk && <span title="Primary Key"><Key size={12} className="text-amber-400" /></span>}
                        {col.isFk && <span title="Foreign Key"><LinkIcon size={12} className="text-sky-400" /></span>}
                        {col.name}
                      </span>
                      <span className="text-muted text-[11px]">{col.type}</span>
                    </div>
                  ))}
                </div>

                {tbl.foreignKeys.length > 0 && (
                  <div className="pt-2 border-t border-dim/50 text-[11px] text-sky-400 flex flex-col gap-1">
                    {tbl.foreignKeys.map((fk, idx) => (
                      <div key={idx} className="flex items-center gap-1">
                        <LinkIcon size={11} />
                        <span>
                          {fk.col} → <strong>{fk.refTable}</strong>({fk.refCol})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="status-banner" style={{ background: "rgba(168, 85, 247, 0.08)", border: "1px solid var(--border-glow)" }}>
          <Sparkles size={16} className="text-violet flex-shrink-0" />
          <span style={{ fontSize: "0.78rem", color: "var(--text-main)" }}>
            Automatically extracts table schemas, column data types, primary keys, and foreign key relations.
          </span>
        </div>
      </div>
    </div>
  );
}
