import { useState, useCallback, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft,
  Copy,
  Download,
  Edit3,
  Save,
  BarChart2,
  Database,
  FileText,
  Columns,
  Code,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  LayoutGrid,
  ChevronDown,
  File,
} from "lucide-react";
import { tasksData, STATUS_CONFIG as TASK_STATUS_CONFIG } from "./parseTasksStore";
import { getContentForTask } from "./parseTaskContent";
import type { MdBlock } from "./parseTaskContent";

const DOWNLOAD_FORMATS = [
  { label: "Markdown", ext: "md" },
  { label: "JSON",     ext: "json" },
  { label: "HTML",     ext: "html" },
  { label: "DOCX",     ext: "docx" },
  { label: "LaTeX",    ext: "tex" },
];

// Floating action popup for each hovered overlay block
function BlockActionPopup({ type, typeColor, typeBg }: { type: string; typeColor: string; typeBg: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        bottom: "calc(100% + 8px)",
        transform: "translateX(-50%)",
        zIndex: 50,
        background: "#1a1a2e",
        borderRadius: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
        padding: "6px 10px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      {/* Type tag */}
      <span
        style={{
          fontSize: 10,
          padding: "2px 7px",
          borderRadius: 4,
          background: typeBg,
          color: typeColor,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {type}
      </span>
      {/* Divider */}
      <div style={{ width: 1, height: 18, background: "#333" }} />
      {/* Copy button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          color: "#fff",
          fontSize: 12,
          fontWeight: 500,
          background: "#2563eb",
          borderRadius: 6,
          padding: "3px 10px",
        }}
      >
        <Copy size={11} />
        复制
      </div>
      {/* Arrow */}
      <div
        style={{
          position: "absolute",
          bottom: -6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 10,
          height: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            background: "#1a1a2e",
            transform: "rotate(45deg)",
            marginTop: -5,
          }}
        />
      </div>
    </div>
  );
}

export function ParseTaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load content dynamically based on the current task ID
  const fileContent = getContentForTask(id);
  const { totalPages: TOTAL_PAGES, markdown: CONTENT_MARKDOWN, json: CONTENT_JSON, outlineItems, docBlocks, mdBlocks } = fileContent;

  const [viewMode, setViewMode] = useState<"markdown" | "json">("markdown");
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(CONTENT_MARKDOWN);
  const [showLayout, setShowLayout] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showDatasetModal, setShowDatasetModal] = useState(false);
  const [showOutline, setShowOutline] = useState(false);
  const [zoom, setZoom] = useState(85);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [hoveredMdBlock, setHoveredMdBlock] = useState<string | null>(null);
  const [mdPopup, setMdPopup] = useState<{ top: number; left: number; block: MdBlock } | null>(null);
  const [showDownload, setShowDownload] = useState(false);

  const docScrollRef = useRef<HTMLDivElement>(null);

  // Scroll to a specific page anchor
  const scrollToPage = (page: number) => {
    const el = document.getElementById(`doc-page-${page}`);
    if (el && docScrollRef.current) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Reset view state when switching files
  const prevIdRef = useRef(id);
  if (prevIdRef.current !== id) {
    prevIdRef.current = id;
    setEditMode(false);
    setEditContent(CONTENT_MARKDOWN);
    setHoveredBlock(null);
    setHoveredMdBlock(null);
    setMdPopup(null);
    setCopied(false);
  }

  // Dataset modal state
  const MODAL_DATASETS = [
    { id: "ds001", name: "供应商基础信息", desc: "2024年度供应商档案及评审报告数据集", fileCount: 38, tags: ["供应商", "档案"] },
    { id: "ds002", name: "采购合同库", desc: "2024Q4采购合同解析结构化数据", fileCount: 22, tags: ["合同", "采购"] },
    { id: "ds003", name: "物流数据集", desc: "物流运营报告、扫描件OCR结果", fileCount: 15, tags: ["物流", "OCR"] },
    { id: "ds004", name: "产品图册数据", desc: "产品PPT与高清图册解析输出", fileCount: 8, tags: ["图册"] },
    { id: "ds005", name: "质检报告库", desc: "质检报告扫描件及结构化提取结果", fileCount: 31, tags: ["质检"] },
    { id: "ds006", name: "损坏文件测试集", desc: "测试解析失败场景的数据集", fileCount: 0, tags: ["测试"] },
    { id: "ds007", name: "年度采购汇总", desc: "2025年全年采购单据结构化数据", fileCount: 54, tags: ["采购", "年度"] },
    { id: "ds008", name: "入库记录集", desc: "仓库入库操作原始数据提取", fileCount: 19, tags: ["仓库"] },
  ];
  const DS_PAGE_SIZE = 10;
  const [dsSelected, setDsSelected] = useState<string[]>([]);
  const [dsPage, setDsPage] = useState(1);
  const [dsSearch, setDsSearch] = useState("");
  const [dsAddSuccess, setDsAddSuccess] = useState(false);

  const filteredDs = MODAL_DATASETS.filter(
    (ds) =>
      ds.name.toLowerCase().includes(dsSearch.toLowerCase()) ||
      ds.tags.some((t) => t.includes(dsSearch))
  );
  const dsTotalPages = Math.ceil(filteredDs.length / DS_PAGE_SIZE);
  const dsPageItems = filteredDs.slice((dsPage - 1) * DS_PAGE_SIZE, dsPage * DS_PAGE_SIZE);

  const toggleDs = (id: string) =>
    setDsSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const closeDatasetModal = () => {
    setShowDatasetModal(false);
    setDsSelected([]);
    setDsPage(1);
    setDsSearch("");
    setDsAddSuccess(false);
  };

  const handleAddToDataset = () => {
    setDsAddSuccess(true);
    setTimeout(() => closeDatasetModal(), 1200);
  };

  const handleCopy = () => {
    const text = viewMode === "markdown" ? CONTENT_MARKDOWN : CONTENT_JSON;
    const doFallback = () => {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        () => { setCopied(true); setTimeout(() => setCopied(false), 2000); },
        () => doFallback()
      );
    } else {
      doFallback();
    }
  };

  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMdBlockEnter = useCallback((blockId: string, e: React.MouseEvent<HTMLDivElement>) => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const block = mdBlocks.find((b) => b.id === blockId)!;
    setHoveredMdBlock(blockId);
    setMdPopup({
      top: rect.top - 44,
      left: rect.left + rect.width / 2,
      block,
    });
  }, [mdBlocks]);

  const handleMdBlockLeave = useCallback(() => {
    hideTimerRef.current = setTimeout(() => {
      setHoveredMdBlock(null);
      setMdPopup(null);
    }, 180);
  }, []);

  const handlePopupEnter = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const handlePopupLeave = useCallback(() => {
    setHoveredMdBlock(null);
    setMdPopup(null);
  }, []);

  const blocksForPage = (page: number) => docBlocks.filter((b) => b.page === page);

  // File navigation: find current task in the shared list
  const currentIndex = tasksData.findIndex((t) => t.id === id);
  const currentTask = currentIndex >= 0 ? tasksData[currentIndex] : null;
  const prevTask = currentIndex > 0 ? tasksData[currentIndex - 1] : null;
  const nextTask = currentIndex >= 0 && currentIndex < tasksData.length - 1 ? tasksData[currentIndex + 1] : null;

  const statusCfg = currentTask ? TASK_STATUS_CONFIG[currentTask.status] : null;
  const displayName = currentTask?.name ?? "采购合同_2024Q4.pdf";
  const displayMeta = currentTask
    ? `${currentTask.pages ?? "—"}页 · ${currentTask.size} · ${currentTask.createdAt}`
    : "28页 · 2.4 MB · 2026-03-04 14:32";

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-1.5 bg-white border-b border-gray-100 flex items-center" style={{ minHeight: 44 }}>
        {/* Left: back */}
        <div className="flex items-center shrink-0">
          <Link to="/parse-tasks" className="text-gray-400 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Center: prev + file info + next */}
        <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
          {/* Prev button */}
          <div className="relative group/prev shrink-0">
            <button
              onClick={() => prevTask && navigate(`/parse-tasks/${prevTask.id}`)}
              disabled={!prevTask}
              className="p-1 rounded-md hover:bg-[#F5F6F8] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              style={{ color: "#6B6B80" }}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {prevTask && (
              <div
                className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-md opacity-0 group-hover/prev:opacity-100 transition-opacity whitespace-nowrap z-50"
                style={{ background: "#111118", color: "#fff", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
              >
                {prevTask.name}
                <div className="absolute top-full left-1/2 -translate-x-1/2" style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "4px solid #111118" }} />
              </div>
            )}
          </div>

          {/* File info center block */}
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: "#9090A8" }} />
            <span className="truncate max-w-[320px]" style={{ fontSize: 13, fontWeight: 600, color: "#111118" }}>{displayName}</span>
            {statusCfg && (
              <span
                className="text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0"
                style={{ background: statusCfg.bg, color: statusCfg.color, fontSize: 11 }}
              >
                {currentTask?.status === "解析成功" ? "✓ " : ""}{currentTask?.status}
              </span>
            )}
            {!statusCfg && (
              <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: "#d1fae5", color: "#10b981", fontSize: 11 }}>
                ✓ 解析成功
              </span>
            )}
            {currentIndex >= 0 && (
              null
            )}
          </div>

          {/* Next button */}
          <div className="relative group/next shrink-0">
            <button
              onClick={() => nextTask && navigate(`/parse-tasks/${nextTask.id}`)}
              disabled={!nextTask}
              className="p-1 rounded-md hover:bg-[#F5F6F8] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              style={{ color: "#6B6B80" }}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            {nextTask && (
              <div
                className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-md opacity-0 group-hover/next:opacity-100 transition-opacity whitespace-nowrap z-50"
                style={{ background: "#111118", color: "#fff", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
              >
                {nextTask.name}
                <div className="absolute top-full left-1/2 -translate-x-1/2" style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "4px solid #111118" }} />
              </div>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate("/eval-tasks/create?file=采购合同_2024Q4.json")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-lg font-medium"
            style={{ background: "#10b981" }}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            发起评估
          </button>
          <button
            onClick={() => setShowDatasetModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-lg font-medium"
            style={{ background: "#1a6de0" }}
          >
            <Database className="w-3.5 h-3.5" />
            添加到数据集
          </button>
        </div>
      </div>

      {/* Main split view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Original document */}
        <div className="w-1/2 border-r border-gray-200 flex flex-col bg-gray-100">

          {/* Document viewer toolbar */}
          <div className="px-3 py-2 bg-white border-b border-gray-100 flex items-center justify-between gap-2" style={{ minHeight: 38 }}>
            {/* Left: outline toggle + label */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setShowOutline(!showOutline)}
                title={showOutline ? "收起大纲" : "展开大纲"}
                className={`p-1 rounded transition-colors ${showOutline ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-gray-500 font-medium">原文件</span>
            </div>

            {/* Center: total pages info */}
            <span className="text-xs text-gray-500 tabular-nums">
              共 {TOTAL_PAGES} 页
            </span>

            {/* Right: zoom + layout toggle */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setZoom((z) => Math.max(40, z - 10))}
                className="p-0.5 rounded hover:bg-gray-100 text-gray-500"
                title="缩小"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs text-gray-600 w-8 text-center tabular-nums">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(200, z + 10))}
                className="p-0.5 rounded hover:bg-gray-100 text-gray-500"
                title="放大"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-gray-200 mx-1" />
              <button
                onClick={() => setShowLayout(!showLayout)}
                title={showLayout ? "隐藏蒙层" : "显示蒙层"}
                className={`p-1 rounded transition-colors ${showLayout ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:bg-gray-100"}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Outline + document area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Outline panel */}
            {showOutline && (
              <div className="w-44 shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-medium">页面大纲</span>
                  <button
                    onClick={() => setShowOutline(false)}
                    title="收起大纲"
                    className="text-gray-300 hover:text-gray-500"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                  {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => {
                    const items = outlineItems.filter((o) => o.page === page);
                    if (items.length === 0) return null;
                    return (
                      <div key={page}>
                        <div className="mx-2 mb-1 mt-2">
                          <div
                            className="bg-gray-50 border rounded overflow-hidden cursor-pointer transition-all border-gray-200 hover:border-gray-300"
                            onClick={() => scrollToPage(page)}
                          >
                            <div className="px-2 pt-2 pb-1 space-y-1">
                              {items.map((item, i) => (
                                <div
                                  key={i}
                                  className="rounded-sm h-2"
                                  style={{ background: item.color + "30", border: `1px solid ${item.color}60` }}
                                />
                              ))}
                              <div className="rounded-sm h-1.5 bg-gray-100" />
                              <div className="rounded-sm h-1.5 bg-gray-100 w-3/4" />
                            </div>
                            <div className="text-center py-0.5 text-[9px] text-gray-400 border-t border-gray-100">
                              第 {page} 页
                            </div>
                          </div>
                        </div>
                        {items.map((item, i) => (
                          <button
                            key={i}
                            onClick={() => scrollToPage(page)}
                            className="w-full flex items-center gap-1.5 px-3 py-1 text-left hover:bg-gray-50 group"
                          >
                            <span
                              className="shrink-0 text-[9px] px-1.5 py-0.5 rounded font-medium"
                              style={{ background: item.bg, color: item.color }}
                            >
                              {item.type}
                            </span>
                            <span className="text-[11px] text-gray-600 truncate group-hover:text-gray-900">
                              {item.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Document scroll area */}
            <div className="flex-1 overflow-auto scrollbar-hide py-6 px-4" ref={docScrollRef}>
              <div
                className="mx-auto"
                style={{
                  width: `${zoom}%`,
                  minWidth: 280,
                  maxWidth: 700,
                  transition: "width 0.15s",
                }}
              >
                {/* All pages rendered continuously */}
                <div className="space-y-6">
                  {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
                    <div key={page} id={`doc-page-${page}`} className="bg-white shadow-md rounded relative" style={{ padding: "40px 48px" }}>
                      {/* Page number */}
                      <div className="absolute top-2 right-3 text-[10px] text-gray-300">第 {page} 页</div>

                      {/* Document blocks with overlay masks */}
                      <div className="space-y-4">
                        {blocksForPage(page).map((block) => (
                          <div
                            key={block.id}
                            className="relative"
                            onMouseEnter={() => setHoveredBlock(block.id)}
                            onMouseLeave={() => setHoveredBlock(null)}
                            style={{ position: "relative" }}
                          >
                            {/* Overlay mask border */}
                            {showLayout && (
                              <div
                                style={{
                                  position: "absolute",
                                  inset: -4,
                                  borderRadius: 4,
                                  border: `1.5px dashed ${block.borderColor}`,
                                  background: block.borderColor + (hoveredBlock === block.id ? "12" : "06"),
                                  pointerEvents: "none",
                                  zIndex: 1,
                                  transition: "background 0.15s",
                                }}
                              />
                            )}

                            {/* Floating action popup on hover */}
                            {showLayout && hoveredBlock === block.id && (
                              <BlockActionPopup
                                type={block.type}
                                typeColor={block.typeColor}
                                typeBg={block.typeBg}
                              />
                            )}

                            {/* Block content */}
                            <div style={{ position: "relative", zIndex: 2 }}>
                              {block.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Parse result */}
        <div className="w-1/2 flex flex-col">
          <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("markdown")}
                className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${viewMode === "markdown" ? "text-white" : "text-gray-500 hover:bg-gray-100"}`}
                style={viewMode === "markdown" ? { background: "#1a6de0" } : {}}
              >
                Markdown
              </button>
              <button
                onClick={() => setViewMode("json")}
                className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${viewMode === "json" ? "text-white" : "text-gray-500 hover:bg-gray-100"}`}
                style={viewMode === "json" ? { background: "#1a6de0" } : {}}
              >
                <Code className="w-3 h-3 inline mr-1" />JSON
              </button>
            </div>
            <div className="flex items-center gap-2">
              {viewMode === "markdown" && (
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-all ${editMode ? "text-white" : "text-gray-500 border border-gray-200 hover:bg-gray-50"}`}
                  style={editMode ? { background: "#f59e0b" } : {}}
                >
                  {editMode ? <Save className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                  {editMode ? "保存" : "编辑"}
                </button>
              )}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md text-gray-500 border border-gray-200 hover:bg-gray-50"
              >
                <Copy className="w-3 h-3" />
                {copied ? "已复制" : "复制"}
              </button>
              {/* Download dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDownload((v) => !v)}
                  className="flex items-center gap-0.5 text-xs px-2.5 py-1 rounded-md text-gray-500 border border-gray-200 hover:bg-gray-50"
                  title="下载"
                >
                  <Download className="w-3 h-3" />
                  下载
                  <ChevronDown className="w-3 h-3 ml-0.5" />
                </button>
                {showDownload && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDownload(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-36 overflow-hidden">
                      {DOWNLOAD_FORMATS.map((fmt) => (
                        <button
                          key={fmt.ext}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-gray-700 hover:bg-gray-50 text-left"
                          onClick={() => {
                            const blob = new Blob([`# 采购合同_2024Q4\n\n(模拟导出内容)`], { type: "text/plain" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `采购合同_2024Q4.${fmt.ext}`;
                            a.click();
                            URL.revokeObjectURL(url);
                            setShowDownload(false);
                          }}
                        >
                          <File className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          {fmt.label}
                          <span className="ml-auto text-gray-300">.{fmt.ext}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-white">
            {viewMode === "markdown" && !editMode && (
              <div className="p-4 space-y-1">
                {mdBlocks.map((block) => (
                  <div
                    key={block.id}
                    onMouseEnter={(e) => handleMdBlockEnter(block.id, e)}
                    onMouseLeave={handleMdBlockLeave}
                    style={{
                      position: "relative",
                      borderRadius: 6,
                      padding: "8px 10px",
                      border: hoveredMdBlock === block.id
                        ? `1.5px dashed ${block.borderColor}`
                        : "1.5px solid transparent",
                      background: hoveredMdBlock === block.id
                        ? block.borderColor + "0a"
                        : "transparent",
                      transition: "border-color 0.15s, background 0.15s",
                      cursor: "default",
                    }}
                  >
                    {block.content}
                  </div>
                ))}
              </div>
            )}
            {viewMode === "markdown" && editMode && (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-full p-6 text-xs font-mono text-gray-800 outline-none resize-none bg-amber-50/30 border-l-2 border-amber-400"
              />
            )}
            {viewMode === "json" && (
              <div className="p-6">
                <pre className="text-xs font-mono text-green-400 bg-gray-900 p-4 rounded-lg overflow-auto">{CONTENT_JSON}</pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dataset modal */}
      {showDatasetModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-2xl">
            <div className="text-base text-gray-900 font-medium mb-4">添加到数据集</div>
            <div className="space-y-2 mb-4">
              {dsPageItems.map((ds) => (
                <label
                  key={ds.id}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-colors"
                  style={{
                    border: `1px solid ${dsSelected.includes(ds.id) ? "#5E6AD2" : "#E5E5EB"}`,
                    background: dsSelected.includes(ds.id) ? "#EEEFFC" : "#F7F8FA",
                  }}
                >
                  <input
                    type="checkbox"
                    name="dataset"
                    className="accent-[#5E6AD2] w-3.5 h-3.5 shrink-0"
                    checked={dsSelected.includes(ds.id)}
                    onChange={() => toggleDs(ds.id)}
                  />
                  <span style={{ fontSize: 13, color: dsSelected.includes(ds.id) ? "#5E6AD2" : "#1A1A2E", fontWeight: dsSelected.includes(ds.id) ? 500 : 400 }}>
                    {ds.name}
                  </span>
                </label>
              ))}
              
            </div>
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDsPage((p) => Math.max(1, p - 1))}
                  disabled={dsPage === 1}
                  className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-500"
                  title="上一页"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-gray-700 tabular-nums px-1">
                  {dsPage} / {dsTotalPages}
                </span>
                <button
                  onClick={() => setDsPage((p) => Math.min(dsTotalPages, p + 1))}
                  disabled={dsPage === dsTotalPages}
                  className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-500"
                  title="下一页"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={dsSearch}
                onChange={(e) => setDsSearch(e.target.value)}
                placeholder="搜索数据集..."
                className="w-32 px-3 py-1.5 text-xs text-gray-700 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-300"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={closeDatasetModal} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">取消</button>
              <button onClick={handleAddToDataset} className="px-4 py-2 text-sm text-white rounded-lg" style={{ background: "#1a6de0" }}>
                {dsAddSuccess ? "添加成功" : "确认添加"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed-position MD block action popup — rendered outside overflow containers */}
      {mdPopup && (
        <div
          style={{
            position: "fixed",
            top: mdPopup.top,
            left: mdPopup.left,
            transform: "translateX(-50%)",
            zIndex: 9999,
            background: "#1a1a2e",
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.32)",
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            pointerEvents: "auto",
          }}
          onMouseEnter={handlePopupEnter}
          onMouseLeave={handlePopupLeave}
        >
          {/* Type tag */}
          <span
            style={{
              fontSize: 10,
              padding: "2px 7px",
              borderRadius: 4,
              background: mdPopup.block.typeBg,
              color: mdPopup.block.typeColor,
              fontWeight: 600,
            }}
          >
            {mdPopup.block.type}
          </span>
          <div style={{ width: 1, height: 18, background: "#333" }} />
          {/* Copy */}
          <button
            onClick={handleCopy}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "#e2e8f0",
              fontSize: 12,
              fontWeight: 500,
              background: "#2d3748",
              borderRadius: 6,
              padding: "3px 10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Copy size={11} />
            复制
          </button>
          {/* Edit */}
          <button
            onClick={() => { setEditMode(true); setMdPopup(null); setHoveredMdBlock(null); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              color: "#fff",
              fontSize: 12,
              fontWeight: 500,
              background: "#f59e0b",
              borderRadius: 6,
              padding: "3px 10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Edit3 size={11} />
            编辑
          </button>
          {/* Arrow down */}
          <div
            style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 10,
              height: 6,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                background: "#1a1a2e",
                transform: "rotate(45deg)",
                marginTop: -5,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}