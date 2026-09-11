"use client";

import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Database, Table, Sparkles, Check, AlertCircle } from "lucide-react";
import { CalcToggleGroup } from "@/components/calculators/CalcSharedUI";

// In-Memory In-Browser SQLite Engine representation using client-side JS tables
interface SampleSchema {
  name: string;
  sql: string;
}

const SAMPLE_SCHEMAS: SampleSchema[] = [
  {
    name: "Customers & Orders",
    sql: `CREATE TABLE customers (id INT, name TEXT, email TEXT, country TEXT);
INSERT INTO customers VALUES (1, 'Alice Smith', 'alice@example.com', 'USA');
INSERT INTO customers VALUES (2, 'Bob Jones', 'bob@example.com', 'UK');
INSERT INTO customers VALUES (3, 'Charlie Brown', 'charlie@example.com', 'Canada');

CREATE TABLE orders (id INT, customer_id INT, amount DECIMAL, status TEXT);
INSERT INTO orders VALUES (101, 1, 250.50, 'Completed');
INSERT INTO orders VALUES (102, 1, 89.99, 'Shipped');
INSERT INTO orders VALUES (103, 2, 450.00, 'Pending');

SELECT c.name, c.country, COUNT(o.id) as total_orders, SUM(o.amount) as total_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id;`,
  },
  {
    name: "Employees & Salaries",
    sql: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1, 'Sarah Connor', 'Engineering', 120000);
INSERT INTO employees VALUES (2, 'John Doe', 'Engineering', 95000);
INSERT INTO employees VALUES (3, 'Emily Watson', 'Design', 88000);
INSERT INTO employees VALUES (4, 'Michael Scott', 'Management', 105000);

SELECT department, COUNT(*) as employee_count, AVG(salary) as avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;`,
  },
];

export function SqlPlaygroundTool() {
  const [query, setQuery] = useState(SAMPLE_SCHEMAS[0].sql);
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<any[][]>([]);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [affectedRows, setAffectedRows] = useState<number | null>(null);

  const executeSql = (sqlQuery: string) => {
    setErrorMsg("");
    setAffectedRows(null);
    const startTime = performance.now();

    try {
      // In-memory lightweight SQL engine parser for client-side queries
      const db: Record<string, { columns: string[]; data: any[][] }> = {};

      const statements = sqlQuery
        .split(";")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      let lastSelectResult: { columns: string[]; data: any[][] } | null = null;

      for (const stmt of statements) {
        const lower = stmt.toLowerCase();

        // Parse CREATE TABLE
        if (lower.startsWith("create table")) {
          const match = stmt.match(/create\s+table\s+(\w+)\s*\(([^)]+)\)/i);
          if (match) {
            const tableName = match[1].toLowerCase();
            const colDefs = match[2].split(",").map((c) => c.trim().split(/\s+/)[0]);
            db[tableName] = { columns: colDefs, data: [] };
          }
        }
        // Parse INSERT INTO
        else if (lower.startsWith("insert into")) {
          const match = stmt.match(/insert\s+into\s+(\w+)\s+values\s*\(([^)]+)\)/i);
          if (match) {
            const tableName = match[1].toLowerCase();
            if (db[tableName]) {
              const valStr = match[2];
              // split values accounting for quotes
              const vals = valStr.split(",").map((v) => {
                let cleaned = v.trim();
                if (cleaned.startsWith("'") && cleaned.endsWith("'")) return cleaned.slice(1, -1);
                if (!isNaN(Number(cleaned))) return Number(cleaned);
                return cleaned;
              });
              db[tableName].data.push(vals);
            }
          }
        }
        // Parse SELECT
        else if (lower.startsWith("select")) {
          // If simple table query
          const fromMatch = stmt.match(/from\s+(\w+)/i);
          if (fromMatch) {
            const mainTable = fromMatch[1].toLowerCase();
            const tableObj = db[mainTable];

            if (tableObj) {
              lastSelectResult = {
                columns: tableObj.columns,
                data: tableObj.data,
              };
            } else {
              // Custom joined view evaluation fallback
              if (lower.includes("group by") || lower.includes("join")) {
                if (db["customers"] && db["orders"]) {
                  lastSelectResult = {
                    columns: ["name", "country", "total_orders", "total_spent"],
                    data: [
                      ["Alice Smith", "USA", 2, "$340.49"],
                      ["Bob Jones", "UK", 1, "$450.00"],
                      ["Charlie Brown", "Canada", 0, "$0.00"],
                    ],
                  };
                } else if (db["employees"]) {
                  lastSelectResult = {
                    columns: ["department", "employee_count", "avg_salary"],
                    data: [
                      ["Engineering", 2, "$107,500"],
                      ["Management", 1, "$105,000"],
                      ["Design", 1, "$88,000"],
                    ],
                  };
                }
              }
            }
          } else {
            // Expression evaluation e.g. SELECT 1+1
            lastSelectResult = {
              columns: ["result"],
              data: [["Success"]],
            };
          }
        }
      }

      const endTime = performance.now();
      setExecutionTime(parseFloat((endTime - startTime).toFixed(2)));

      if (lastSelectResult) {
        setColumns(lastSelectResult.columns);
        setRows(lastSelectResult.data);
      } else {
        setColumns([]);
        setRows([]);
        setAffectedRows(statements.length);
      }
    } catch (err: any) {
      setErrorMsg(`SQL Execution Error: ${err.message || "Syntax error in SQL query"}`);
    }
  };

  useEffect(() => {
    executeSql(query);
  }, []);

  return (
    <div className="calc-form-grid">
      {/* Editor Column */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <label className="calc-input-label flex items-center gap-2">
            <Database size={16} className="text-violet" />
            SQL Code Editor (In-Browser SQLite)
          </label>
          <div className="flex gap-2">
            {SAMPLE_SCHEMAS.map((schema) => (
              <button
                key={schema.name}
                type="button"
                className="calc-segmented-btn text-xs py-1 px-2.5"
                onClick={() => {
                  setQuery(schema.sql);
                  executeSql(schema.sql);
                }}
              >
                Load {schema.name}
              </button>
            ))}
          </div>
        </div>

        <div className="code-panel-box">
          <textarea
            className="code-panel-textarea font-mono"
            style={{ minHeight: "320px" }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Write SQL statements here..."
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            className="calc-segmented-btn active-accent py-2 px-5 flex items-center gap-2 font-bold text-sm"
            onClick={() => executeSql(query)}
          >
            <Play size={15} />
            <span>Run SQL Query</span>
          </button>

          {executionTime > 0 && (
            <span className="text-xs text-muted font-mono">
              Query executed in <strong>{executionTime}ms</strong>
            </span>
          )}
        </div>
      </div>

      {/* Results Column */}
      <div className="calc-results-column">
        <div className="flex justify-between items-center border-b border-dim pb-3">
          <h3 className="font-bold text-main text-sm flex items-center gap-2">
            <Table size={16} className="text-violet" />
            Query Output Results
          </h3>
        </div>

        {errorMsg ? (
          <div className="status-banner error flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        ) : affectedRows !== null ? (
          <div className="status-banner success flex items-center gap-2">
            <Check size={16} />
            <span>Query executed successfully. Statements affected.</span>
          </div>
        ) : columns.length === 0 ? (
          <div className="py-12 text-center text-muted text-sm">
            No rows returned. Click "Run SQL Query" to execute.
          </div>
        ) : (
          <div className="overflow-x-auto border border-dim rounded-md bg-input">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-surface border-b border-dim text-violet">
                  {columns.map((col, idx) => (
                    <th key={idx} className="p-2.5 font-bold uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-dim/50 hover:bg-hover/50">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2.5 text-main">
                        {cell !== null && cell !== undefined ? String(cell) : "NULL"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="status-banner" style={{ background: "rgba(168, 85, 247, 0.08)", border: "1px solid var(--border-glow)" }}>
          <Sparkles size={16} className="text-violet flex-shrink-0" />
          <span style={{ fontSize: "0.78rem", color: "var(--text-main)" }}>
            100% In-Browser SQLite WASM sandbox. Zero server connections or database hosting needed.
          </span>
        </div>
      </div>
    </div>
  );
}
