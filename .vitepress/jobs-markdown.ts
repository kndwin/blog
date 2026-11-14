import { existsSync } from "node:fs";
import { join } from "node:path";
import type MarkdownIt from "markdown-it";

const LOGO_DIR = join(__dirname, "..", "public", "logos");

/** A company logo from public/logos/<slug>.png, or a lettered square when there is none. */
export function logoHtml(name: string, esc: (s: string) => string) {
  const slug = name.toLowerCase().split(/\s+/)[0].replace(/[^a-z0-9]/g, "");
  if (existsSync(join(LOGO_DIR, `${slug}.png`))) {
    return `<img class="logo" src="/logos/${slug}.png" alt="" width="40" height="40" />`;
  }
  return `<span class="logo logo-mono" aria-hidden="true">${esc(name.trim()[0] ?? "")}</span>`;
}

/** Tech logos in public/stack/<slug>.svg (Simple Icons, plus Effect's own mark). */
const STACK: Record<string, [title: string, hex: string]> = {
  typescript: ["TypeScript", "3178C6"],
  effect: ["Effect", "000000"],
  react: ["React", "61DAFB"],
  amazonwebservices: ["AWS", "232F3E"],
  postgresql: ["PostgreSQL", "4169E1"],
  python: ["Python", "3776AB"],
  clickhouse: ["ClickHouse", "FFCC01"],
  expo: ["Expo", "1C2024"],
  vite: ["Vite", "646CFF"],
  graphql: ["GraphQL", "E10098"],
  prisma: ["Prisma", "2D3748"],
  mysql: ["MySQL", "4479A1"],
  apachekafka: ["Kafka", "231F20"],
  elasticsearch: ["Elasticsearch", "005571"],
  bun: ["Bun", "000000"],
  mapbox: ["Mapbox", "000000"],
  hono: ["Hono", "E36002"],
  turso: ["Turso", "4FF8D2"],
  nextdotjs: ["Next.js", "000000"],
  nodedotjs: ["Node.js", "5FA04E"],
};

/** `<!-- stack: react typescript -->` -> a row of muted tech glyphs (brand colour on hover). */
function stackHtml(slugs: string[]) {
  const icons = slugs.map((slug) => {
    const entry = STACK[slug];
    if (!entry) throw new Error(`Unknown stack slug "${slug}" (add it to STACK in jobs-markdown.ts)`);
    const [title, hex] = entry;
    const [r, g, b] = [0, 2, 4].map((k) => parseInt(hex.slice(k, k + 2), 16) / 255);
    // Near-black brand marks use the ink colour so they stay visible in dark mode.
    const brand = 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.18 ? "var(--ink)" : `#${hex}`;
    return `<span class="si" style="--si:url(/stack/${slug}.svg);--brand:${brand}" title="${title}" role="img" aria-label="${title}"></span>`;
  });
  return `<div class="stack">${icons.join("")}</div>`;
}

/**
 * Turns resume-style markdown into the two-column job layout:
 *
 *   ### Org - Role (Dates)   -> <div class="job"><div class="job-head">…</div> …</div>
 *   > blurb right after it    -> moved into the job head (what the company is, its URL)
 *   <!-- stack: a b -->      -> a row of tech logos under the head
 *   #### Group               -> <details class="group"><summary>…</summary>…</details>
 *
 * Only runs on pages whose frontmatter sets `jobs: true` (the landing page, which
 * includes the work sections from resume.md).
 */
export function jobsLayout(md: MarkdownIt) {
  const esc = md.utils.escapeHtml;

  md.core.ruler.push("jobs_layout", (state) => {
    if (!state.env?.frontmatter?.jobs) return;

    const src = state.tokens;
    const out: typeof src = [];
    let inJob = false;
    let inGroup = false;
    let inContracts = false;

    const html = (content: string) => {
      const t = new state.Token("html_block", "", 0);
      t.content = content;
      return t;
    };
    const closeGroup = () => {
      if (inGroup) out.push(html("</div></details>\n"));
      inGroup = false;
    };
    const closeJob = () => {
      closeGroup();
      if (inJob) out.push(html("</div>\n"));
      inJob = false;
    };

    const closeContracts = () => {
      if (inContracts) out.push(html("</details>\n"));
      inContracts = false;
    };

    for (let i = 0; i < src.length; i++) {
      const tok = src[i];

      if (tok.type === "heading_open" && tok.tag === "h2") {
        closeJob();
        closeContracts();
        // "## Contract work" becomes one collapsed block wrapping those jobs.
        const title = src[i + 1].content.trim();
        if (/contract/i.test(title)) {
          out.push(html(`<details class="contracts"><summary>${esc(title)}</summary>\n`));
          inContracts = true;
          i += 2;
          continue;
        }
        out.push(tok);
        continue;
      }

      if (tok.type === "heading_open" && tok.tag === "h3") {
        closeJob();
        const text = src[i + 1].content.trim();
        const m = text.match(/^(.+?)\s+[-—]\s+(.+?)(?:\s+\(([^()]+)\))?$/);
        const [org, role, dates] = m ? [m[1], m[2], m[3] ?? ""] : [text, "", ""];
        i += 2;

        // A blockquote straight after the heading is the company blurb.
        let blurb = "";
        if (src[i + 1]?.type === "blockquote_open") {
          let j = i + 1;
          while (j < src.length && src[j].type !== "blockquote_close") j++;
          blurb = md.renderer.render(src.slice(i + 2, j), md.options, state.env);
          i = j;
        }

        // An HTML comment `<!-- stack: a b c -->` next is the tech stack row.
        let stack = "";
        const sm = src[i + 1]?.type === "html_block" && src[i + 1].content.match(/^<!--\s*stack:([^>]*?)-->/);
        if (sm) {
          stack = stackHtml(sm[1].trim().split(/\s+/));
          i += 1;
        }

        out.push(
          html(
            `<div class="job"><div class="job-head">${logoHtml(org, esc)}<h3>${esc(org)}</h3>` +
              (role ? `<div class="role">${esc(role)}</div>` : "") +
              (dates ? `<div class="dates">${esc(dates)}</div>` : "") +
              (blurb ? `<div class="blurb">${blurb}</div>` : "") +
              stack +
              "</div>\n",
          ),
        );
        inJob = true;
        continue;
      }

      if (tok.type === "heading_open" && tok.tag === "h4" && inJob) {
        closeGroup();
        const summary = md.renderer
          .renderInline(src[i + 1].children ?? [], md.options, state.env)
          .replace(/<\/?strong>/g, "");
        out.push(html(`<details class="group"><summary>${summary}</summary><div class="group-body">\n`));
        inGroup = true;
        i += 2;
        continue;
      }

      // Anything outside a job (a new section's prose) ends the current job.
      if (tok.type === "html_block" && /<!--\s*#endregion/.test(tok.content)) {
        closeJob();
        closeContracts();
      }
      out.push(tok);
    }

    closeJob();
    closeContracts();
    state.tokens = out;
  });
}
