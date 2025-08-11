"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { File, Folder } from "lucide-react";

type FileTreeProps = {
  data: FileTreeNode;
  level?: number;
  className?: string;
};

export type FileTreeNode = {
  name: string;
  children?: FileTreeNode[];
  type: "file" | "directory";
  path?: string;
};

export function FileTree({ data, level = 0, className }: FileTreeProps) {
  return (
    <div className={cn("text-sm", className)}>
      <FileTreeNode node={data} level={level} />
    </div>
  );
}

type FileTreeNodeProps = {
  node: FileTreeNode;
  level: number;
};

function FileTreeNode({ node, level }: FileTreeNodeProps) {
  // Default value for first two levels
  const defaultValue = level === 0 ? "expanded" : undefined;

  if (node.type === "directory" && node.children?.length) {
    return (
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultValue}
        className="border-none"
      >
        <AccordionItem value="expanded" className="border-none">
          <div style={{ paddingLeft: `${level * 16}px` }}>
            <AccordionTrigger
              className={cn(
                "py-1 px-2 hover:bg-muted/50 rounded-md",
                "no-underline hover:no-underline",
                level === 0 && "font-medium",
              )}
            >
              <div className="flex items-center gap-1">
                <Folder className="h-4 w-4 shrink-0 text-blue-500" />
                <span className="truncate">{node.name}</span>
              </div>
            </AccordionTrigger>
          </div>
          <AccordionContent>
            <div>
              {node.children.map((child) => (
                <FileTreeNode
                  key={child.path ?? child.name}
                  node={child}
                  level={level + 1}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  // Render file
  return (
    <div
      className="flex items-center gap-1 py-1 px-2 hover:bg-muted/50 rounded-md"
      style={{ paddingLeft: `${level * 16 + 24}px` }}
    >
      <File className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="truncate">{node.name}</span>
    </div>
  );
}
