"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Download, Search, Camera } from "lucide-react";

import { InstagramDownloaderTool } from "@/components/downloader-tools/InstagramDownloaderTool";

export interface DownloaderToolItem {
  id: string;
  label: string;
  category: "Social Media" | "Video & Audio";
  icon: React.ElementType;
  desc: string;
  component: React.ComponentType;
}

export const DOWNLOADER_TOOL_ITEMS: DownloaderToolItem[] = [
  {
    id: "instagram",
    label: "Instagram Downloader",
    category: "Social Media",
    icon: Camera,
    desc: "Download public reels, posts, and profile pictures from Instagram",
    component: InstagramDownloaderTool,
  }
];

function DownloaderHubContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const toolParam = searchParams.get("tool") || "instagram";
  const [activeToolId, setActiveToolId] = useState<string>(toolParam);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (toolParam) {
      setActiveToolId(toolParam);
    }
  }, [toolParam]);

  const selectTool = (id: string) => {
    setActiveToolId(id);
    const newUrl = id === "instagram" ? "/tools/downloader-tools" : `/tools/downloader-tools?tool=${id}`;
    window.history.pushState({}, "", newUrl);
  };

  const currentItem =
    DOWNLOADER_TOOL_ITEMS.find((item) => item.id === activeToolId) ||
    DOWNLOADER_TOOL_ITEMS[0];

  const ActiveComponent = currentItem.component;
  const ActiveIcon = currentItem.icon;

  const filteredItems = DOWNLOADER_TOOL_ITEMS.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories: DownloaderToolItem["category"][] = [
    "Social Media",
    "Video & Audio",
  ];

  return (
    <div className="calc-hub-container">
      {/* Top Header Banner */}
      <div className="calc-hub-header">
        <div className="calc-hub-title-box">
          <div className="calc-hub-badge-icon">
            <Download size={22} />
          </div>
          <div className="calc-hub-title-text">
            <h1>
              <span>Downloader Hub</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface border border-dim text-violet font-semibold">
                Server-Assisted
              </span>
            </h1>
            <p>Download media from social platforms and extract public profile pictures.</p>
          </div>
        </div>

        {/* Mobile Dropdown Select */}
        <select
          className="calc-mobile-menu-select"
          value={activeToolId}
          onChange={(e) => selectTool(e.target.value)}
        >
          {DOWNLOADER_TOOL_ITEMS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.category}: {item.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid Layout */}
      <div className="calc-hub-grid">
        {/* Sidebar Navigation */}
        <aside className="calc-sidebar-card">
          <div className="calc-sidebar-search">
            <Search size={14} className="calc-sidebar-search-icon" />
            <input
              type="text"
              placeholder="Search downloaders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {categories.map((cat) => {
              const catItems = filteredItems.filter((item) => item.category === cat);
              if (catItems.length === 0) return null;

              return (
                <div key={cat} className="calc-menu-group">
                  <div className="calc-menu-group-title">
                    <span>{cat}</span>
                    <span className="text-xs text-muted">{catItems.length}</span>
                  </div>

                  {catItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.id === activeToolId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`calc-menu-item ${isActive ? "active" : ""}`}
                        onClick={() => selectTool(item.id)}
                      >
                        <div className="calc-menu-item-left">
                          <div className="calc-menu-item-icon">
                            <Icon size={15} />
                          </div>
                          <span className="calc-menu-item-label">{item.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Active Tool View */}
        <main className="calc-view-card">
          <div className="calc-view-header">
            <div className="calc-view-title">
              <div className="calc-hub-badge-icon">
                <ActiveIcon size={20} />
              </div>
              <div>
                <h2>{currentItem.label}</h2>
                <div className="text-xs text-dim">{currentItem.desc}</div>
              </div>
            </div>
            <span className="calc-category-badge">{currentItem.category}</span>
          </div>

          <div className="w-full">
            <ActiveComponent />
          </div>
        </main>
      </div>
    </div>
  );
}

export function DownloaderHub() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-dim">Loading Downloader Tools...</div>}>
      <DownloaderHubContent />
    </Suspense>
  );
}
