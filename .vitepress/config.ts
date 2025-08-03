import { defineConfig, DefaultTheme } from "vitepress";
import fs from "fs";
import path from "path";

interface SidebarResult {
  sidebar: DefaultTheme.SidebarItem[];
  latestPost: string | null;
}

interface FrontmatterData {
  title?: string;
  [key: string]: any;
}

function parseFrontmatter(content: string): FrontmatterData {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};

  const frontmatter: FrontmatterData = {};
  const lines = frontmatterMatch[1].split("\n");

  lines.forEach((line) => {
    const match = line.match(/^(\w+):\s*["']?(.+?)["']?\s*$/);
    if (match) {
      frontmatter[match[1]] = match[2];
    }
  });

  return frontmatter;
}

function formatDate(filename: string): string {
  const dateMatch = filename.match(/^(\d{2})-(\d{2})\.md$/);
  if (!dateMatch) return "";

  const month = parseInt(dateMatch[1], 10);
  const day = parseInt(dateMatch[2], 10);
  const monthNames: readonly string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ] as const;

  if (month < 1 || month > 12) return "";

  return `${monthNames[month - 1]} ${day} - `;
}

function generateManualSidebar(): SidebarResult {
  const sidebar: DefaultTheme.SidebarItem[] = [];
  let latestPost: string | null = null;

  try {
    // Get all year directories
    const years = fs
      .readdirSync(".")
      .filter((item) => {
        const itemPath = path.join(".", item);
        try {
          return fs.statSync(itemPath).isDirectory() && /^\d{4}$/.test(item);
        } catch {
          return false;
        }
      })
      .sort((a, b) => parseInt(b, 10) - parseInt(a, 10)); // Sort years in descending order

    // Process each year
    years.forEach((year) => {
      const yearPath = path.join(".", year);

      try {
        const files = fs
          .readdirSync(yearPath)
          .filter((file) => file.endsWith(".md"))
          .sort((a, b) => b.localeCompare(a)); // Sort files in descending order

        // Create sidebar items for each file
        const items: DefaultTheme.SidebarItem[] = files.map((file) => {
          const filePath = path.join(yearPath, file);
          let title = file.replace(".md", "");

          try {
            const content = fs.readFileSync(filePath, "utf-8");
            const frontmatter = parseFrontmatter(content);

            if (frontmatter.title) {
              title = frontmatter.title;
            }
          } catch (error) {
            console.warn(`Failed to read file ${filePath}:`, error);
          }

          // Format date nicely
          const datePrefix = formatDate(file);
          const link = `/${year}/${file.replace(".md", "")}`;

          // Store the first post as the latest
          if (!latestPost) {
            latestPost = link;
          }

          return {
            text: datePrefix + title,
            link: link,
          };
        });

        // Add year group to sidebar
        if (items.length > 0) {
          sidebar.push({
            text: year,
            collapsed: false,
            items: items,
          });
        }
      } catch (error) {
        console.warn(`Failed to read directory ${yearPath}:`, error);
      }
    });
  } catch (error) {
    console.error("Failed to generate sidebar:", error);
  }

  return { sidebar, latestPost };
}

// Generate sidebar and get latest post
const { sidebar, latestPost } = generateManualSidebar();

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "kndwin",
  description: "kndwin's blog",
  themeConfig: {
    search: { provider: "local" },
    outline: 2,
    nav: [
      { text: "Blog", link: latestPost || "/2025/08-03" },
      { text: "Resume", link: "/resume.html" },
    ],
    sidebar: sidebar,
  },
});
