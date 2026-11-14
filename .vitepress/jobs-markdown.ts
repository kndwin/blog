import type MarkdownIt from "markdown-it";

/**
 * Turns resume-style markdown into the two-column job layout:
 *
 *   ### Org - Role (Dates)   -> <div class="job"><div class="job-head">…</div> …</div>
 *   > blurb right after it    -> moved into the job head (what the company is, its URL)
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

    for (let i = 0; i < src.length; i++) {
      const tok = src[i];

      if (tok.type === "heading_open" && tok.tag === "h2") {
        closeJob();
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

        out.push(
          html(
            `<div class="job"><div class="job-head"><h3>${esc(org)}</h3>` +
              (role ? `<div class="role">${esc(role)}</div>` : "") +
              (dates ? `<div class="dates">${esc(dates)}</div>` : "") +
              (blurb ? `<div class="blurb">${blurb}</div>` : "") +
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
      if (inJob && tok.type === "html_block" && /<!--\s*#endregion/.test(tok.content)) closeJob();
      out.push(tok);
    }

    closeJob();
    state.tokens = out;
  });
}
