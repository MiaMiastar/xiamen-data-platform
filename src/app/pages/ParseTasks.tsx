import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import type { ElementType } from "react";
import {
  Upload,
  Search,
  FileText,
  RotateCcw,
  Trash2,
  File,
  X,
  Download,
  Paperclip,
  Globe,
  Settings,
} from "lucide-react";
import {
  tasksData,
  STATUS_CONFIG,
  TYPE_COLORS,
  getFileType,
  formatSize,
  type ParseTask,
  type TaskStatus,
} from "./parseTasksStore";

const DOWNLOAD_FORMATS = [
  { label: "原文件", ext: null },
  { label: "Markdown", ext: "md" },
  { label: "JSON",     ext: "json" },
  { label: "HTML",     ext: "html" },
  { label: "DOCX",     ext: "docx" },
  { label: "LaTeX",    ext: "tex" },
];

/* File type icons as colored SVG-like elements */
function FileTypeIcons() {
  const icons = [
    { color: "#3DB880", label: "XLS", rotate: -15, zIndex: 1 },
    { color: "#E5484D", label: "PDF", rotate: -6, zIndex: 3 },
    { color: "#F4A942", label: "PPT", rotate: 6, zIndex: 2 },
    { color: "#5E6AD2", label: "DOC", rotate: 15, zIndex: 1 },
  ];
  return (
    <div className="flex items-center justify-center" style={{ height: 64 }}>
      <div className="relative" style={{ width: 120, height: 56 }}>
        {icons.map((ic, i) => (
          <div
            key={i}
            className="absolute flex items-center justify-center rounded-md"
            style={{
              width: 36,
              height: 46,
              background: ic.color,
              color: "#fff",
              fontSize: 9,
              fontWeight: 700,
              transform: `rotate(${ic.rotate}deg)`,
              left: `${12 + i * 22}px`,
              top: 4,
              zIndex: ic.zIndex,
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
              borderRadius: 6,
            }}
          >
            {ic.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ParseTasks() {
  const [tasks, setTasks]           = useState<ParseTask[]>(tasksData);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("全部");
  const [dragging, setDragging]     = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [urlMode, setUrlMode]       = useState(false);
  const [urlInput, setUrlInput]     = useState("");
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [openDownloadId, setOpenDownloadId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filtered = tasks.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "全部" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = tasks.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setPendingFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name));
      const next = [...prev];
      Array.from(fileList).forEach((f) => {
        if (!existing.has(f.name)) next.push(f);
      });
      return next;
    });
    setUrlMode(false);
  }, []);

  const removeFile = (index: number) =>
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));

  const simulateProgress = (taskIds: string[]) => {
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          taskIds.includes(t.id) && t.status === "上传中"
            ? { ...t, status: "解析中" }
            : t
        )
      );
    }, 1500);
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((t) =>
          taskIds.includes(t.id) && t.status === "解析中"
            ? { ...t, status: "解析成功", pages: Math.floor(Math.random() * 40) + 1 }
            : t
        )
      );
    }, 4000);
  };

  const handleStartParse = () => {
    const now = new Date().toLocaleString("zh-CN").replace(/\//g, "-");
    let newTaskIds: string[] = [];

    if (pendingFiles.length > 0) {
      const newTasks: ParseTask[] = pendingFiles.map((file) => {
        const id = `t${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        newTaskIds.push(id);
        return {
          id,
          name: file.name,
          size: formatSize(file.size),
          type: getFileType(file.name),
          status: "上传中" as TaskStatus,
          createdAt: now,
        };
      });
      setTasks((prev) => [...newTasks, ...prev]);
      simulateProgress(newTaskIds);
    }

    setPendingFiles([]);
    setUrlMode(false);
    setUrlInput("");
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    const now = new Date().toLocaleString("zh-CN").replace(/\//g, "-");
    const urlName = urlInput.trim().split("/").pop() || "url_import_file";
    const id = `t${Date.now()}`;
    setTasks((prev) => [
      {
        id,
        name: urlName,
        size: "—",
        type: getFileType(urlName),
        status: "上传中",
        createdAt: now,
      },
      ...prev,
    ]);
    simulateProgress([id]);
    setUrlMode(false);
    setUrlInput("");
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setTasks((prev) => prev.filter((t) => t.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen" style={{ background: "#F7F8FA" }}>
      <div className="px-7 py-6 space-y-5">
        {/* Title */}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111118", letterSpacing: "-0.025em" }}>
            智能解析
          </h1>
          <p style={{ fontSize: 14, color: "#6B6B80", marginTop: 4 }}>
            让文档内容为AI所用
          </p>
        </div>

        {/* Upload area — inline on page */}
        {!urlMode && pendingFiles.length === 0 && (
          <div
            className={`relative rounded-xl transition-all ${
              dragging
                ? "border-[#5E6AD2] bg-[#EEEFFC]/50"
                : "border-[#E5E5EB] bg-white"
            }`}
            style={{ border: `1.5px ${dragging ? "solid" : "dashed"} ${dragging ? "#5E6AD2" : "#E5E5EB"}` }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          >
            {/* Settings icon */}
            

            <div className="flex flex-col items-center justify-center py-12">
              <FileTypeIcons />
              <div className="flex items-center gap-3 mt-6">
                <div className="relative group">
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all hover:bg-[#F5F6F8]"
                    style={{ border: "1px solid #DCDCE5", fontSize: 14, fontWeight: 500, color: "#111118" }}
                  >
                    <Paperclip className="w-4 h-4" style={{ color: "#6B6B80" }} />
                    上传文件
                  </button>
                  {/* Hover tooltip */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap"
                    style={{
                      background: "#111118",
                      color: "#fff",
                      fontSize: 12,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    <div>支持 PDF / Word / PPT / Excel / 图片</div>
                    <div style={{ color: "rgba(255,255,255,0.55)", marginTop: 2 }}>单文件最大 100MB</div>
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                      style={{
                        borderLeft: "5px solid transparent",
                        borderRight: "5px solid transparent",
                        borderTop: "5px solid #111118",
                      }}
                    />
                  </div>
                </div>
                <button
                  onClick={() => setUrlMode(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all hover:bg-[#F5F6F8]"
                  style={{ border: "1px solid #DCDCE5", fontSize: 14, fontWeight: 500, color: "#111118" }}
                >
                  <Globe className="w-4 h-4" style={{ color: "#6B6B80" }} />
                  粘贴链接
                </button>
              </div>
            </div>

            <input
              ref={fileRef}
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.doc,.pptx,.ppt,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
              onChange={(e) => { addFiles(e.target.files); if (e.target) e.target.value = ""; }}
            />
          </div>
        )}

        {/* URL input mode */}
        {urlMode && pendingFiles.length === 0 && (
          <div
            className="rounded-xl bg-white"
            style={{ border: "1px solid #E5E5EB" }}
          >
            <div className="p-5">
              <textarea
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="请输入文件链接或网页链接，最多可输入 1 个链接"
                className="w-full resize-none outline-none"
                style={{ fontSize: 13, color: "#1A1A2E", minHeight: 140, background: "transparent" }}
              />
            </div>
            <div className="flex justify-end gap-2.5 px-5 pb-5">
              <button
                onClick={() => { setUrlMode(false); setUrlInput(""); }}
                className="px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                style={{ fontSize: 13, color: "#6E6E8A", border: "1px solid #E5E5EB" }}
              >
                取消
              </button>
              <button
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
                className="px-4 py-2 rounded-lg text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
                style={{ fontSize: 13, background: "#1A1A2E" }}
              >
                提交
              </button>
            </div>
          </div>
        )}

        {/* Pending files preview */}
        {pendingFiles.length > 0 && (
          <div className="rounded-xl bg-white" style={{ border: "1px solid #E5E5EB" }}>
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontSize: 13, fontWeight: 500, color: "#1A1A2E" }}>
                  已选择 {pendingFiles.length} 个文件
                </span>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1 text-[#5E6AD2] hover:underline"
                  style={{ fontSize: 12 }}
                >
                  <Upload className="w-3 h-3" /> 继续添加
                </button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {pendingFiles.map((file, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-md" style={{ background: "#F7F8FA", border: "1px solid #F0F0F5" }}>
                    <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: 12, color: "#1A1A2E" }} className="truncate">{file.name}</div>
                      <div style={{ fontSize: 11, color: "#8A8AA0" }}>{formatSize(file.size)}</div>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="text-gray-400 hover:text-red-500 shrink-0"
                      title="移除"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2.5 px-5 pb-5">
              <button
                onClick={() => setPendingFiles([])}
                className="px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                style={{ fontSize: 13, color: "#6E6E8A", border: "1px solid #E5E5EB" }}
              >
                取消
              </button>
              <button
                onClick={handleStartParse}
                className="px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
                style={{ fontSize: 13, background: "#5E6AD2" }}
              >
                开始解析（{pendingFiles.length} 个文件）
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.docx,.doc,.pptx,.ppt,.png,.jpg,.jpeg,.xlsx,.xls,.csv"
              onChange={(e) => { addFiles(e.target.files); if (e.target) e.target.value = ""; }}
            />
          </div>
        )}

        {/* Status filter + Search */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {(["全部", "解析成功", "解析中", "解析失败", "上传失败"] as const).map((s) => {
              const cfg = s !== "全部" ? STATUS_CONFIG[s as TaskStatus] : null;
              const count = s === "全部" ? tasks.length : (statusCounts[s] || 0);
              const isActive = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="px-3 py-1 rounded-md transition-all"
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    background: isActive ? (cfg?.color || "#111118") + "18" : "#ffffff",
                    color: isActive ? (cfg?.color || "#111118") : "#6B6B80",
                    border: `1px solid ${isActive ? (cfg?.color || "#111118") + "30" : "#DCDCE5"}`,
                  }}
                >
                  {s}
                  <span className="ml-1.5 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6B6B80" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索文件名..."
              className="w-full pl-9 pr-4 py-2 rounded-md outline-none"
              style={{ fontSize: 14, border: "1px solid #DCDCE5", background: "#ffffff", color: "#111118" }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg overflow-hidden" style={{ border: "1px solid #DCDCE5" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid #DCDCE5" }}>
                <th className="text-left px-5 py-3" style={{ fontSize: 12, color: "#6B6B80", fontWeight: 600 }}>文件名称</th>
                <th className="text-left px-4 py-3" style={{ fontSize: 12, color: "#6B6B80", fontWeight: 600 }}>类型</th>
                <th className="text-left px-4 py-3" style={{ fontSize: 12, color: "#6B6B80", fontWeight: 600 }}>大小</th>
                <th className="text-left px-4 py-3" style={{ fontSize: 12, color: "#6B6B80", fontWeight: 600 }}>状态</th>
                <th className="text-left px-4 py-3" style={{ fontSize: 12, color: "#6B6B80", fontWeight: 600 }}>创建时间</th>
                <th className="text-right px-5 py-3" style={{ fontSize: 12, color: "#6B6B80", fontWeight: 600 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => {
                const cfg = STATUS_CONFIG[task.status];
                return (
                  <tr
                    key={task.id}
                    className="hover:bg-[#F5F6F8] cursor-pointer transition-colors"
                    style={{ borderBottom: "1px solid #F0F0F5" }}
                    onClick={() => navigate(`/parse-tasks/${task.id}`)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 shrink-0" style={{ color: "#6B6B80" }} />
                        <span style={{ fontSize: 14, color: "#111118", fontWeight: 500 }} className="truncate max-w-[240px]">
                          {task.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded"
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          background: (TYPE_COLORS[task.type] || "#6b7280") + "18",
                          color: TYPE_COLORS[task.type] || "#6b7280",
                        }}
                      >
                        {task.type}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: 13, color: "#4A4A62" }}>{task.size}</td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                          style={{ fontSize: 12, fontWeight: 500, background: cfg.bg, color: cfg.color }}
                        >
                          <cfg.icon
                            className={`w-3.5 h-3.5 ${task.status === "解析中" || task.status === "上传中" ? "animate-spin" : ""}`}
                          />
                          {task.status}
                        </span>
                        {(task.status === "解析失败" || task.status === "上传失败") && (
                          <button
                            type="button"
                            className="p-1 rounded-md hover:bg-[#F0F0F5] transition-colors"
                            style={{ color: "#6B6B80" }}
                            title="重新上传"
                            onClick={(e) => {
                              e.stopPropagation();
                              const id = task.id;
                              setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: "上传中" } : t));
                              simulateProgress([id]);
                            }}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3" style={{ fontSize: 13, color: "#6B6B80" }}>{task.createdAt}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setOpenDownloadId(openDownloadId === task.id ? null : task.id)}
                            className="p-1.5 rounded-md hover:bg-[#F0F0F5] transition-colors"
                            style={{ color: "#8A8AA0" }}
                            title="下载"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          {openDownloadId === task.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenDownloadId(null)} />
                              <div
                                className="absolute right-0 top-full mt-1 z-20 bg-white rounded-lg py-1 w-36 overflow-hidden"
                                style={{ border: "1px solid #E5E5EB", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                              >
                                {DOWNLOAD_FORMATS.map((fmt) => {
                                  const isOriginal = fmt.ext === null;
                                  const downloadName = isOriginal ? task.name : `${task.name.replace(/\.[^.]+$/, "")}.${fmt.ext}`;
                                  return (
                                    <button
                                      key={fmt.ext ?? "original"}
                                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#F5F6F8] text-left transition-colors"
                                      style={{ fontSize: 13, color: "#111118" }}
                                      onClick={() => {
                                        const baseName = task.name.replace(/\.[^.]+$/, "");
                                        const blob = new Blob([`# ${baseName}\n\n(模拟导出内容)`], { type: "text/plain" });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = downloadName;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                        setOpenDownloadId(null);
                                      }}
                                    >
                                      <File className="w-3.5 h-3.5 shrink-0" style={{ color: "#6B6B80" }} />
                                      {fmt.label}
                                      {isOriginal ? (
                                        <span className="ml-auto" style={{ fontSize: 12, color: "#ADADC0" }}>
                                          {task.name.match(/\.[^.]+$/)?.[0] ?? ""}
                                        </span>
                                      ) : (
                                        <span className="ml-auto" style={{ fontSize: 12, color: "#ADADC0" }}>.{fmt.ext}</span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteId(task.id); }}
                          className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-500 transition-colors"
                          style={{ color: "#8A8AA0" }}
                          title="删除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <File className="w-8 h-8 mx-auto mb-3" style={{ color: "#CDCDD8" }} />
              <div style={{ fontSize: 14, color: "#6B6B80" }}>暂无解析任务</div>
            </div>
          )}
        </div>

        {/* Delete confirm */}
        {deleteId && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
            <div
              className="bg-white rounded-xl p-6 w-[360px]"
              style={{ border: "1px solid #E5E5EB", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
            >
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111118", marginBottom: 8 }}>确认删除</div>
              <div style={{ fontSize: 14, color: "#6B6B80", marginBottom: 20 }}>删除后无法恢复，确认删除该解析任务？</div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                  style={{ fontSize: 14, color: "#4A4A62", border: "1px solid #DCDCE5" }}
                >
                  取消
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 rounded-md text-white transition-opacity hover:opacity-90"
                  style={{ fontSize: 14, background: "#E5484D" }}
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}