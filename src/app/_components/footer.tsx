export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-900">
      <div className="container mx-auto flex items-center justify-center p-6">
        <p className="text-sm text-gray-400">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/bit2swaz"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-purple-400 hover:text-purple-300"
          >
            bit2swaz
          </a>
        </p>
      </div>
    </footer>
  );
}
