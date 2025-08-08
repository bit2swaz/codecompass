export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Welcome to{" "}
          <span className="text-[hsl(280,100%,70%)]">CodeCompass</span>
        </h1>
        {/* We will add our Sign In button here */}
      </div>
    </main>
  );
}
