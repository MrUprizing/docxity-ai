export interface FileChange {
  file: string;
  content: string;
}

export interface AutomationConfig {
  targetRepo?: string;
  targetBranch?: string;
  targetFolder?: string;
}

export interface PushEventPayload {
  repository?: {
    full_name: string;
  };
  ref?: string;
  installation?: {
    id: number;
  };
  commits?: Array<{
    added?: string[];
    modified?: string[];
    removed?: string[];
  }>;
  head_commit?: {
    url: string;
  };
}

export interface PullRequestEventPayload {
  action: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  pull_request: any; // TODO: Define specific PR type if needed
}
