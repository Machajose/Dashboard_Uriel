const PLACEHOLDER_LOGOS = ["Client A", "Client B", "Client C", "MUTMLSA", "Hakiki"];

export default function FeatureSection() {
  return (
    <section className="max-w-4xl mx-auto px-8 py-20 text-center">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
        Track your work.
        <br />
        Show what you build.
      </h2>
      <p className="text-neutral-500 mt-4 max-w-lg mx-auto">
        One space to keep tasks organized and progress visible — and a
        portfolio to show people what I&apos;ve shipped.
      </p>

      <div className="mt-14 pt-8 border-t border-neutral-200">
        <p className="text-xs uppercase tracking-wide text-neutral-400 mb-6">
          Projects &amp; Work
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-neutral-400 text-sm font-medium">
          {PLACEHOLDER_LOGOS.map((logo) => (
            <span key={logo}>{logo}</span>
          ))}
        </div>
      </div>
    </section>
  );
}