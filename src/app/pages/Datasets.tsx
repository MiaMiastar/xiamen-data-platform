import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/app/components/ui/tooltip";
import type { ElementType } from "react";
import {
  Plus,
  Search,
  Database,
  Edit3,
  GitBranch,
  Trash2,
  CheckCircle,
  Loader,
  XCircle,
} from "lucide-react";

type DatasetStatus = "已上传" | "创建中" | "创建失败";

interface Dataset {
  id: string;
  name: string;
  desc: string;
  status: DatasetStatus;
  fileSize: string;
  fileCount: number;
  dataVolume: string;
  latestVersion: string;
  useScenarios?: string[];
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

const STATUS_CONFIG: Record<DatasetStatus, { icon: ElementType; color: string; bg: string }> = {
  已上传: { icon: CheckCircle, color: "#3DB880", bg: "#E8FAF0" },
  创建中: { icon: Loader, color: "#5E6AD2", bg: "#EEEFFC" },
  创建失败: { icon: XCircle, color: "#E5484D", bg: "#FDECEA" },
};

const MOCK_DATASETS: Dataset[] = [
  {
    id: "ds001",
    name: "供应商基础信息",
    desc: "2024年度供应商档案及评审报告数据集",
    status: "已上传",
    fileSize: "12.4 MB",
    fileCount: 38,
    dataVolume: "1.2万条",
    latestVersion: "v1.2",
    useScenarios: ["文本生成"],
    tags: ["供应商", "档案", "2024"],
    createdAt: "2026-03-01",
    updatedAt: "2026-03-04",
  },
  {
    id: "ds002",
    name: "采购合同库",
    desc: "2024Q4采购合同解析结构化数据",
    status: "已上传",
    fileSize: "8.7 MB",
    fileCount: 22,
    dataVolume: "3,580条",
    latestVersion: "v2.0",
    useScenarios: ["文本生成"],
    tags: ["合同", "采购", "Q4"],
    createdAt: "2026-03-02",
    updatedAt: "2026-03-04",
  },
  {
    id: "ds003",
    name: "物流数据集",
    desc: "物流运营报告、扫描件OCR结果",
    status: "已上传",
    fileSize: "5.2 MB",
    fileCount: 15,
    dataVolume: "856条",
    latestVersion: "v1.0",
    useScenarios: ["图片理解"],
    tags: ["物流", "OCR"],
    createdAt: "2026-03-02",
    updatedAt: "2026-03-03",
  },
  {
    id: "ds004",
    name: "产品图册数据",
    desc: "产品PPT与高清图册解析输出",
    status: "创建中",
    fileSize: "45.1 MB",
    fileCount: 8,
    dataVolume: "—",
    latestVersion: "—",
    useScenarios: ["图片理解"],
    tags: ["图册", "PPT"],
    createdAt: "2026-03-04",
    updatedAt: "2026-03-04",
  },
  {
    id: "ds005",
    name: "质检报告库",
    desc: "质检报告扫描件及结构化提取结果",
    status: "已上传",
    fileSize: "3.8 MB",
    fileCount: 31,
    dataVolume: "2,104条",
    latestVersion: "v1.1",
    useScenarios: ["文本生成"],
    tags: ["质检"],
    createdAt: "2026-03-03",
    updatedAt: "2026-03-04",
  },
  {
    id: "ds006",
    name: "损坏文件测试集",
    desc: "测试解析失败场景的数据集",
    status: "创建失败",
    fileSize: "0 KB",
    fileCount: 0,
    dataVolume: "0条",
    latestVersion: "—",
    useScenarios: ["文本生成"],
    tags: ["测试"],
    createdAt: "2026-03-03",
    updatedAt: "2026-03-03",
  },
];

export function Datasets() {
  const [datasets, setDatasets] = useState<Dataset[]>(MOCK_DATASETS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("全部");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 从创建页返回时接收新数据集
  useEffect(() => {
    const state = location.state as { newDataset?: Dataset } | null;
    if (state?.newDataset) {
      const newDs = state.newDataset;
      const withUpdatedAt = { ...newDs, updatedAt: newDs.updatedAt ?? newDs.createdAt };
      setDatasets((prev) => [withUpdatedAt, ...prev]);
      navigate("/datasets", { replace: true, state: {} });
      setTimeout(() => {
        setDatasets((prev) =>
          prev.map((d) =>
            d.id === newDs.id
              ? { ...d, status: "已上传", dataVolume: "0条", latestVersion: "v1.0", updatedAt: d.createdAt }
              : d
          )
        );
      }, 2500);
    }
  }, [location.state, navigate]);

  const filtered = datasets.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.includes(search));
    const matchStatus = statusFilter === "全部" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen" style={{ background: "#F7F8FA" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-7"
        style={{ height: 56, background: "#ffffff", borderBottom: "1px solid #DCDCE5" }}
      >
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111118", letterSpacing: "-0.02em" }}>数据集</h1>
          <p style={{ fontSize: 13, color: "#6B6B80", marginTop: 1 }}>管理数据集，归档解析与评估结果，支持多版本迭代</p>
        </div>
      </div>

      <div className="px-7 py-5 space-y-4">
        {/* 列表左上角：创建按钮 + 搜索 */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/datasets/create")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md text-white transition-opacity hover:opacity-90 shrink-0"
            style={{ background: "#5E6AD2", fontSize: 14 }}
          >
            <Plus className="w-4 h-4" />
            创建数据集
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6B6B80" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索名称或标签..."
              className="pl-9 pr-4 py-2 rounded-md outline-none w-64"
              style={{ fontSize: 14, border: "1px solid #DCDCE5", background: "#ffffff", color: "#111118" }}
            />
          </div>
        </div>

        {/* Dataset list - 表格式网格布局，左右铺满 */}
        <div className="w-full bg-white rounded-lg overflow-hidden" style={{ border: "1px solid #E5E5EB" }}>
          {filtered.length === 0 ? (
            <div className="text-center py-16" style={{ fontSize: 14, color: "#9090A8" }}>
              <Database className="w-10 h-10 mx-auto mb-3 opacity-40" style={{ color: "#9090A8" }} />
              <p>暂无匹配的数据集</p>
              <p className="mt-1" style={{ fontSize: 13 }}>创建数据集或调整筛选条件</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto max-h-[calc(100vh-280px)] overflow-y-auto">
              <div
                className="w-full min-w-[720px]"
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                  alignItems: "center",
                }}
              >
                {/* 表头 - 粘性 */}
                <div
                  className="sticky top-0 z-10 col-span-9 grid gap-0 py-3 px-4"
                  style={{
                    gridColumn: "1 / -1",
                    gridTemplateColumns: "44px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                    background: "#FAFAFB",
                    borderBottom: "1px solid #E5E5EB",
                    fontSize: 12,
                    color: "#6B6B80",
                    fontWeight: 500,
                  }}
                >
                  <span />
                  <span>名称</span>
                  <span>状态</span>
                  <span>数据量</span>
                  <span>最新版本</span>
                  <span>场景</span>
                  <span>标签</span>
                  <span>创建时间</span>
                  <span>更新时间</span>
                  <span className="text-center">操作</span>
                </div>
                {/* 数据行 */}
                {filtered.map((ds, index) => {
                  const cfg = STATUS_CONFIG[ds.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <div
                      key={ds.id}
                      className="col-span-9 grid gap-0 py-3 px-4 cursor-pointer group items-center"
                      style={{
                        gridColumn: "1 / -1",
                        gridTemplateColumns: "44px 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
                        background: index % 2 === 1 ? "#FAFAFC" : "#ffffff",
                        borderBottom: "1px solid #F0F0F5",
                        fontSize: 13,
                        transition: "background 0.15s ease",
                      }}
                      onClick={() => navigate(`/datasets/${ds.id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#F5F5F9";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index % 2 === 1 ? "#FAFAFC" : "#ffffff";
                      }}
                    >
                      <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={{ background: "#EEEFFC" }}>
                        <Database className="w-4 h-4" style={{ color: "#5E6AD2" }} />
                      </div>
                      <div className="min-w-0 truncate font-medium" style={{ color: "#111118" }} title={ds.name}>{ds.name}</div>
                      <span
                        className="inline-flex items-center gap-1 w-fit px-2 py-0.5 rounded text-xs font-medium shrink-0"
                        style={{ background: cfg.bg, color: cfg.color }}
                      >
                        {ds.status === "创建中" ? <StatusIcon className="w-3 h-3 animate-spin" /> : <StatusIcon className="w-3 h-3" />}
                        {ds.status}
                      </span>
                      <span className="shrink-0 tabular-nums" style={{ color: "#111118" }} title={ds.dataVolume}>
                        {ds.dataVolume || "—"}
                      </span>
                      <span className="shrink-0" style={{ color: "#111118" }} title={ds.latestVersion}>
                        {ds.latestVersion || "—"}
                      </span>
                      <span className="shrink-0 min-w-0 truncate" style={{ color: "#111118" }} title={(ds.useScenarios ?? []).join("、")}>
                        {(ds.useScenarios ?? []).length > 0 ? (ds.useScenarios ?? []).join("、") : "—"}
                      </span>
                      <div className="flex flex-wrap gap-1 min-w-0">
                        {(ds.tags ?? []).slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="px-2 py-0.5 rounded truncate max-w-[72px] shrink-0"
                            style={{ fontSize: 11, background: "#F0F0F5", color: "#4A4A62" }}
                            title={t}
                          >
                            {t}
                          </span>
                        ))}
                        {(ds.tags ?? []).length > 3 && (
                          <span className="px-1.5 py-0.5 rounded shrink-0" style={{ fontSize: 11, background: "#F0F0F5", color: "#9090A8" }}>
                            +{(ds.tags ?? []).length - 3}
                          </span>
                        )}
                        {(ds.tags ?? []).length === 0 && (
                          <span style={{ fontSize: 12, color: "#9090A8" }}>—</span>
                        )}
                      </div>
                      <span className="shrink-0" style={{ color: "#9090A8", fontSize: 12 }}>{ds.createdAt}</span>
                      <span className="shrink-0" style={{ color: "#9090A8", fontSize: 12 }}>{ds.updatedAt ?? "—"}</span>
                      <div className="flex items-center justify-center gap-0.5 shrink-0 min-w-[100px]" onClick={(e) => e.stopPropagation()}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/datasets/${ds.id}`); }}
                              className="p-1.5 rounded-md hover:bg-[#EEEFFC] transition-colors"
                              style={{ color: "#8A8AA0" }}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={6}>编辑</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/datasets/${ds.id}?newVersion=1`); }}
                              className="p-1.5 rounded-md hover:bg-[#EEEFFC] transition-colors"
                              style={{ color: "#8A8AA0" }}
                            >
                              <GitBranch className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={6}>新增版本</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeleteId(ds.id); }}
                              className="p-1.5 rounded-md hover:bg-red-50 transition-colors"
                              style={{ color: "#8A8AA0" }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={6}>删除</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  );
                })}
              </div>
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
              <div style={{ fontSize: 14, color: "#6B6B80", marginBottom: 20 }}>删除后数据集内所有数据将无法恢复，是否确认？</div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                  style={{ fontSize: 14, color: "#4A4A62", border: "1px solid #DCDCE5" }}
                >
                  取消
                </button>
                <button
                  onClick={() => { setDatasets((prev) => prev.filter((d) => d.id !== deleteId)); setDeleteId(null); }}
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