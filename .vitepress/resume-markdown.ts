import type MarkdownIt from "markdown-it";

/**
 * Wraps the resume page's flat markdown into the structure the resume theme styles:
 *
 *   ## Section          -> <section class="sec">…</section>
 *   ### Org - Role (Dates) -> <div class="job"><div class="job-head">…</div> …</div>
 *   #### Group          -> <details class="group"><summary>…</summary><div>…</div></details>
 *
 * Only runs on pages whose frontmatter sets `resume: true`, so blog posts are untouched.
 */
export function resumeLayout(md: MarkdownIt) {
  const esc = md.utils.escapeHtml;

  md.core.ruler.push("resume_layout", (state) => {
    if (!state.env?.frontmatter?.resume) return;

    const src = state.tokens;
    const out: typeof src = [];
    let inSec = false;
    let inJob = false;
    let inGroup = false;
    let groupsInJob = 0;

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
    const closeSec = () => {
      closeJob();
      if (inSec) out.push(html("</section>\n"));
      inSec = false;
    };

    for (let i = 0; i < src.length; i++) {
      const tok = src[i];
      if (tok.type !== "heading_open") {
        out.push(tok);
        continue;
      }

      const inline = src[i + 1];
      if (tok.tag === "h2") {
        closeSec();
        out.push(html('<section class="sec">\n'));
        inSec = true;
        out.push(tok, inline, src[i + 2]);
        i += 2;
        continue;
      }

      if (tok.tag === "h3") {
        closeJob();
        const text = inline.content.trim();
        const m = text.match(/^(.+?)\s+[-—]\s+(.+?)(?:\s+\(([^()]+)\))?$/);
        const [org, role, dates] = m ? [m[1], m[2], m[3] ?? ""] : [text, "", ""];
        out.push(
          html(
            `<div class="job"><div class="job-head"><h3>${esc(org)}</h3>` +
              (role ? `<div class="role">${esc(role)}</div>` : "") +
              (dates ? `<div class="dates">${esc(dates)}</div>` : "") +
              "</div>\n",
          ),
        );
        inJob = true;
        groupsInJob = 0;
        i += 2;
        continue;
      }

      if (tok.tag === "h4") {
        closeGroup();
        groupsInJob += 1;
        const summary = md.renderer
          .renderInline(inline.children ?? [], md.options, state.env)
          .replace(/<\/?strong>/g, "");
        const open = groupsInJob <= 2 ? " open" : "";
        out.push(html(`<details class="group"${open}><summary>${summary}</summary><div class="group-body">\n`));
        inGroup = true;
        i += 2;
        continue;
      }

      out.push(tok);
    }

    closeSec();
    state.tokens = out;
  });
}
