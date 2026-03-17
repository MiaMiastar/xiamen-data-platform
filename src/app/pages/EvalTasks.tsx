import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Plus,
  Copy,
  Trash2,
  Play,
  Square,
  RefreshCw,
  Database,
  CalendarDays,
  FlaskConical,
  BookOpen,
} from "lucide-react";
import {
  experimentsData,
  addExperiment,
  removeExperiment,
  updateExperiment,
  STATUS_CONFIG,
  type Experiment,
  type ExpStatus,
} from "./experimentsStore";

type TabFilter = "all" | ExpStatus;

const TABS: { key: TabFilter; label: string }[] = [
  { key: "all",     label: "全部" },
  { key: "new",     label: "新建" },
  { key: "running", label: "运行中" },
  { key: "success", label: "已完成" },
  { key: "failed",  label: "失败" },
  { key: "stopped", label: "已停止" },
];

export function EvalTasks() {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState<Experiment[]>(() => experimentsData);
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (!deleteId) return;
    removeExperiment(deleteId);
    setExperiments(experimentsData.slice());
    setDeleteId(null);
    toast.success("任务已删除");
  };

  const displayed = activeTab === "all"
    ? experiments
    : experiments.filter((e) => e.status === activeTab);

  const counts: Record<TabFilter, number> = {
    all:     experiments.length,
    new:     experiments.filter((e) => e.status === "new").length,
    running: experiments.filter((e) => e.status === "running").length,
    success: experiments.filter((e) => e.status === "success").length,
    failed:  experiments.filter((e) => e.status === "failed").length,
    stopped: experiments.filter((e) => e.status === "stopped").length,
  };

  return (
    <div className="min-h-screen" style={{ background: "#F7F8FA" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-7"
        style={{ height: 56, background: "#ffffff", borderBottom: "1px solid #DCDCE5" }}
      >
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111118", letterSpacing: "-0.02em" }}>评估任务</h1>
          <p style={{ fontSize: 13, color: "#6B6B80", marginTop: 1 }}>创建、运行评估任务并查看结果报告</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate("/eval-tasks/metrics-docs")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors hover:bg-gray-50"
            style={{ fontSize: 14, color: "#6B6B80", border: "1px solid #DCDCE5" }}
          >
            <BookOpen className="w-4 h-4" />
            评估指标文档
          </button>
        </div>
      </div>

      <div className="px-7 py-5">
        {/* 内容区域左上角：创建任务（与数据集页「创建数据集」一致） */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/eval-tasks/create")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-white transition-opacity hover:opacity-90 shrink-0"
            style={{ fontSize: 14, background: "#5E6AD2" }}
          >
            <Plus className="w-4 h-4" />
            创建任务
          </button>
        </div>
        {/* Tabs */}
        <div className="flex gap-0 mb-4" style={{ borderBottom: "1px solid #E5E5EB" }}>
          {TABS.map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="px-4 py-2 transition-colors relative"
                style={{
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#5E6AD2" : "#6B6B80",
                  borderBottom: isActive ? "2px solid #5E6AD2" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {label}
                <span className="ml-1.5" style={{ fontSize: 12, opacity: 0.7 }}>{counts[key]}</span>
              </button>
            );
          })}
        </div>

        {/* Experiment list */}
        {displayed.length === 0 ? (
          <div className="bg-white rounded-lg p-16 flex flex-col items-center text-center" style={{ border: "1px solid #E5E5EB" }}>
            <FlaskConical className="w-10 h-10 mb-4" style={{ color: "#D0D0DC" }} />
            <div style={{ fontSize: 13, fontWeight: 500, color: "#111118" }}>暂无评估任务</div>
            <div style={{ fontSize: 13, color: "#6B6B80", marginTop: 4 }}>
              <button
                onClick={() => navigate("/eval-tasks/create")}
                style={{ color: "#5E6AD2" }}
                className="hover:underline"
              >
                创建第一个任务
              </button>
              {" "}以开始评估数据质量
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div style={{ fontSize: 13, color: "#6B6B80", marginBottom: 8 }}>共 {displayed.length} 个任务</div>
            {displayed.map((exp) => {
              const cfg = STATUS_CONFIG[exp.status];
              return (
                <div
                  key={exp.id}
                  className="bg-white rounded-lg px-5 py-4 cursor-pointer transition-all hover:shadow-sm"
                  style={{ border: "1px solid #E5E5EB" }}
                  onClick={() => navigate(`/eval-tasks/${exp.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#111118" }}>{exp.name}</span>
                        <span
                          className="px-2 py-0.5 rounded"
                          style={{ fontSize: 12, fontWeight: 500, background: cfg.bg, color: cfg.color }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      {exp.desc && <div style={{ fontSize: 13, color: "#6B6B80", marginTop: 2 }}>{exp.desc}</div>}
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1" style={{ fontSize: 13, color: "#6B6B80" }}>
                          <Database className="w-3.5 h-3.5" style={{ color: "#9090A8" }} />
                          数据集：<span style={{ color: "#5E6AD2", fontWeight: 500 }}>{exp.dataset}</span>
                        </div>
                        <div className="flex items-center gap-1" style={{ fontSize: 13, color: "#6B6B80" }}>
                          <CalendarDays className="w-3.5 h-3.5" style={{ color: "#9090A8" }} />
                          {exp.createdAt}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* 运行 / 停止 */}
                      {exp.status === "running" ? (
                        <div className="relative group/tip-stop">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateExperiment(exp.id, { status: "stopped" });
                              setExperiments(experimentsData.slice());
                            }}
                            className="flex items-center justify-center w-7 h-7 rounded hover:bg-orange-50 transition-colors"
                          >
                            <Square className="w-4 h-4" style={{ color: "#f97316" }} />
                          </button>
                          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[11px] rounded whitespace-nowrap opacity-0 group-hover/tip-stop:opacity-100 transition-opacity z-[9999]">
                            停止任务
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                          </div>
                        </div>
                      ) : (
                        <div className="relative group/tip-run">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateExperiment(exp.id, { status: "running" });
                              setExperiments(experimentsData.slice());
                            }}
                            className="flex items-center justify-center w-7 h-7 rounded hover:bg-green-50 transition-colors"
                          >
                            <Play className="w-4 h-4" style={{ color: "#22c55e" }} />
                          </button>
                          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[11px] rounded whitespace-nowrap opacity-0 group-hover/tip-run:opacity-100 transition-opacity z-[9999]">
                            运行任务
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                          </div>
                        </div>
                      )}

                      {/* 复制 */}
                      <div className="relative group/tip-copy">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const copy: Experiment = {
                              ...exp,
                              id: `${Date.now()}`,
                              name: exp.name + "_副本",
                              status: "new",
                              createdAt: new Date().toLocaleString("zh-CN"),
                            };
                            addExperiment(copy);
                            setExperiments(experimentsData.slice());
                            navigate(`/eval-tasks/create?editId=${copy.id}`);
                          }}
                          className="flex items-center justify-center w-7 h-7 rounded hover:bg-emerald-50 transition-colors"
                        >
                          <Copy className="w-4 h-4" style={{ color: "#10b981" }} />
                        </button>
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[11px] rounded whitespace-nowrap opacity-0 group-hover/tip-copy:opacity-100 transition-opacity z-[9999]">
                          复制任务
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                        </div>
                      </div>

                      {/* 刷新状态 */}
                      <div className="relative group/tip-refresh">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateExperiment(exp.id, { status: "success" });
                            setExperiments(experimentsData.slice());
                            toast.success("任务已完成", {
                              description: "点击查看评估结果报告",
                              action: {
                                label: "查看报告",
                                onClick: () => navigate(`/eval-tasks/${exp.id}`),
                              },
                              duration: 6000,
                            });
                          }}
                          className="flex items-center justify-center w-7 h-7 rounded hover:bg-indigo-50 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" style={{ color: "#6366f1" }} />
                        </button>
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[11px] rounded whitespace-nowrap opacity-0 group-hover/tip-refresh:opacity-100 transition-opacity z-[9999]">
                          刷新状态
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                        </div>
                      </div>

                      {/* 删除 */}
                      <div className="relative group/tip-del">
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteId(exp.id); }}
                          className="flex items-center justify-center w-7 h-7 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" style={{ color: "#ef4444" }} />
                        </button>
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[11px] rounded whitespace-nowrap opacity-0 group-hover/tip-del:opacity-100 transition-opacity z-[9999]">
                          删除任务
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 删除确认弹窗 */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[360px] shadow-2xl">
            <div className="text-sm text-gray-900 mb-2" style={{ fontWeight: 600, fontSize: 15 }}>确认删除</div>
            <div className="text-sm text-gray-500 mb-5" style={{ fontSize: 14 }}>删除后无法恢复，确认删除该评估任务？</div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg"
                style={{ fontSize: 14 }}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-white rounded-lg"
                style={{ background: "#ef4444", fontSize: 14 }}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}