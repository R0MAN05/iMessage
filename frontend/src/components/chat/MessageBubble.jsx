import { useRef, useState, useEffect } from "react";
import { withTransform } from "../../lib/imagekit";
import { MessageVideo } from "./MessageVideo";
import { MoreHorizontalIcon, DownloadIcon, Trash2Icon, XIcon } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import toast from "react-hot-toast";

// Compress + size images for the bubble (q-auto works for images; f-auto picks WebP/AVIF).
const IMAGE_TRANSFORM = "q-auto,w-640,f-auto";

export function MessageBubble({ message }) {
  const isOwnMessage = message.role === "me";
  const hasImage = Boolean(message.imageUrl);
  const hasVideo = Boolean(message.videoUrl);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { deleteMessage } = useChatStore();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Handle download
  const handleDownload = async () => {
    try {
      setIsMenuOpen(false);
      const res = await fetch(`/api/messages/download/${message.id}`, {
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to download");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = message.imageUrl ? "image" : "video";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Download started");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download");
    }
  };

  // Handle delete
  const handleDelete = async (forEveryone = false) => {
    if (!window.confirm(forEveryone ? "Delete for everyone?" : "Delete for me only?")) return;

    try {
      setIsMenuOpen(false);
      await deleteMessage(message.id);
      toast.success("Message deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete message");
    }
  };

  const hasMedia = hasImage || hasVideo;

  return (
    <div className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        ref={menuRef}
        className={`relative max-w-[min(90%,28rem)] rounded-2xl px-3 py-2 text-[15px] leading-snug sm:max-w-[min(75%,28rem)] sm:px-3.5 ${
          isOwnMessage
            ? "rounded-br-md bg-accent text-accent-foreground"
            : "rounded-bl-md bg-surface"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        {hasImage ? (
          <img
            src={withTransform(message.imageUrl, IMAGE_TRANSFORM)}
            alt=""
            className="mb-1.5 max-h-40 max-w-full rounded-lg object-cover sm:max-h-52 sm:rounded-xl"
          />
        ) : null}
        {hasVideo ? <MessageVideo src={message.videoUrl} /> : null}
        {message.text ? (
          <p className="whitespace-pre-wrap wrap-break-word">{message.text}</p>
        ) : null}
        <div className="flex items-center justify-between gap-2 mt-1">
          <p
            className={`text-[11px] tabular-nums flex-1 ${
              isOwnMessage ? "text-accent-foreground/75" : "text-muted"
            }`}
          >
            {message.time}
          </p>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1 rounded hover:bg-black/10 transition-colors text-muted-foreground/70"
              aria-label={isMenuOpen ? "Close menu" : "More options"}
            >
              {isMenuOpen ? (
                <XIcon className="size-4" strokeWidth={2.5} />
              ) : (
                <MoreHorizontalIcon className="size-4" strokeWidth={2.5} />
              )}
            </button>
            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 bottom-full mb-1 z-20 min-w-[200px] rounded-lg border border-border bg-popover p-2 shadow-xl animate-in fade-in zoom-in-95">
                  {hasMedia && !isOwnMessage && (
                    <button
                      onClick={handleDownload}
                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <DownloadIcon className="size-4" strokeWidth={2} />
                      Download
                    </button>
                  )}
                  {!isOwnMessage && (
                    <button
                      onClick={() => handleDelete(false)}
                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-destructive hover:bg-accent hover:text-destructive"
                    >
                      <Trash2Icon className="size-4" strokeWidth={2} />
                      Delete for me
                    </button>
                  )}
                  {isOwnMessage && (
                    <>
                      <button
                        onClick={() => handleDelete(false)}
                        className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <Trash2Icon className="size-4" strokeWidth={2} />
                        Delete for me
                      </button>
                      <button
                        onClick={() => handleDelete(true)}
                        className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm text-destructive hover:bg-accent hover:text-destructive"
                      >
                        <Trash2Icon className="size-4" strokeWidth={2} />
                        Delete for everyone
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}