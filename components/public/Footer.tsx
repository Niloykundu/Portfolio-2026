import Link from "next/link";

interface Settings {
  editorName?: string | null;
  footerText?: string | null;
  email?: string | null;
}

interface SocialLink {
  platform: string;
  label: string;
  url: string;
}

interface Props {
  settings: Settings | null;
  socialLinks: SocialLink[];
}

export default function Footer({ settings, socialLinks }: Props) {
  const year = new Date().getFullYear();
  const footerText = settings?.footerText || `© ${year} ${settings?.editorName || "Portfolio"}. All rights reserved.`;

  return (
    <footer className="bg-[#111111] border-t border-white/10 py-10">
      <div className="container-editorial flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="text-xs font-black tracking-tight text-white uppercase">
            {settings?.editorName || "PORTFOLIO"}
          </span>
          <span className="hidden sm:block w-px h-4 bg-white/20" />
          <span className="text-xs text-white/30">{footerText}</span>
        </div>

        <div className="flex items-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
