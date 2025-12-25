export default function ThemeToggle() {
  return (
    <button
      className="p-2 rounded border"
      onClick={() => {
        document.documentElement.classList.toggle("dark");
      }}
    >
      🌙 Toggle Theme
    </button>
  );
}
