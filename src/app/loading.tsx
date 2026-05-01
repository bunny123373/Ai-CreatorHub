export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse-soft">
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </div>
  );
}
