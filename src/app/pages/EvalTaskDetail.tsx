import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Database,
  FileText,
  Settings,
  CheckCircle2,
  FlaskConical,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Play,
  Square,
  FolderOpen,
  Pencil,
  BarChart2,
  Download,
  X,
  AlertCircle,
  Check,
} from "lucide-react";
import {
  experimentsData,
  STATUS_CONFIG,
  updateExperiment,
} from "./experimentsStore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// ── Mock evaluation result data ──
const CONTENT_TEXT = `I like blue best. Because blue is the color of the sky. I like blue best. Because blue is the color of the sky. I like blue best. Because blue is the color of the sky.I like blue best. Because blue is the color of the sky.I like blue best. Because blue is the color of the sky. I like blue best. Because blue is the color of the sky.I like blue best. Because blue is the color of the sky.I like blue best. Because blue is the color of the sky. I like blue best. Because blue is the color of the sky.`;
const CONTENT_TEXT_2 = `♦ I am 8 years old. "I love apple because:`;

const MOCK_ROWS = [
  { id: 1, content: CONTENT_TEXT, dingoResult: `{"eval_status":false,"eval_details":{}}` },
  { id: 0, content: CONTENT_TEXT_2, dingoResult: `{"eval_status":false,"eval_details":{}}` },
];

const METRIC_ERRORS = [
  { name: "特殊字符检测", value: 3 },
  { name: "语言一致性", value: 2 },
  { name: "长度合规性", value: 2 },
  { name: "语义完整性", value: 2 },
  { name: "格式规范性", value: 1 },
];
const DONUT_COLORS = ["#4f46e5", "#818cf8", "#f59e0b", "#ef4444", "#10b981"];

type RenderMode = "plainText" | "markdown" | "json";
const PAGE_SIZE = 10;

export function EvalTaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [, forceUpdate] = useState(0);
  const exp = experimentsData.find((e) => e.id === id);
  const hasReport = exp?.status === "success";
  const [activeTab, setActiveTab] = useState<"config" | "report">(hasReport ? "report" : "config");

  // Report state
  const [evalStatusFilter, setEvalStatusFilter] = useState("全部");
  const [page, setPage] = useState(1);
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [renderMode, setRenderMode] = useState<RenderMode>("plainText");

  if (!exp) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F7F8FA" }}>
        <div className="text-center">
          <p style={{ fontSize: 14, color: "#6B6B80" }} className="mb-4">任务不存在或已被删除</p>
          <button
            onClick={() => navigate("/eval-tasks")}
            style={{ color: "#5E6AD2", fontSize: 14 }}
            className="hover:underline"
          >
            返回任务列表
          </button>
        </div>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[exp.status];
  const resultSave = exp.resultSave ?? { merge: true, bad: false, good: false, raw: false, all_labels: false };
  const pipelines = exp.pipelines ?? [];
  const dataFiles = exp.dataFiles ?? [];

  const handleRun = () => {
    updateExperiment(exp.id, { status: "running" });
    forceUpdate((n) => n + 1);
  };

  const handleStop = () => {
    updateExperiment(exp.id, { status: "stopped" });
    forceUpdate((n) => n + 1);
  };

  // Report data
  const score = 100.00;
  const correct = 2;
  const incorrect = 10;
  const total = correct + incorrect;

  const filtered = evalStatusFilter === "全部"
    ? MOCK_ROWS
    : MOCK_ROWS.filter((r) => {
        const parsed = JSON.parse(r.dingoResult);
        if (evalStatusFilter === "true") return parsed.eval_status === true;
        if (evalStatusFilter === "false") return parsed.eval_status === false;
        return true;
      });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F7F8FA" }}>
      {/* Top bar */}
      <div
        className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10"
        style={{ borderColor: "#DCDCE5" }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/eval-tasks")}
            className="flex items-center gap-1.5 transition-colors hover:text-gray-800"
            style={{ fontSize: 14, color: "#6B6B80" }}
          >
            <ArrowLeft className="w-4 h-4" />
            返回任务列表
          </button>
          <span style={{ color: "#DCDCE5" }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111118" }}>{exp.name}</span>
          <span
            className="text-[11px] px-2 py-0.5 rounded"
            style={{ background: cfg.bg, color: cfg.color, fontWeight: 600 }}
          >
            {cfg.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/eval-tasks/create?editId=${exp.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-50"
            style={{ fontSize: 14, color: "#111118", border: "1px solid #DCDCE5" }}
          >
            <Pencil className="w-3.5 h-3.5" />
            编辑配置
          </button>
          {exp.status === "running" ? (
            <button
              onClick={handleStop}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white transition-colors"
              style={{ background: "#f97316", fontSize: 14 }}
            >
              <Square className="w-3.5 h-3.5" />
              停止运行
            </button>
          ) : (
            <button
              onClick={handleRun}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white transition-colors"
              style={{ background: "#22c55e", fontSize: 14 }}
            >
              <Play className="w-3.5 h-3.5" />
              运行任务
            </button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white px-8" style={{ borderBottom: "1px solid #DCDCE5" }}>
        <div className="flex gap-0">
          {(hasReport
            ? [
                { key: "report" as const, label: "评估报告", icon: BarChart2 },
                { key: "config" as const, label: "任务配置", icon: Settings },
              ]
            : [
                { key: "config" as const, label: "任务配置", icon: Settings },
              ]
          ).map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="flex items-center gap-1.5 px-5 py-3 relative"
                style={{
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#5E6AD2" : "#6B6B80",
                  borderBottomWidth: 2,
                  borderBottomStyle: "solid",
                  borderBottomColor: isActive ? "#5E6AD2" : "#ffffff",
                  marginBottom: -1,
                  cursor: "pointer",
                }}
              >
                {label}
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-6">
        {activeTab === "config" && (
          <div className="max-w-3xl mx-auto space-y-5">
            {/* ���本信息 */}
            <SectionCard icon={<FlaskConical className="w-4 h-4" style={{ color: "#5E6AD2" }} />} title="基本信息">
              <div className="space-y-3">
                <InfoRow label="任务名称" value={exp.name} />
                <InfoRow label="描述" value={exp.desc ?? "—"} />
                <InfoRow label="创建时间" value={exp.createdAt} />
                <InfoRow
                  label="当前状态"
                  value={
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ background: cfg.bg, color: cfg.color, fontWeight: 600 }}
                    >
                      {cfg.label}
                    </span>
                  }
                />
                <InfoRow
                  label="数据集"
                  value={
                    <span className="flex items-center gap-1.5">
                      <FolderOpen className="w-3.5 h-3.5" style={{ color: "#5E6AD2" }} />
                      <span style={{ color: "#5E6AD2", fontWeight: 500 }}>{exp.dataset}</span>
                    </span>
                  }
                />
                <InfoRow
                  label="数据文件"
                  value={
                    dataFiles.length === 0
                      ? <span style={{ color: "#9090A8" }}>未指定</span>
                      : <span className="flex flex-wrap gap-1.5">
                          {dataFiles.map((f) => (
                            <span key={f} className="inline-flex items-center gap-1 font-mono px-2 py-0.5 rounded" style={{ fontSize: 13, background: "#F7F8FA", border: "1px solid #E5E5EB", color: "#111118" }}>
                              <FileText className="w-3 h-3 shrink-0" style={{ color: "#5E6AD2" }} />
                              {f}
                            </span>
                          ))}
                        </span>
                  }
                />
              </div>
            </SectionCard>

            {/* 执行器配置 */}
            <SectionCard icon={<Settings className="w-4 h-4" style={{ color: "#5E6AD2" }} />} title="执行器配置">
              <div className="space-y-3">
                <InfoRow label="max_workers（最大并发数）" value={exp.maxWorkers ?? "1"} mono />
                <InfoRow label="batch_size（批量大小）" value={exp.batchSize ?? "1"} mono />
                <div>
                  <div style={{ fontSize: 13, color: "#6B6B80" }} className="mb-2">result_save（结果保存选项）</div>
                  <div className="border rounded-lg overflow-hidden" style={{ borderColor: "#E5E5EB" }}>
                    {(Object.entries(resultSave) as [string, boolean][]).map(([key, val], i) => (
                      <div
                        key={key}
                        className="flex items-center justify-between px-4 py-2.5"
                        style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : undefined }}
                      >
                        <span className="font-mono" style={{ fontSize: 14, color: "#111118" }}>{key}</span>
                        <span
                          className="px-2.5 py-0.5 rounded"
                          style={{
                            fontSize: 12,
                            background: val ? "#dcfce7" : "#f3f4f6",
                            color: val ? "#16a34a" : "#6b7280",
                            fontWeight: 600,
                          }}
                        >
                          {String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* 评估器 */}
            <SectionCard icon={<CheckCircle2 className="w-4 h-4" style={{ color: "#5E6AD2" }} />} title="评估器">
              {pipelines.length === 0 ? (
                <div className="text-center py-8 rounded-lg" style={{ fontSize: 13, color: "#9090A8", background: "#F7F8FA" }}>
                  未配置评估器
                </div>
              ) : (
                <div className="space-y-4">
                  {pipelines.map((pipeline, pi) => (
                    <div key={pipeline.id} className="border rounded-lg overflow-hidden" style={{ borderColor: "#E5E5EB" }}>
                      <div
                        className="flex items-center px-4 py-3"
                        style={{ background: "#F7F8FA", borderBottom: "1px solid #E5E5EB" }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#111118" }}>
                          EvalPipeline #{pi + 1}
                        </span>
                      </div>
                      <div className="p-4 space-y-4">
                        {pipeline.fields.length > 0 && (
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#6B6B80" }} className="mb-2">字段映射</div>
                            <div className="space-y-1.5">
                              {pipeline.fields.map((field, fi) => (
                                <div key={fi} className="flex items-center gap-2" style={{ fontSize: 13 }}>
                                  <span className="px-2.5 py-1.5 rounded font-mono" style={{ background: "#F7F8FA", border: "1px solid #E5E5EB", color: "#111118", minWidth: 80 }}>
                                    {field.key || "—"}
                                  </span>
                                  <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: "#9090A8" }} />
                                  <span className="px-2.5 py-1.5 rounded font-mono" style={{ background: "#F7F8FA", border: "1px solid #E5E5EB", color: "#111118", minWidth: 80 }}>
                                    {field.value || "—"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#6B6B80" }} className="mb-2">评估指标</div>
                          {pipeline.metrics.length === 0 ? (
                            <div className="rounded px-3 py-2 text-center" style={{ fontSize: 13, color: "#9090A8", background: "#F7F8FA" }}>
                              未选择指标
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {pipeline.metrics.map((m) => (
                                <span
                                  key={m}
                                  className="px-2.5 py-1 rounded-full"
                                  style={{ fontSize: 12, background: "#EEEFFC", color: "#5E6AD2" }}
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <div className="h-4" />
          </div>
        )}

        {activeTab === "report" && hasReport && (
          <div className="space-y-5">
            {/* Score + Type ratio */}
            <div className="grid grid-cols-2 gap-5">
              {/* Score panel */}
              <div className="bg-white rounded-lg p-6" style={{ border: "1px solid #E5E5EB" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111118" }} className="mb-4">评分</div>
                <div className="text-center mb-6">
                  <div className="mb-2" style={{ fontSize: 48, fontWeight: 700, color: "#5E6AD2" }}>
                    {score.toFixed(2)}
                  </div>
                  <div style={{ fontSize: 14, color: "#6B6B80" }}>综合分数</div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-lg" style={{ background: "#F7F8FA" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#111118" }} className="mb-0.5">{total}</div>
                    <div style={{ fontSize: 12, color: "#6B6B80" }}>总数</div>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ background: "#f0fdf4" }}>
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                      <span style={{ fontSize: 20, fontWeight: 700, color: "#16a34a" }}>{correct}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6B6B80" }}>正确</div>
                  </div>
                  <div className="text-center p-3 rounded-lg" style={{ background: "#fff5f5" }}>
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <X className="w-4 h-4 text-red-500" />
                      <span style={{ fontSize: 20, fontWeight: 700, color: "#ef4444" }}>{incorrect}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6B6B80" }}>错误</div>
                  </div>
                </div>
              </div>

              {/* Type ratio */}
              <div className="bg-white rounded-lg p-6" style={{ border: "1px solid #E5E5EB" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111118" }} className="mb-4">类型占比</div>
                {incorrect > 0 ? (
                  <div className="flex items-center gap-4 h-40">
                    <div className="flex-1 h-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%" minHeight={160}>
                        <PieChart>
                          <Pie
                            data={METRIC_ERRORS}
                            cx="50%"
                            cy="50%"
                            innerRadius="52%"
                            outerRadius="80%"
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {METRIC_ERRORS.map((_, idx) => (
                              <Cell key={idx} fill={DONUT_COLORS[idx % DONUT_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number, name: string) => {
                              const t = METRIC_ERRORS.reduce((s, d) => s + d.value, 0);
                              return [`${((value / t) * 100).toFixed(1)}%  (${value})`, name];
                            }}
                            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-1.5 min-w-[110px]">
                      {METRIC_ERRORS.map((item, idx) => {
                        const t = METRIC_ERRORS.reduce((s, d) => s + d.value, 0);
                        const pct = ((item.value / t) * 100).toFixed(1);
                        return (
                          <div key={item.name} className="flex items-center gap-1.5">
                            <span
                              className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ background: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                            />
                            <span style={{ fontSize: 12, color: "#6B6B80" }} className="truncate">{item.name}</span>
                            <span style={{ fontSize: 12, color: "#9090A8" }} className="ml-auto">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <AlertCircle className="w-10 h-10 mb-3" style={{ color: "#D0D0DC" }} />
                    <div style={{ fontSize: 14, color: "#9090A8" }}>暂无类型占比数据</div>
                  </div>
                )}
              </div>
            </div>

            {/* Data table */}
            <div className="bg-white rounded-lg overflow-hidden" style={{ border: "1px solid #E5E5EB" }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #E5E5EB" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111118" }}>数据列表</div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 13, color: "#6B6B80" }}>
                    按 <span style={{ color: "#5E6AD2", fontWeight: 500 }}>eval_status</span> 筛选：
                  </span>
                  <div className="relative">
                    <select
                      value={evalStatusFilter}
                      onChange={(e) => { setEvalStatusFilter(e.target.value); setPage(1); }}
                      className="appearance-none pl-2 pr-7 py-1 border rounded outline-none bg-white"
                      style={{ fontSize: 13, borderColor: "#DCDCE5", color: "#111118" }}
                    >
                      <option value="全部">全部</option>
                      <option value="true">true</option>
                      <option value="false">false</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9090A8" }} />
                  </div>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid #E5E5EB" }}>
                    <th className="text-left px-5 py-3 w-16" style={{ fontSize: 13, fontWeight: 500, color: "#6B6B80" }}>id</th>
                    <th className="text-left px-4 py-3" style={{ fontSize: 13, fontWeight: 500, color: "#6B6B80" }}>content</th>
                    <th className="text-left px-4 py-3 w-64" style={{ fontSize: 13, fontWeight: 500, color: "#6B6B80" }}>dingo_result</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/50" style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <td className="px-5 py-3" style={{ fontSize: 13, color: "#6B6B80" }}>{row.id}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="truncate max-w-[400px]" style={{ fontSize: 13, color: "#6B6B80" }}>{row.content}</div>
                          <button
                            onClick={() => setExpandedContent(row.content)}
                            title="展开查看完整内容"
                            className="shrink-0"
                          >
                            <ChevronRight className="w-4 h-4" style={{ color: "#f59e0b" }} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono" style={{ fontSize: 13, color: "#6B6B80" }}>{row.dingoResult}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: "1px solid #E5E5EB" }}>
                <div style={{ fontSize: 13, color: "#6B6B80" }}>
                  显示第 {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} 条，共 {filtered.length} 条
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded disabled:opacity-40 hover:bg-gray-50"
                    style={{ border: "1px solid #DCDCE5" }}
                    title="上一页"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" style={{ color: "#6B6B80" }} />
                  </button>
                  <button
                    className="w-7 h-7 rounded flex items-center justify-center text-white"
                    style={{ background: "#5E6AD2", fontSize: 12, fontWeight: 600 }}
                  >
                    {page}
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded disabled:opacity-40 hover:bg-gray-50"
                    style={{ border: "1px solid #DCDCE5" }}
                    title="下一页"
                  >
                    <ChevronRight className="w-3.5 h-3.5" style={{ color: "#6B6B80" }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content expand modal */}
      {expandedContent !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-[560px] shadow-2xl overflow-hidden">
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid #E5E5EB" }}>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 13, color: "#6B6B80" }} className="mr-1">渲染模式：</span>
                {([["plainText", "纯文本"], ["markdown", "Markdown"], ["json", "JSON"]] as [RenderMode, string][]).map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => setRenderMode(mode)}
                    className="px-3 py-1 rounded"
                    style={{
                      fontSize: 12,
                      background: renderMode === mode ? "#5E6AD2" : "#F3F4F6",
                      color: renderMode === mode ? "#fff" : "#6B6B80",
                      fontWeight: renderMode === mode ? 600 : 400,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button onClick={() => setExpandedContent(null)} title="关闭">
                <X className="w-4 h-4" style={{ color: "#6B6B80" }} />
              </button>
            </div>
            <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
              {renderMode === "plainText" && (
                <p style={{ fontSize: 14, color: "#111118" }} className="leading-relaxed whitespace-pre-wrap">{expandedContent}</p>
              )}
              {renderMode === "markdown" && (
                <p style={{ fontSize: 14, color: "#111118" }} className="leading-relaxed whitespace-pre-wrap">{expandedContent}</p>
              )}
              {renderMode === "json" && (
                <pre className="font-mono whitespace-pre-wrap" style={{ fontSize: 12, color: "#111118" }}>
                  {JSON.stringify({ content: expandedContent }, null, 2)}
                </pre>
              )}
            </div>
            <div className="px-5 py-4 flex justify-end" style={{ borderTop: "1px solid #E5E5EB" }}>
              <button
                onClick={() => setExpandedContent(null)}
                className="px-4 py-2 rounded-lg text-white"
                style={{ background: "#5E6AD2", fontSize: 14 }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper components
function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid #E5E5EB" }}>
      <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
        {icon}
        <span style={{ fontSize: 14, fontWeight: 600, color: "#111118" }}>{title}</span>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="shrink-0 w-44 pt-0.5" style={{ fontSize: 13, color: "#6B6B80" }}>{label}</span>
      <span className={`${mono ? "font-mono" : ""}`} style={{ fontSize: 14, color: "#111118" }}>{value}</span>
    </div>
  );
}