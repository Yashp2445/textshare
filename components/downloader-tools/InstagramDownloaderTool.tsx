import React, { useState } from "react";
import { Download, Loader2, Link as LinkIcon, User, Image as ImageIcon, AlertCircle } from "lucide-react";

type MediaType = "media" | "profile_pic";

interface MediaResult {
  type: MediaType;
  url?: string;
  results?: string[];
  username?: string;
  error?: string;
  details?: string;
}

export function InstagramDownloaderTool() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MediaResult | null>(null);

  const isUrl = input.includes("instagram.com") || input.startsWith("http");
  const inputType = input ? (isUrl ? "url" : "username") : "empty";

  const handleFetch = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/downloader/instagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ type: "media", error: "An unexpected error occurred while fetching the media." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface border border-dim rounded-xl p-5 shadow-sm">
        <label className="block text-sm font-medium text-foreground mb-2">
          Instagram Link or Username
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
              {inputType === "url" ? <LinkIcon size={18} /> : <User size={18} />}
            </div>
            <input
              type="text"
              className="w-full bg-background border border-dim rounded-lg py-2.5 pl-10 pr-4 text-foreground placeholder:text-muted focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet transition-all"
              placeholder="Paste a Reel/Post URL, or enter a username (e.g., @instagram)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            />
          </div>
          <button
            className="flex items-center justify-center gap-2 bg-violet hover:bg-violet-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleFetch}
            disabled={!input.trim() || loading}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            Fetch
          </button>
        </div>
        <p className="text-xs text-muted mt-3">
          Provide a link for Reels/Posts/Stories, or a username for downloading public profile pictures. Private accounts and stories by username are not supported.
        </p>
      </div>

      {result && (
        <div className="bg-surface border border-dim rounded-xl p-5 shadow-sm">
          {result.error ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <AlertCircle size={40} className="text-red-500 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">Could not fetch content</h3>
              <p className="text-sm text-muted max-w-md">{result.error}</p>
              {result.details && (
                <p className="text-xs text-muted mt-4 bg-background p-3 rounded border border-dim w-full overflow-hidden text-ellipsis whitespace-nowrap">
                  {result.details}
                </p>
              )}
            </div>
          ) : result.type === "profile_pic" && result.url ? (
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-dim mb-4 bg-background flex items-center justify-center">
                <img src={result.url} alt={`${result.username} profile`} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">@{result.username}</h3>
              <p className="text-sm text-muted mb-4">Public Profile Picture</p>
              <a
                href={result.url}
                target="_blank"
                rel="noreferrer"
                download={`instagram_${result.username}_profile.jpg`}
                className="flex items-center gap-2 bg-foreground text-background hover:opacity-90 px-5 py-2.5 rounded-lg font-medium transition-opacity"
              >
                <Download size={18} />
                Download Image
              </a>
            </div>
          ) : result.type === "media" && result.results && result.results.length > 0 ? (
            <div className="flex flex-col gap-4">
              <h3 className="text-md font-medium text-foreground border-b border-dim pb-2">
                Available Downloads ({result.results.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.results.map((mediaUrl, idx) => {
                  const isVideo = mediaUrl.includes(".mp4");
                  return (
                    <div key={idx} className="flex flex-col bg-background border border-dim rounded-lg overflow-hidden">
                      <div className="aspect-square bg-surface flex items-center justify-center border-b border-dim p-4">
                        {isVideo ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-2 bg-background rounded border border-dim">
                             <Download size={32} />
                             <span className="text-xs font-medium">Video File</span>
                          </div>
                        ) : (
                          <img src={mediaUrl} alt={`Media ${idx + 1}`} className="max-w-full max-h-full object-contain" />
                        )}
                      </div>
                      <div className="p-3">
                        <a
                          href={mediaUrl}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="flex items-center justify-center w-full gap-2 bg-surface hover:bg-dim text-foreground border border-dim px-4 py-2 rounded font-medium transition-colors text-sm"
                        >
                          <Download size={16} />
                          Download {isVideo ? "Video" : "Image"}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center text-muted">
              <ImageIcon size={40} className="mb-4 opacity-50" />
              <p>No media found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
