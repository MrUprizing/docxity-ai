export interface AutomationPR {
  id: number;
  sourceRepo: string;
  sourceBranch: string;
  targetRepo: string;
  targetBranch: string;
  commitUrl: string | null;
  prUrl: string | null;
  prTitle: string | null;
  prDescription: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  automationId: string;
}

export interface RecentAutomation {
  id: string;
  name: string;
  sourceRepo: string;
  targetRepo: string;
  lastPr: AutomationPR;
}

export interface DashboardData {
  totalDocsGenerated: number;
  activeAutomations: number;
  successRate: string;
  recentAutomations: RecentAutomation[];
  totalAutomations: number;
  error?: string;
}
