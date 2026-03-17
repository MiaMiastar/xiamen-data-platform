import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  FileText,
  Download,
  Search,
  CheckCircle,
  Loader,
  XCircle,
  BarChart2,
  Tag,
  CalendarDays,
  Pencil,
  Check,
  X,
  Plus,
  FolderOpen,
  GitCompare,
  CheckSquare,
  Square,
} from "lucide-react";
import { toast } from "sonner";

// ─── 共享 Mock 数据 ───────────────────────────────────────────────────────────

interface DatasetMeta {
  id: string;
  name: string;
  desc: string;
  useScenario: string;
  status: "已上传" | "创建中" | "创建失败";
  fileSize: string;
  fileCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const MOCK_META: Record<string, DatasetMeta> = {
  ds001: { id: "ds001", name: "供应商基础信息", desc: "2024年度供应商档案及评审报告数据集", useScenario: "文本生成", status: "已上传", fileSize: "12.4 MB", fileCount: 38, tags: ["供应商", "档案", "2024"], createdAt: "2026-03-01", updatedAt: "2026-03-04" },
  ds002: { id: "ds002", name: "采购合同库", desc: "2024Q4采购合同解析结构化数据", useScenario: "文本生成", status: "已上传", fileSize: "8.7 MB", fileCount: 22, tags: ["合同", "采购", "Q4"], createdAt: "2026-03-02", updatedAt: "2026-03-04" },
  ds003: { id: "ds003", name: "物流数据集", desc: "物流运营报告、扫描件OCR结果", useScenario: "图片理解", status: "已上传", fileSize: "5.2 MB", fileCount: 15, tags: ["物流", "OCR"], createdAt: "2026-03-02", updatedAt: "2026-03-03" },
  ds004: { id: "ds004", name: "产品图册数据", desc: "产品PPT与高清图册解析输出", useScenario: "图片理解", status: "创建中", fileSize: "45.1 MB", fileCount: 8, tags: ["图册", "PPT"], createdAt: "2026-03-04", updatedAt: "2026-03-04" },
  ds005: { id: "ds005", name: "质检报告库", desc: "质检报告扫描件及结构化提取结果", useScenario: "文本生成", status: "已上传", fileSize: "3.8 MB", fileCount: 31, tags: ["质检"], createdAt: "2026-03-03", updatedAt: "2026-03-04" },
  ds006: { id: "ds006", name: "损坏文件测试集", desc: "测试解析失败场景的数据集", useScenario: "文本生成", status: "创建失败", fileSize: "0 KB", fileCount: 0, tags: ["测试"], createdAt: "2026-03-03", updatedAt: "2026-03-03" },
};

interface DsVersion {
  id: string;
  name: string;
  desc: string;
  dataCount: number;
  createdAt: string;
  updatedAt: string;
}

const MOCK_VERSIONS: DsVersion[] = [
  { id: "v1", name: "V1", desc: "初始版本", dataCount: 12500, createdAt: "2026-03-01", updatedAt: "2026-03-02" },
  { id: "v2", name: "V2", desc: "数据更新", dataCount: 18600, createdAt: "2026-03-03", updatedAt: "2026-03-04" },
];

/** 版本列按版本号从大到小排序 */
const SORTED_VERSIONS = [...MOCK_VERSIONS].sort((a, b) => {
  const numA = parseInt(a.name.replace(/\D/g, ""), 10) || 0;
  const numB = parseInt(b.name.replace(/\D/g, ""), 10) || 0;
  return numB - numA;
});

interface DsFile {
  id: string;
  name: string;
  size: string;
  dataCount: number;
  source: "解析任务" | "评估结果" | "手动上传";
  addedAt: string;
  versionId?: string;
}

const MOCK_FILES_BASE: DsFile[] = Array.from({ length: 12 }, (_, i) => ({
  id: `f${String(i + 1).padStart(3, "0")}`,
  name: ["供应商评审_华联科技.json", "供应商档案_星辰电子.json", "采购合同_HT2024Q4001.json", "物流运营报告_3月.json", "质检报告_批次A022.json"][i % 5],
  size: `${(Math.random() * 2 + 0.1).toFixed(1)} MB`,
  dataCount: Math.floor(Math.random() * 5000) + 100,
  source: (["解析任务", "评估结果", "手动上传"] as const)[i % 3],
  addedAt: `2026-03-0${Math.floor((i % 4) + 1)}`,
}));

/** 根据选中文件构建用于预览展示的 JSON 结构（mock，可后续接入真实文件内容） */
function buildPreviewJson(file: DsFile): object {
  const baseName = file.name.replace(/\.(json|jsonl)$/i, "") || "data";
  return {
    _meta: {
      fileName: file.name,
      size: file.size,
      dataCount: file.dataCount,
      source: file.source,
      addedAt: file.addedAt,
    },
    [baseName]: Array.from({ length: Math.min(3, Math.ceil(file.dataCount / 1000)) }, (_, i) => ({
      id: i + 1,
      text: `${baseName} 样本 ${i + 1}`,
      score: Math.round((Math.random() * 40 + 60) * 100) / 100,
      label: ["正例", "负例", "未标注"][i % 3],
    })),
  };
}

const SOURCE_COLORS: Record<string, { color: string; bg: string }> = {
  解析任务: { color: "#5E6AD2", bg: "#EEEFFC" },
  评估结果: { color: "#3DB880", bg: "#E8FAF0" },
  手动上传: { color: "#8B5CF6", bg: "#F0EEFF" },
};

const STATUS_ICON = {
  已上传: <CheckCircle className="w-3.5 h-3.5" style={{ color: "#3DB880" }} />,
  创建中:  <Loader className="w-3.5 h-3.5 animate-spin" style={{ color: "#5E6AD2" }} />,
  创建失败:<XCircle className="w-3.5 h-3.5" style={{ color: "#E5484D" }} />,
};
const STATUS_COLOR: Record<string, { color: string; bg: string }> = {
  已上传:   { color: "#3DB880", bg: "#E8FAF0" },
  创建中:   { color: "#5E6AD2", bg: "#EEEFFC" },
  创建失败: { color: "#E5484D", bg: "#FDECEA" },
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// ─── 组件 ───────────────────────────────────────────────────────────────────

export function DatasetDetail() {
  const { id = "ds001" } = useParams();
  const baseMeta: DatasetMeta = MOCK_META[id] ?? MOCK_META["ds001"];

  const [meta, setMeta] = useState<DatasetMeta>({ ...baseMeta });
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(meta.name);
  const [editDesc, setEditDesc] = useState(meta.desc);
  const [editTags, setEditTags] = useState<string[]>([...meta.tags]);
  const [tagInput, setTagInput] = useState("");

  const startEdit = () => {
    setEditName(meta.name);
    setEditDesc(meta.desc);
    setEditTags([...meta.tags]);
    setTagInput("");
    setIsEditing(true);
  };
  const cancelEdit = () => setIsEditing(false);
  const saveEdit = () => {
    if (!editName.trim()) return;
    setMeta((prev) => ({
      ...prev,
      name: editName.trim(),
      desc: editDesc.trim(),
      tags: editTags,
    }));
    setIsEditing(false);
    toast.success("基础信息已保存");
  };
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !editTags.includes(t)) setEditTags((prev) => [...prev, t]);
    setTagInput("");
  };
  const removeTag = (t: string) => setEditTags((prev) => prev.filter((x) => x !== t));

  const [files, setFiles] = useState<DsFile[]>(MOCK_FILES_BASE);
  const [search, setSearch]   = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState<string>(MOCK_VERSIONS[0]?.id ?? "v1");
  const [compareSelectedIds, setCompareSelectedIds] = useState<Set<string>>(new Set());
  const [compareOverlayOpen, setCompareOverlayOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<"preview" | "versionDesc">("preview");

  const filtered = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
  const selectedFile = selectedFileId ? files.find((f) => f.id === selectedFileId) : null;

  const handleDownload = (file: DsFile) => {
    toast.success(`下载 ${file.name}`);
    // 可在此接入实际下载逻辑
  };

  const sc = STATUS_COLOR[meta.status];

  return (
    <div className="min-h-screen" style={{ background: "#F7F8FA" }}>
      {/*
        页面布局（数据集详情）：
        ┌─────────────────────────────────────────────────────────────────┐
        │ 头部 (header)                                                    │
        │   [← 返回]  数据集详情                                           │
        ├─────────────────────────────────────────────────────────────────┤
        │ 主内容区 (px-7 py-5, background: #F7F8FA)                        │
        │ ┌─────────────────────────────────────────────────────────────┐ │
        │ │ 基础信息区 (白底卡片)                                         │ │
        │ │  ┌──────┬──────────────────────────────────────┬──────────┐  │ │
        │ │  │ 图标 │ 名称 + 标签(同一行)                    │ 编辑     │  │ │
        │ │  │      │ 描述                                  │ 新增版本 │  │ │
        │ │  │      │ 创建时间: xxx  更新时间: xxx          │          │  │ │
        │ │  └──────┴──────────────────────────────────────┴──────────┘  │ │
        │ └─────────────────────────────────────────────────────────────┘ │
        │ ┌─────────────────────────────────────────────────────────────┐ │
        │ │ 文件列表卡片                                                  │ │
        │ │  工具栏: 文件列表 (n 个)  [搜索] [上传文件]                    │ │
        │ │  ───────────────────────────────────────────────────────────  │ │
        │ │  表头: 文件名 | 来源 | 大小 | 添加时间 | 操作                  │ │
        │ │  表格行: 图标+文件名 | 来源标签 | 大小 | 日期 | 发起评估/下载/删 │ │
        │ │  ───────────────────────────────────────────────────────────  │ │
        │ │  分页: 共 n 个文件  [<] 1 / N [>]                              │ │
        │ └─────────────────────────────────────────────────────────────┘ │
        └─────────────────────────────────────────────────────────────────┘
        弹层：删除文件确认 (fixed 蒙层 + 对话框)
      */}
      <header className="bg-white" style={{ borderBottom: "1px solid #E5E5EB" }}>
        <div className="px-7 py-4 flex items-center gap-3">
          <Link to="/datasets" className="p-1.5 rounded-md hover:bg-[#F0F0F5] transition-colors shrink-0" style={{ color: "#6B6B80" }}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A2E", letterSpacing: "-0.02em" }}>
            数据集详情
          </h1>
        </div>
      </header>

      {/* 主内容：基础信息 + 文件列表 */}
      <div className="px-7 py-5 space-y-5">
        {/* 基础信息区：图标 + 名称与标签同一行 / 描述 / 时间，右侧操作按钮 */}
        <div className="rounded-lg p-5 border border-[#E5E5EB] bg-white">
          <div className="flex items-start justify-between gap-4">
            {/* 左侧：图标 + 内容 */}
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#5E6AD2", color: "#fff" }}>
                <BarChart2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                {/* 第一行：名称 + 标签（同一行） */}
                <div className="flex flex-wrap items-center gap-2">
                  {isEditing ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="rounded-md px-2.5 py-1.5 outline-none border border-[#E5E5EB] bg-[#F7F8FA]"
                      style={{ fontSize: 16, fontWeight: 600, color: "#1A1A2E", minWidth: 120 }}
                    />
                  ) : (
                    <span style={{ fontSize: 16, fontWeight: 600, color: "#1A1A2E" }}>{meta.name}</span>
                  )}
                  {isEditing ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {editTags.map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white" style={{ fontSize: 12, background: "#3DB880" }}>
                          {t}
                          <button onClick={() => removeTag(t)} className="hover:opacity-80"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                        placeholder="添加标签"
                        className="rounded-full px-2 py-0.5 w-20 outline-none border border-[#E5E5EB]"
                        style={{ fontSize: 12 }}
                      />
                      <button onClick={addTag} className="p-0.5 rounded-full border border-[#E5E5EB]" style={{ color: "#3DB880" }}><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                  ) : (
                    meta.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        {meta.tags.map((t) => (
                          <span key={t} className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-white" style={{ fontSize: 12, background: "#3DB880" }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                            {t}
                          </span>
                        ))}
                      </div>
                    )
                  )}
                </div>
                {/* 第二行：描述 */}
                <div>
                  {isEditing ? (
                    <textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      rows={2}
                      className="w-full rounded-md px-2.5 py-1.5 outline-none border border-[#E5E5EB] bg-[#F7F8FA] resize-none mt-1"
                      style={{ fontSize: 13, color: "#6E6E8A" }}
                    />
                  ) : (
                    <p style={{ fontSize: 13, color: "#8A8AA0", lineHeight: 1.5 }}>{meta.desc || "—"}</p>
                  )}
                </div>
                {/* 第三行：使用场景、创建时间、更新时间 */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-0" style={{ fontSize: 12, color: "#8A8AA0" }}>
                  <span>使用场景: {meta.useScenario}</span>
                  <span>创建时间: {meta.createdAt}</span>
                  <span>更新时间: {meta.updatedAt}</span>
                </div>
              </div>
            </div>
            {/* 右侧：操作按钮 */}
            <div className="flex items-center gap-2 shrink-0">
              {isEditing ? (
                <>
                  <button
                    onClick={saveEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white"
                    style={{ fontSize: 13, background: "#3DB880" }}
                  >
                    <Check className="w-3.5 h-3.5" /> 保存
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1.5 rounded-md border border-[#E5E5EB] hover:bg-[#F7F8FA]"
                    style={{ fontSize: 13, color: "#1A1A2E" }}
                  >
                    取消
                  </button>
                </>
              ) : (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#E5E5EB] hover:bg-[#F7F8FA]"
                  style={{ fontSize: 13, color: "#1A1A2E" }}
                >
                  <Pencil className="w-3.5 h-3.5" /> 编辑
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 文件列表：版本 | 文件列表 | 文件预览（表头一行、分割线对齐） */}
        <div className="bg-white rounded-lg overflow-hidden flex flex-col relative" style={{ border: "1px solid #E5E5EB", minHeight: 360 }}>
          {/* 统一表头行：三列同高，一条底部分割线 */}
          <div className="flex shrink-0" style={{ borderBottom: "1px solid #E5E5EB" }}>
            <div className="w-44 shrink-0 flex items-center justify-between gap-1 px-3 py-3" style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E", borderRight: "1px solid #E5E5EB" }}>
              <span>版本</span>
              <div className="flex items-center gap-0.5">
                <Link
                  to={`/datasets/${id}/versions/new`}
                  state={{ nextVersionName: `V${(parseInt(SORTED_VERSIONS[0]?.name.replace(/\D/g, ""), 10) || 0) + 1}` }}
                  className="p-1 rounded-md hover:bg-[#F0F0F5] transition-colors inline-flex"
                  style={{ color: "#5E6AD2" }}
                  title="新增版本"
                >
                  <Plus className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="flex-1 min-w-0 flex items-center justify-between gap-3 px-4 py-3" style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setRightPanelTab("preview")}
                  className="pb-0.5 border-b-2 transition-colors"
                  style={{
                    color: rightPanelTab === "preview" ? "#5E6AD2" : "#8A8AA0",
                    borderColor: rightPanelTab === "preview" ? "#5E6AD2" : "transparent",
                  }}
                >
                  文件预览
                </button>
                <button
                  type="button"
                  onClick={() => setRightPanelTab("versionDesc")}
                  className="pb-0.5 border-b-2 transition-colors"
                  style={{
                    color: rightPanelTab === "versionDesc" ? "#5E6AD2" : "#8A8AA0",
                    borderColor: rightPanelTab === "versionDesc" ? "#5E6AD2" : "transparent",
                  }}
                >
                  新增版本说明
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: "#8A8AA0" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜索..."
                  className="pl-7 pr-2 py-1.5 rounded-md outline-none w-28"
                  style={{ fontSize: 12, border: "1px solid #E5E5EB", background: "#F7F8FA" }}
                />
              </div>
            </div>
          </div>
          {/* 内容区：三列等高，垂直分割线与表头对齐 */}
          <div className="flex flex-1 min-h-0">
            {/* 最左侧：版本列表 */}
            <div className="w-44 shrink-0 flex flex-col overflow-hidden" style={{ borderRight: "1px solid #E5E5EB" }}>
              {compareSelectedIds.size > 0 && (() => {
                const selectedVersions = SORTED_VERSIONS.filter((v) => compareSelectedIds.has(v.id));
                const versionLabel = selectedVersions.map((v) => v.name).join(" vs ");
                return (
                <div
                  className="shrink-0 flex items-center justify-between gap-2 px-2 py-2"
                  style={{ borderBottom: "1px solid #E5E5EB", background: "#F7F8FA" }}
                >
                  <span style={{ fontSize: 12, color: "#5E6AD2" }} className="truncate" title={versionLabel}>{versionLabel}</span>
                  <button
                    type="button"
                    onClick={() => setCompareOverlayOpen(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md transition-colors hover:bg-[#EEEFFC] shrink-0"
                    style={{ fontSize: 12, color: "#5E6AD2" }}
                    title="对比版本"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    对比
                  </button>
                </div>
                );
              })()}
              <div className="flex-1 overflow-y-auto p-2">
                {SORTED_VERSIONS.map((ver) => {
                  const isSelected = selectedVersionId === ver.id;
                  const isCompareChecked = compareSelectedIds.has(ver.id);
                  const toggleCompare = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    setCompareSelectedIds((prev) => {
                      const next = new Set(prev);
                      if (next.has(ver.id)) next.delete(ver.id);
                      else next.add(ver.id);
                      return next;
                    });
                  };
                  return (
                    <button
                      key={ver.id}
                      type="button"
                      onClick={() => setSelectedVersionId(ver.id)}
                      className="group w-full px-3 py-2.5 rounded-lg text-left transition-colors relative"
                      style={{
                        background: isSelected ? "#EEEFFC" : "transparent",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        role="checkbox"
                        aria-checked={isCompareChecked}
                        tabIndex={0}
                        className={`absolute top-1.5 right-1.5 cursor-pointer rounded p-0.5 transition-opacity hover:bg-black/5 ${isCompareChecked ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                        style={{ color: isCompareChecked ? "#5E6AD2" : "#8A8AA0" }}
                        onClick={toggleCompare}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleCompare(e as unknown as React.MouseEvent);
                          }
                        }}
                      >
                        {isCompareChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      </span>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "#5E6AD2" : "#1A1A2E" }}>{ver.name}</div>
                      <div style={{ fontSize: 11, color: "#8A8AA0", marginTop: 2 }} className="line-clamp-2">{ver.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* 中间：文件列表（仅在「文件预览」Tab 时显示） */}
            {rightPanelTab === "preview" && (
              <div
                className="shrink-0 flex flex-col overflow-hidden min-w-[160px] max-w-[260px]"
                style={{ width: "max-content", borderRight: "1px solid #E5E5EB" }}
              >
                <div className="flex-1 overflow-y-auto p-2">
                  {filtered.length === 0 ? (
                    <div className="py-10 text-center" style={{ fontSize: 13, color: "#8A8AA0" }}>暂无文件</div>
                  ) : (
                    filtered.map((file) => (
                      <div
                        key={file.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedFileId(file.id)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedFileId(file.id); } }}
                        className="group w-full px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer"
                        style={{
                          background: selectedFileId === file.id ? "#EEEFFC" : "transparent",
                          marginBottom: 4,
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 shrink-0" style={{ color: "#A0A0B4" }} />
                          <span
                            style={{ fontSize: 13, fontWeight: 600, color: selectedFileId === file.id ? "#5E6AD2" : "#1A1A2E" }}
                            className="truncate flex-1"
                          >
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#F0F0F5] transition-opacity shrink-0"
                            style={{ color: "#6B6B80" }}
                            title="下载"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div style={{ fontSize: 11, color: "#8A8AA0", marginTop: 2 }} className="truncate">{file.size} · 数据量 {file.dataCount.toLocaleString()} · {file.addedAt}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            {/* 右侧：文件预览 / 新增版本说明 Tab 内容 */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {rightPanelTab === "preview" ? (
                <div className="flex-1 flex flex-col min-h-0 p-4">
                  {selectedFile ? (
                    <div
                      className="flex-1 min-h-0 rounded-lg p-4 overflow-auto font-mono text-left whitespace-pre"
                      style={{ background: "#1E1E2E", border: "1px solid #E5E5EB", fontSize: 12, color: "#E4E4E7", lineHeight: 1.5 }}
                    >
                      {JSON.stringify(buildPreviewJson(selectedFile), null, 2)}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-center">
                      <div>
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-3" style={{ background: "#EEEFFC", color: "#5E6AD2" }}>
                          <FolderOpen className="w-7 h-7" />
                        </div>
                        <div style={{ fontSize: 13, color: "#8A8AA0" }}>请选择一个文件预览</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="max-w-2xl">
                    {(() => {
                      const ver = SORTED_VERSIONS.find((v) => v.id === selectedVersionId);
                      if (!ver) {
                        return (
                          <div style={{ fontSize: 13, color: "#8A8AA0" }}>请先在左侧选择版本</div>
                        );
                      }
                      const rows = [
                        { label: "版本号", value: ver.name },
                        { label: "版本说明", value: ver.desc || "—" },
                        { label: "数据量", value: ver.dataCount.toLocaleString() },
                        { label: "创建时间", value: ver.createdAt },
                        { label: "更新时间", value: ver.updatedAt },
                      ];
                      return (
                        <div className="space-y-4">
                          {rows.map(({ label, value }) => (
                            <div key={label}>
                              <div style={{ fontSize: 12, color: "#8A8AA0", marginBottom: 4 }}>{label}</div>
                              <div style={{ fontSize: 14, color: "#1A1A2E" }}>{value}</div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 对比遮罩：覆盖表格区域，显示代码块 vs 代码块 */}
          {compareOverlayOpen && compareSelectedIds.size >= 1 && (() => {
            const selectedVersions = SORTED_VERSIONS.filter((v) => compareSelectedIds.has(v.id));
            const [leftVer, rightVer] = selectedVersions;
            // 左侧版本 JSON（模拟 V1）
            const leftJson = {
              dataset: "供应商评审数据集",
              version: "V1",
              totalCount: 12500,
              status: "已发布",
              updatedAt: "2026-03-02",
              schema: { fields: ["id", "name", "score"], primaryKey: "id" },
              samples: [
                { id: 1, name: "华联科技", score: 0.92 },
                { id: 2, name: "星辰电子", score: 0.88 },
              ],
            };
            // 右侧版本 JSON（模拟 V2，与左侧有差异）
            const rightJson = {
              dataset: "供应商评审数据集",
              version: "V2",
              totalCount: 18600,
              status: "草稿",
              updatedAt: "2026-03-04",
              schema: { fields: ["id", "name", "score", "remark"], primaryKey: "id" },
              samples: [
                { id: 1, name: "华联科技", score: 0.95 },
                { id: 2, name: "星辰电子", score: 0.88 },
                { id: 3, name: "新增企业", score: 0.85 },
              ],
            };
            const leftStr = JSON.stringify(leftJson, null, 2);
            const rightStr = JSON.stringify(rightJson, null, 2);
            const leftLines = leftStr.split("\n");
            const rightLines = rightStr.split("\n");
            const maxLines = Math.max(leftLines.length, rightLines.length);
            const leftDiffSet = new Set<number>();
            const rightDiffSet = new Set<number>();
            for (let i = 0; i < maxLines; i++) {
              const l = leftLines[i];
              const r = rightLines[i];
              if (l !== r) {
                if (i < leftLines.length) leftDiffSet.add(i);
                if (i < rightLines.length) rightDiffSet.add(i);
              }
            }
            const diffLineStyle = { background: "rgba(245, 158, 11, 0.25)" };
            const codeBlockBase = { background: "#1E1E2E", border: "1px solid #E5E5EB", borderRadius: 8, fontSize: 12, color: "#E4E4E7", lineHeight: 1.5, padding: 12, fontFamily: "monospace", overflow: "auto" } as const;
            const renderCodeWithDiff = (lines: string[], diffSet: Set<number>) => (
              <div className="flex-1 min-h-0 rounded-lg overflow-auto" style={codeBlockBase}>
                <pre style={{ margin: 0, whiteSpace: "pre" }}>
                  {lines.map((line, i) => (
                    <div key={i} style={diffSet.has(i) ? { ...diffLineStyle, padding: "0 2px", margin: "0 -2px" } : undefined}>
                      {line || " "}
                    </div>
                  ))}
                </pre>
              </div>
            );
            return (
              <div
                className="absolute inset-0 z-10 flex flex-col rounded-lg bg-white"
                style={{ boxShadow: "0 0 0 1px #E5E5EB" }}
              >
                <div className="shrink-0 flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid #E5E5EB", background: "#F7F8FA" }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      type="button"
                      onClick={() => setCompareOverlayOpen(false)}
                      className="flex items-center gap-1.5 shrink-0 px-2 py-1 rounded-md hover:bg-[#E5E5EB] transition-colors"
                      style={{ fontSize: 13, color: "#5E6AD2" }}
                      title="返回"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      返回
                    </button>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }} className="truncate">
                      {selectedVersions.map((v) => v.name).join(" vs ")} 对比
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCompareOverlayOpen(false)}
                    className="p-1.5 rounded-md hover:bg-[#E5E5EB] transition-colors"
                    style={{ color: "#6B6B80" }}
                    title="关闭"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 min-h-0 flex gap-4 p-4 overflow-hidden">
                  <div className="flex-1 flex flex-col min-w-0 min-h-0">
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#5E6AD2", marginBottom: 8 }}>{leftVer?.name ?? "版本 A"}</div>
                    {renderCodeWithDiff(leftLines, leftDiffSet)}
                  </div>
                  <div className="flex-1 flex flex-col min-w-0 min-h-0">
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#5E6AD2", marginBottom: 8 }}>{rightVer?.name ?? "版本 B"}</div>
                    {renderCodeWithDiff(rightLines, rightDiffSet)}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

    </div>
  );
}