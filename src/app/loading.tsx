export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" 
               style={{ animationDirection: "reverse", animationDelay: "0.2s" }} />
        </div>
        <p className="text-cyan-300 text-sm font-medium animate-pulse">Đang tải...</p>
      </div>
    </div>
  );
}
