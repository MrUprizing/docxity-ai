import { FileTree, type FileTreeNode } from "@/components/file-tree";

// Sample file structure data
const fileStructure: FileTreeNode = {
  name: "project-root",
  type: "directory",
  children: [
    {
      name: "app",
      type: "directory",
      children: [
        {
          name: "api",
          type: "directory",
          children: [
            {
              name: "route.ts",
              type: "file",
            },
          ],
        },
        {
          name: "page.tsx",
          type: "file",
        },
        {
          name: "layout.tsx",
          type: "file",
        },
      ],
    },
    {
      name: "components",
      type: "directory",
      children: [
        {
          name: "ui",
          type: "directory",
          children: [
            {
              name: "button.tsx",
              type: "file",
            },
            {
              name: "card.tsx",
              type: "file",
            },
          ],
        },
        {
          name: "file-tree.tsx",
          type: "file",
        },
      ],
    },
    {
      name: "lib",
      type: "directory",
      children: [
        {
          name: "utils.ts",
          type: "file",
        },
      ],
    },
    {
      name: "public",
      type: "directory",
      children: [
        {
          name: "favicon.ico",
          type: "file",
        },
      ],
    },
    {
      name: "README.md",
      type: "file",
    },
    {
      name: "next.config.js",
      type: "file",
    },
    {
      name: "package.json",
      type: "file",
    },
  ],
};

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">File Tree Visualization</h1>
      <div className="rounded-lg border p-4">
        <FileTree data={fileStructure} />
      </div>
    </main>
  );
}
