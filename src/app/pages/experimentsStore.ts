// 共享实验数据 Store（模块级可变状态，供列表页和创建页共用）

export type ExpStatus = "new" | "running" | "success" | "failed" | "stopped";

export interface EvalPipeline {
  id: string;
  fields: { key: string; value: string }[];
  evalMode: "metric" | "metricGroup";
  metrics: string[];
}

export interface ResultSaveConfig {
  merge: boolean;
  bad: boolean;
  good: boolean;
  raw: boolean;
  all_labels: boolean;
}

export interface Experiment {
  id: string;
  name: string;
  desc?: string;
  dataset: string;
  status: ExpStatus;
  createdAt: string;
  // 配置详情（创建时保存，详情页展示）
  dataFiles?: string[];
  maxWorkers?: string;
  batchSize?: string;
  resultSave?: ResultSaveConfig;
  pipelines?: EvalPipeline[];
}

export const STATUS_CONFIG: Record<ExpStatus, { label: string; color: string; bg: string }> = {
  new:     { label: "新建",   color: "#6b7280", bg: "#f3f4f6" },
  running: { label: "运行中", color: "#2563eb", bg: "#dbeafe" },
  success: { label: "已完成", color: "#16a34a", bg: "#dcfce7" },
  failed:  { label: "失败",   color: "#dc2626", bg: "#fee2e2" },
  stopped: { label: "已停止", color: "#d97706", bg: "#fef3c7" },
};

export const DATASETS = [
  "test_local_jsonl (local - jsonl)",
  "supplier_docs (local - jsonl)",
  "purchase_contracts (local - jsonl)",
  "logistics_report (s3 - parquet)",
];

export const DATASET_FILES: Record<string, string[]> = {
  "test_local_jsonl": ["sample_001.jsonl", "sample_002.jsonl", "test_data.jsonl", "validation_set.jsonl"],
  "supplier_docs": ["suppliers_q1.jsonl", "suppliers_q2.jsonl", "suppliers_master.jsonl", "new_suppliers.jsonl"],
  "purchase_contracts": ["contracts_2024.jsonl", "contracts_2025.jsonl", "draft_contracts.jsonl", "archived_contracts.jsonl"],
  "logistics_report": ["logistics_jan.parquet", "logistics_feb.parquet", "logistics_mar.parquet", "logistics_summary.parquet"],
};

export const METRIC_OPTIONS = [
  "RuleAudioDuration", "RuleAbnormalChar", "RuleAbnormalHtml",
  "RuleCharNumber", "RuleCapitalWords", "RuleAlphaWords",
  "LlmTextQuality", "LlmRelevance",
];

const INITIAL: Experiment[] = [
  {
    id: "da6aefd7-6251-4514-abe6-db1ad2386e2a",
    name: "test1",
    dataset: "test_local_jsonl",
    status: "success",
    createdAt: "2026/03/04, 13:58",
    dataFiles: ["sample_001.jsonl", "sample_002.jsonl"],
    maxWorkers: "4",
    batchSize: "16",
    resultSave: { merge: true, bad: false, good: false, raw: false, all_labels: false },
    pipelines: [
      {
        id: "ep1",
        fields: [{ key: "prompt", value: "content" }, { key: "response", value: "answer" }],
        evalMode: "metric",
        metrics: ["RuleAbnormalChar", "RuleCharNumber", "LlmTextQuality"],
      },
    ],
  },
  {
    id: "fe70095e-26f2-4df1-9975-1e9137777f56",
    name: "test1",
    desc: "这是一个测试",
    dataset: "test_local_jsonl",
    status: "success",
    createdAt: "2026/03/02, 16:00",
    dataFiles: ["test_data.jsonl", "validation_set.jsonl"],
    maxWorkers: "2",
    batchSize: "8",
    resultSave: { merge: true, bad: true, good: false, raw: false, all_labels: false },
    pipelines: [
      {
        id: "ep2",
        fields: [{ key: "input", value: "query" }],
        evalMode: "metric",
        metrics: ["RuleAbnormalChar", "LlmRelevance"],
      },
      {
        id: "ep3",
        fields: [{ key: "output", value: "result" }],
        evalMode: "metric",
        metrics: ["RuleCapitalWords", "RuleAlphaWords"],
      },
    ],
  },
];

// 模块级可变数组，页面间导航时保持
export let experimentsData: Experiment[] = [...INITIAL];

export function addExperiment(exp: Experiment) {
  experimentsData = [exp, ...experimentsData];
}

export function removeExperiment(id: string) {
  experimentsData = experimentsData.filter((e) => e.id !== id);
}

export function updateExperiment(id: string, updates: Partial<Experiment>) {
  experimentsData = experimentsData.map((e) => (e.id === id ? { ...e, ...updates } : e));
}
