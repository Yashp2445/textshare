"use client";

import React, { useState } from "react";
import { BookOpen, Search, Copy, Check } from "lucide-react";
import { CalcToggleGroup } from "@/components/calculators/CalcSharedUI";

interface CheatItem {
  cmd: string;
  desc: string;
}

interface CheatCategory {
  title: string;
  items: CheatItem[];
}

const CHEAT_DATA: Record<string, CheatCategory[]> = {
  git: [
    {
      title: "Repository Setup & Sync",
      items: [
        { cmd: "git init", desc: "Initialize a new local Git repository" },
        { cmd: "git clone <url>", desc: "Clone a remote repository to local machine" },
        { cmd: "git fetch origin", desc: "Fetch latest branches & commits from remote without merging" },
        { cmd: "git pull origin <branch>", desc: "Fetch and merge remote changes into current branch" },
        { cmd: "git push -u origin <branch>", desc: "Push local commits to remote & set upstream tracking" },
      ],
    },
    {
      title: "Branching & Staging",
      items: [
        { cmd: "git checkout -b <new-branch>", desc: "Create and switch to a new branch" },
        { cmd: "git status", desc: "Show modified, staged, and untracked files" },
        { cmd: "git add .", desc: "Stage all current directory changes for commit" },
        { cmd: "git commit -m 'message'", desc: "Commit staged changes with a descriptive message" },
        { cmd: "git merge <branch>", desc: "Merge specified branch into currently active branch" },
        { cmd: "git stash", desc: "Temporarily stash modified uncommitted changes" },
        { cmd: "git stash pop", desc: "Re-apply most recently stashed changes" },
      ],
    },
  ],
  regex: [
    {
      title: "Character Classes & Anchors",
      items: [
        { cmd: "^", desc: "Start of string / line anchor" },
        { cmd: "$", desc: "End of string / line anchor" },
        { cmd: "\\d", desc: "Any digit character [0-9]" },
        { cmd: "\\w", desc: "Any word character [a-zA-Z0-9_]" },
        { cmd: "\\s", desc: "Any whitespace character (space, tab, newline)" },
        { cmd: "[a-z]", desc: "Character range matching any lowercase letter" },
        { cmd: "[^0-9]", desc: "Negated class matching any non-digit character" },
      ],
    },
    {
      title: "Quantifiers & Groups",
      items: [
        { cmd: "*", desc: "Matches 0 or more occurrences (greedy)" },
        { cmd: "+", desc: "Matches 1 or more occurrences (greedy)" },
        { cmd: "?", desc: "Matches 0 or 1 occurrence (optional)" },
        { cmd: "{n,m}", desc: "Matches between n and m occurrences" },
        { cmd: "(...)", desc: "Capturing group" },
        { cmd: "(?:...)", desc: "Non-capturing group" },
        { cmd: "a|b", desc: "Match either expression 'a' or 'b'" },
      ],
    },
  ],
  sqljoins: [
    {
      title: "Relational SQL Join Types",
      items: [
        { cmd: "INNER JOIN", desc: "Returns rows with matching values in both tables" },
        { cmd: "LEFT JOIN (LEFT OUTER)", desc: "Returns all rows from left table, and matched records from right table" },
        { cmd: "RIGHT JOIN (RIGHT OUTER)", desc: "Returns all rows from right table, and matched records from left table" },
        { cmd: "FULL JOIN (FULL OUTER)", desc: "Returns all rows when there is a match in either left or right table" },
        { cmd: "CROSS JOIN", desc: "Produces Cartesian product of rows from both tables" },
      ],
    },
  ],
  shortcuts: [
    {
      title: "VS Code & General Editor Shortcuts",
      items: [
        { cmd: "Ctrl + Shift + P / Cmd + Shift + P", desc: "Open Command Palette" },
        { cmd: "Ctrl + P / Cmd + P", desc: "Quick Open File by Name" },
        { cmd: "Ctrl + / / Cmd + /", desc: "Toggle line / block comment" },
        { cmd: "Alt + Up / Down", desc: "Move active line up or down" },
        { cmd: "Shift + Alt + F / Option + Shift + F", desc: "Format active document" },
        { cmd: "Ctrl + D / Cmd + D", desc: "Add selection to next matching symbol" },
      ],
    },
  ],
};

export function CheatSheetHubTool() {
  const [topic, setTopic] = useState<"git" | "regex" | "sqljoins" | "shortcuts">("git");
  const [search, setSearch] = useState<string>("");
  const [copiedCmd, setCopiedCmd] = useState<string>("");

  const activeCategories = CHEAT_DATA[topic] || [];

  const handleCopy = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(""), 2000);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top Topic Switcher & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="w-full md:w-auto">
          <CalcToggleGroup
            options={[
              { label: "Git Commands", value: "git" },
              { label: "Regex Syntax", value: "regex" },
              { label: "SQL Joins", value: "sqljoins" },
              { label: "VS Code Shortcuts", value: "shortcuts" },
            ]}
            value={topic}
            onChange={(val) => setTopic(val as any)}
            accent
          />
        </div>

        <div className="calc-sidebar-search w-full md:w-64">
          <Search size={14} className="calc-sidebar-search-icon" />
          <input
            type="text"
            placeholder="Search reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Cheat Sheet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeCategories.map((cat) => {
          const filteredItems = cat.items.filter(
            (item) =>
              item.cmd.toLowerCase().includes(search.toLowerCase()) ||
              item.desc.toLowerCase().includes(search.toLowerCase())
          );
          if (filteredItems.length === 0) return null;

          return (
            <div
              key={cat.title}
              className="bg-surface border border-dim rounded-lg p-4 flex flex-col gap-3 shadow-md"
            >
              <h4 className="font-bold text-main text-sm flex items-center gap-2 border-b border-dim pb-2">
                <BookOpen size={16} className="text-violet" />
                {cat.title}
              </h4>

              <div className="flex flex-col gap-2">
                {filteredItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start gap-3 p-2 rounded bg-input/60 hover:bg-hover transition-colors"
                  >
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <code className="font-mono text-xs text-violet font-semibold break-all">
                        {item.cmd}
                      </code>
                      <span className="text-xs text-dim leading-snug">{item.desc}</span>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded text-muted hover:text-main flex-shrink-0"
                      onClick={() => handleCopy(item.cmd)}
                      title="Copy Command"
                    >
                      {copiedCmd === item.cmd ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
