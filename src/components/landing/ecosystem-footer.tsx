const ecosystemProducts = [
    { label: "RepurposeBot", href: "https://repurposebot.eazyweb.nc", desc: "Blog to social" },
    { label: "OGMagic", href: "https://ogmagic.eazyweb.nc", desc: "OG images" },
    { label: "GEOTool", href: "https://geotool.eazyweb.nc", desc: "AI search SEO" },
];

export function EcosystemFooter() {
  return (
    <div className="border-t border-white/5 mt-8 pt-8">
      <p className="text-xs font-medium text-zinc-500 mb-3 text-center">From the EazyWebNC Ecosystem</p>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        {ecosystemProducts.map((p) => (
          <a
            key={p.label}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            {p.label} <span className="text-zinc-700">— {p.desc}</span>
          </a>
        ))}
        <a
          href="https://eazyweb.nc/products"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-500/60 hover:text-indigo-400 transition-colors"
        >
          See all →
        </a>
      </div>
    </div>
  );
}
