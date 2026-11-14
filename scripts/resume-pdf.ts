/**
 * Renders resume.md as a LaTeX PDF at public/kevin-nguyen-resume.pdf.
 *
 * The page is the source of truth: this reads the same markdown VitePress
 * renders (hero lede, talks, toolbox, jobs, groups) and emits a classic
 * one-column LaTeX resume, then compiles it with Tectonic.
 *
 *   bun run resume:pdf      (needs `brew install tectonic`)
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";

const ROOT = join(import.meta.dir, "..");
const OUT_DIR = join(ROOT, "public");
const NAME = "Kevin Nguyen";
const PDF = "kevin-nguyen-resume";

const src = readFileSync(join(ROOT, "resume.md"), "utf8").replace(/^---[\s\S]*?---\n/, "");

// ---------- inline conversion ----------
const SPECIAL: Record<string, string> = {
  "\\": "\\textbackslash{}",
  "&": "\\&",
  "%": "\\%",
  $: "\\$",
  "#": "\\#",
  _: "\\_",
  "{": "\\{",
  "}": "\\}",
  "~": "$\\sim$",
  "^": "\\^{}",
  "<": "$<$",
  ">": "$>$",
  "→": "$\\rightarrow$",
  "×": "$\\times$",
  "≈": "$\\approx$",
};
const esc = (s: string) => s.replace(/[\\&%$#_{}~^<>→×≈]/g, (c) => SPECIAL[c]);

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

/** Markdown inline (bold, code, links) -> LaTeX. */
function inline(md: string): string {
  const out: string[] = [];
  const re = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (const m of md.matchAll(re)) {
    out.push(quotes(esc(md.slice(last, m.index))));
    if (m[1] !== undefined) out.push(`\\textbf{${inline(m[1])}}`);
    else if (m[2] !== undefined) out.push(`\\texttt{${esc(m[2])}}`);
    else out.push(`\\href{${m[4].replace(/[%#]/g, "\\$&")}}{\\underline{${inline(m[3])}}}`);
    last = m.index! + m[0].length;
  }
  out.push(quotes(esc(md.slice(last))));
  return out.join("");
}
const quotes = (s: string) => s.replace(/(^|[\s(])"/g, "$1``").replace(/"/g, "''");

/** Small HTML fragment (from the hero/talk markup) -> markdown-ish text. */
const htmlText = (h: string) =>
  decode(
    h
      .replace(/<a [^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/g, "[$2]($1)")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  );

// ---------- extract the page ----------
const lede = htmlText(src.match(/<p class="lede">([\s\S]*?)<\/p>/)![1]);
const links = [...src.match(/<div class="links">([\s\S]*?)<\/div>/)![1].matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)]
  .filter(([, href]) => !href.startsWith("javascript:") && !href.endsWith(".pdf"))
  .map(([, href, text]) => ({ href, text }));

const talks = [...src.matchAll(/<article class="talk">([\s\S]*?)<\/article>/g)].map(([, a]) => {
  const meta = htmlText(a.match(/<span class="meta">([\s\S]*?)<\/span>\s*<span class="t">/)![1]);
  const title = htmlText(a.match(/<span class="t">([\s\S]*?)<\/span>/)![1]);
  const tl = htmlText(a.match(/<span class="tl">([\s\S]*?)<\/span>\s*<\/div>/)![1].replace(/<\/(a|span)>\s*<(a|span)/g, "</$1> · <$2"));
  return { meta, title, tl };
});
const talkList = [...src.matchAll(/<ul class="talk-list">([\s\S]*?)<\/ul>/g)].flatMap(([, ul]) =>
  [...ul.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, li]) => {
    const [body, date] = [...li.matchAll(/<span[^>]*>([\s\S]*?)<\/span>(?=<span|$)/g)].map((m) => htmlText(m[1]));
    return { body, date };
  }),
);

// Markdown body: everything after the HTML hero, minus raw HTML blocks.
const md = src
  .replace(/<header[\s\S]*?<\/header>/, "")
  .replace(/<div class="talks">[\s\S]*?\n<\/div>/, "")
  .replace(/<ul class="talk-list">[\s\S]*?<\/ul>/, "")
  .replace(/<div[^>]*>[\s\S]*?<\/div>/g, "")
  .replace(/<p class="colophon">[\s\S]*?<\/p>/, "");

// ---------- emit LaTeX ----------
const body: string[] = [];
let inList = false; // inside \resumeItemListStart
let inHeadings = false; // inside \resumeSubHeadingListStart
let section = "";
let hasHeading = false; // a ### seen in this section, so bullets nest under it
const closeItems = () => inList && (body.push("\\resumeItemListEnd"), (inList = false));
const closeHeadings = () => {
  closeItems();
  if (inHeadings) body.push("\\resumeSubHeadingListEnd"), (inHeadings = false);
};
const openHeadings = () => inHeadings || (body.push("\\resumeSubHeadingListStart"), (inHeadings = true));
const openItems = () => inList || (body.push("\\resumeItemListStart"), (inList = true));

body.push("\\section{Profile}", `\\small{${inline(lede)}}`);

for (const line of md.split("\n")) {
  let m: RegExpMatchArray | null;
  if ((m = line.match(/^## (.+)/))) {
    closeHeadings();
    section = m[1].trim();
    hasHeading = false;
    body.push(`\\section{${inline(section)}}`);
    if (/^speaking/i.test(m[1])) {
      openHeadings();
      for (const t of talks)
        body.push(`\\resumeSubItem{\\textbf{${inline(t.title)}} --- ${inline(t.meta.replace(/^Upcoming/, "Upcoming · "))}. ${inline(t.tl)}}`);
      for (const t of talkList) body.push(`\\resumeSubItem{${inline(t.body)} (${inline(t.date)})}`);
    }
  } else if ((m = line.match(/^### (.+)/))) {
    closeItems();
    openHeadings();
    hasHeading = true;
    const h = m[1].trim();
    const job = h.match(/^(.+?) [-—] (.+?)(?: \(([^)]+)\))?$/);
    if (job) {
      const [, org, role, dates = ""] = job;
      body.push(`\\resumeSubheading{${inline(org)}}{${inline(dates.replace(/ - /, " -- "))}}{${inline(role)}}{}`);
    } else body.push(`\\resumeTitle{${inline(h)}}`);
  } else if ((m = line.match(/^#### (.+)/))) {
    closeItems();
    body.push(`\\resumeGroup{${inline(m[1].replace(/\*\*/g, "").trim())}}`);
  } else if ((m = line.match(/^- (.+)/))) {
    const item = m[1].trim();
    const tool = item.match(/^\*\*([^*]+)\*\* (.+)$/);
    if (/^toolbox/i.test(section) && tool) {
      openHeadings();
      body.push(`\\resumeSubItem{\\textbf{${inline(tool[1])}:} ${inline(tool[2])}}`);
    } else if (!hasHeading) {
      openHeadings();
      body.push(`\\resumeSubItem{${inline(item)}}`);
    } else {
      openHeadings();
      openItems();
      body.push(`\\resumeItem{${inline(item)}}`);
    }
  }
}
closeHeadings();

const contact = [
  "Sydney, NSW",
  ...links.map((l) => `\\href{${l.href}}{\\underline{${esc(l.text)}}}`),
  "\\href{https://kndwin.dev}{\\underline{kndwin.dev}}",
].join(" $|$ ");

const tex = String.raw`%-------------------------
% ${NAME} — generated from resume.md by scripts/resume-pdf.ts. Do not edit.
%-------------------------
\documentclass[letterpaper,10.5pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage[usenames,dvipsnames]{color}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot[C]{\small ${NAME}}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-0.6in}
\addtolength{\textheight}{1.1in}

\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

\titleformat{\section}{\vspace{-4pt}\scshape\raggedright\large}{}{0em}{}[\color{black}\titlerule\vspace{-4pt}]

\newcommand{\resumeItem}[1]{\item\small{#1\vspace{-2pt}}}
\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small #3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}
\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-1pt}}
\newcommand{\resumeTitle}[1]{\vspace{2pt}\item\textbf{#1}\vspace{-4pt}}
\newcommand{\resumeGroup}[1]{\vspace{4pt}\item[]\hspace{-0.15in}\small\textit{#1}\vspace{-6pt}}
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}
\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}[leftmargin=0.22in]}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

\begin{document}

\begin{center}
  \textbf{\Huge \scshape ${NAME}} \\ \vspace{2pt}
  ${contact}
\end{center}

${body.join("\n")}

\end{document}
`;

mkdirSync(OUT_DIR, { recursive: true });
const texPath = join(tmpdir(), `${PDF}.tex`); // keep the .tex out of the published site
writeFileSync(texPath, tex);
await $`tectonic --chatter minimal --outdir ${OUT_DIR} ${texPath}`;
console.log(`wrote public/${PDF}.pdf`);
