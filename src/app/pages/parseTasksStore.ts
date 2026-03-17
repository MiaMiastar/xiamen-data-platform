import type { ElementType } from "react";
import {
  CheckCircle,
  XCircle,
  Loader,
  Clock,
  AlertTriangle,
} from "lucide-react";

export type TaskStatus = "解析成功" | "解析失败" | "解析中" | "上传中" | "上传失败";

export interface ParseTask {
  id: string;
  name: string;
  size: string;
  type: string;
  status: TaskStatus;
  createdAt: string;
  pages?: number;
}

export const STATUS_CONFIG: Record<TaskStatus, { icon: ElementType; color: string; bg: string }> = {
  解析成功: { icon: CheckCircle, color: "#3DB880", bg: "#E8FAF0" },
  解析失败: { icon: XCircle,     color: "#E5484D", bg: "#FDECEA" },
  解析中:   { icon: Loader,      color: "#5E6AD2", bg: "#EEEFFC" },
  上传中:   { icon: Clock,       color: "#F4A942", bg: "#FEF4E4" },
  上传失败: { icon: AlertTriangle, color: "#E5484D", bg: "#FDECEA" },
};

export const TYPE_COLORS: Record<string, string> = {
  PDF:  "#E5484D",
  Word: "#5E6AD2",
  PPT:  "#F4A942",
  图片: "#8B5CF6",
  Excel:"#3DB880",
};

// Shared mutable task list
export const tasksData: ParseTask[] = [
  { id: "t001", name: "采购合同_2024Q4.pdf", size: "2.4 MB", type: "PDF", status: "解析成功", createdAt: "2026-03-04 14:32", pages: 28 },
  { id: "t002", name: "供应商评审报告_20240301.docx", size: "1.1 MB", type: "Word", status: "解析成功", createdAt: "2026-03-04 13:15", pages: 15 },
  { id: "t003", name: "物流运营数据报表Q3.xlsx", size: "800 KB", type: "Excel", status: "解析失败", createdAt: "2026-03-04 12:08" },
  { id: "t004", name: "仓储管理规范2024版.pdf", size: "5.2 MB", type: "PDF", status: "解析中", createdAt: "2026-03-04 11:45" },
  { id: "t005", name: "产品图册_高清版.pptx", size: "18.6 MB", type: "PPT", status: "解析成功", createdAt: "2026-03-04 10:20", pages: 42 },
  { id: "t006", name: "质检报告_扫描件.png", size: "3.8 MB", type: "图片", status: "解析成功", createdAt: "2026-03-03 17:30", pages: 1 },
  { id: "t007", name: "供应链风险评估2024.pdf", size: "1.6 MB", type: "PDF", status: "上传中", createdAt: "2026-03-03 16:00" },
  { id: "t008", name: "error_corrupted_file.pdf", size: "0 KB", type: "PDF", status: "上传失败", createdAt: "2026-03-03 15:45" },
  { id: "t009", name: "物流报告_批次007.docx", size: "2.1 MB", type: "Word", status: "解析成功", createdAt: "2026-03-03 14:10", pages: 22 },
  { id: "t010", name: "年度采购计划2026.pdf", size: "3.3 MB", type: "PDF", status: "解析成功", createdAt: "2026-03-02 09:55", pages: 35 },
];

export function getFileType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "PDF";
  if (["doc", "docx"].includes(ext)) return "Word";
  if (["ppt", "pptx"].includes(ext)) return "PPT";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "图片";
  if (["xls", "xlsx", "csv"].includes(ext)) return "Excel";
  return "文件";
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
