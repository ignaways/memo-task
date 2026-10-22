import { BRAND } from "../../constants/brand";
import { MailIcon, SOCIAL_ICONS } from "../ui/Icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-primary-800 text-primary-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="text-base font-semibold text-white">{BRAND.name}</p>
          <p className="text-sm text-primary-300">{BRAND.role}</p>
          <p className="mt-3 text-sm leading-relaxed text-primary-200">{BRAND.tagline}</p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <a
            href={`mailto:${BRAND.email}`}
            className="inline-flex items-center gap-2 rounded text-sm text-primary-100 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <MailIcon />
            {BRAND.email}
          </a>

          <ul className="flex gap-2">
            {BRAND.socials.map(({ label, href, icon }) => {
              const Icon = SOCIAL_ICONS[icon];
              return (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary-600 bg-primary-700 text-primary-100 transition hover:bg-primary-600 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  >
                    {Icon && <Icon />}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-700 bg-primary-900">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-primary-300 sm:px-6">
          &copy; {year} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
