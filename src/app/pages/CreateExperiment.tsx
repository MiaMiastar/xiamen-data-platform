import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  ArrowLeft,
  Info,
  Database,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Minus,
  X,
  Upload,
  FileText,
  Search,
  FolderOpen,
  ExternalLink,
  FlaskConical,
  Settings,
  CheckCircle2,
} from "lucide-react";
import {
  DATASETS,
  DATASET_FILES,
  METRIC_OPTIONS,
  EvalPipeline,
  addExperiment,
  updateExperiment,
  experimentsData,
} from "./experimentsStore";
import { toast } from "sonner";

export function CreateExperiment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 编辑模式：URL 带 editId 参数时为编辑，否则为新建
  const editId = searchParams.get("editId") ?? "";
  const editExp = editId ? experimentsData.find((e) => e.id === editId) : undefined;
  const isEdit = !!editExp;

  // 从 URL 参数预填（新建时）
  const initFile = searchParams.get("file") ?? "";
  const initName = initFile ? initFile.replace(/\.[^.]+$/, "") + "_评估" : "";

  // 基本信息
  const [formName, setFormName] = useState(editExp?.name ?? initName);
  const [formDesc, setFormDesc] = useState(editExp?.desc ?? "");

  // 数据集
  const [formDataset, setFormDataset] = useState(editExp?.dataset ?? "");
  const [formDataFiles, setFormDataFiles] = useState<string[]>(
    editExp?.dataFiles ?? (initFile ? [initFile] : [])
  );

  // 文件选择弹窗
  const [showFilePicker, setShowFilePicker] = useState(false);
  const [filePickerSearch, setFilePickerSearch] = useState("");
  const [filePickerSelected, setFilePickerSelected] = useState<string[]>([]);
  const [expandedDatasets, setExpandedDatasets] = useState<Set<string>>(new Set(Object.keys(DATASET_FILES)));
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // 执行器配置
  const [formMaxWorkers, setFormMaxWorkers] = useState(editExp?.maxWorkers ?? "1");
  const [formBatchSize, setFormBatchSize] = useState(editExp?.batchSize ?? "1");
  const [resultSave, setResultSave] = useState(
    editExp?.resultSave ?? { merge: true, bad: false, good: false, raw: false, all_labels: false }
  );

  // 评估器
  const [pipelines, setPipelines] = useState<EvalPipeline[]>(editExp?.pipelines ?? []);

  // 指标选择弹窗
  const [metricPickerPipelineId, setMetricPickerPipelineId] = useState<string | null>(null);
  const [metricPickerSelected, setMetricPickerSelected] = useState<string[]>([]);
  const [metricPickerSearch, setMetricPickerSearch] = useState("");

  const openMetricPicker = (pipelineId: string, currentMetrics: string[]) => {
    setMetricPickerPipelineId(pipelineId);
    setMetricPickerSelected([...currentMetrics]);
    setMetricPickerSearch("");
  };

  const confirmMetricPicker = () => {
    if (!metricPickerPipelineId) return;
    setPipelines((prev) =>
      prev.map((p) => p.id === metricPickerPipelineId ? { ...p, metrics: metricPickerSelected } : p)
    );
    setMetricPickerPipelineId(null);
  };

  const addPipeline = () => {
    setPipelines((prev) => [
      ...prev,
      { id: `ep${Date.now()}`, fields: [{ key: "", value: "" }], evalMode: "metric", metrics: [] },
    ]);
  };

  const removePipeline = (id: string) =>
    setPipelines((prev) => prev.filter((p) => p.id !== id));

  const handleSubmit = () => {
    if (!formName.trim()) return;
    if (isEdit) {
      updateExperiment(editId, {
        name: formName,
        desc: formDesc || undefined,
        dataset: formDataset.split(" ")[0] || editExp!.dataset,
        dataFiles: formDataFiles,
        maxWorkers: formMaxWorkers,
        batchSize: formBatchSize,
        resultSave,
        pipelines,
      });
      toast.success("实验配置已保存");
      navigate(`/eval-tasks/${editId}`);
    } else {
      addExperiment({
        id: `${Date.now()}-xxxx`,
        name: formName,
        desc: formDesc || undefined,
        dataset: formDataset.split(" ")[0] || "—",
        status: "new",
        createdAt: new Date().toLocaleString("zh-CN"),
        dataFiles: formDataFiles,
        maxWorkers: formMaxWorkers,
        batchSize: formBatchSize,
        resultSave,
        pipelines,
      });
      navigate("/eval-tasks");
    }
  };

  const canSubmit = formName.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#f5f6fa] flex flex-col">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => navigate(isEdit ? `/eval-tasks/${editId}` : "/eval-tasks", { replace: true })}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {isEdit ? "返回任务详情" : "返回任务列表"}
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
          {isEdit ? `编辑任务「${editExp!.name}」` : "创建评估任务"}
        </span>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Section 1：基本信息 */}
          <SectionCard
            icon={<FlaskConical className="w-4 h-4 text-indigo-500" />}
            title="基本信息"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">
                  实验名称 <span className="text-red-500">*</span>
                </label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="例如：训练数据质量检测"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">描述（选填）</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="请描述本次实验的目的..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-400 resize-none"
                />
              </div>
            </div>
          </SectionCard>

          {/* Section 2：数据集 */}
          <SectionCard
            icon={<Database className="w-4 h-4 text-indigo-500" />}
            title="数据集"
            required
          >
            <div className="space-y-4">
              {/* 数据集选择 */}
              

              {/* 数据文件 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-gray-500">数据文件（data_files）</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFilePickerSelected([...formDataFiles]);
                        setFilePickerSearch("");
                        setShowFilePicker(true);
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-gray-200 bg-white hover:bg-indigo-50 transition-colors"
                      style={{ color: "#4f46e5" }}
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      从数据集选择
                    </button>
                    <button
                      type="button"
                      onClick={() => uploadInputRef.current?.click()}
                      className="flex items-center gap-1 px-2.5 py-1 rounded text-xs border border-gray-200 bg-white hover:bg-green-50 transition-colors"
                      style={{ color: "#059669" }}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      上传文件
                    </button>
                    <input
                      ref={uploadInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const names = Array.from(e.target.files ?? []).map((f) => f.name);
                        setFormDataFiles((prev) => [...new Set([...prev, ...names])]);
                        e.target.value = "";
                      }}
                    />
                  </div>
                </div>

                {formDataFiles.length === 0 ? (
                  <div
                    className="rounded-lg border-2 border-dashed border-gray-200 py-5 text-center text-xs text-gray-400"
                    style={{ background: "#fafafa" }}
                  >
                    暂未选择数据文件，可从数据集浏览选择或直接上传
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {formDataFiles.map((f) => (
                      <div
                        key={f}
                        className="flex items-center justify-between px-3 py-2 rounded-lg border border-indigo-100"
                        style={{ background: "#f5f3ff" }}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 shrink-0" style={{ color: "#6366f1" }} />
                          <span className="text-xs text-gray-700 font-mono">{f}</span>
                        </div>
                        <button
                          title="移除文件"
                          onClick={() => setFormDataFiles((prev) => prev.filter((x) => x !== f))}
                          className="text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Section 3：执行器配置 */}
          <SectionCard
            icon={<Settings className="w-4 h-4 text-indigo-500" />}
            title="执行器配置"
          >
            <div className="space-y-4">
              <div
                className="rounded-lg px-3 py-2 text-xs flex items-center gap-1.5"
                style={{ background: "#eef2ff", color: "#4338ca" }}
              >
                <Info className="w-3.5 h-3.5 shrink-0" />
                参数说明请参阅{" "}
                <a href="#" className="underline flex items-center gap-0.5">
                  Dingo 配置文档 <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">max_workers（最大并发数）</label>
                  <input
                    value={formMaxWorkers}
                    onChange={(e) => setFormMaxWorkers(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">batch_size（批量大小）</label>
                  <input
                    value={formBatchSize}
                    onChange={(e) => setFormBatchSize(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">result_save（结果保存选项）</label>
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  {(Object.keys(resultSave) as (keyof typeof resultSave)[]).map((key, i) => (
                    <div
                      key={key}
                      className="flex items-center justify-between px-4 py-2.5"
                      style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : undefined }}
                    >
                      <span className="text-sm text-gray-700 font-mono">{key}</span>
                      <div className="flex gap-1">
                        {([true, false] as const).map((val) => (
                          <button
                            key={String(val)}
                            onClick={() => setResultSave((prev) => ({ ...prev, [key]: val }))}
                            className="px-3 py-1 rounded text-xs transition-colors"
                            style={{
                              background: resultSave[key] === val ? "#4f46e5" : "#f3f4f6",
                              color: resultSave[key] === val ? "#fff" : "#6b7280",
                              fontWeight: resultSave[key] === val ? 600 : 400,
                            }}
                          >
                            {String(val)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Section 4：评估器 */}
          <SectionCard
            icon={<CheckCircle2 className="w-4 h-4 text-indigo-500" />}
            title="评估器"
            required
            action={
              <button
                onClick={addPipeline}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white"
                style={{ background: "#4f46e5", fontWeight: 500 }}
              >
                <Plus className="w-3.5 h-3.5" />
                添加评估器
              </button>
            }
          >
            {pipelines.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-gray-200 p-10 text-center">
                <CheckCircle2 className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-500">暂未添加评估器</p>
                <p className="text-xs text-gray-400 mt-1">点击右上角「添加评估器」创建评估管道</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pipelines.map((pipeline, pi) => (
                  <div key={pipeline.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Pipeline 标题栏 */}
                    <div
                      className="flex items-center justify-between px-4 py-3"
                      style={{ background: "#f8f9ff", borderBottom: "1px solid #e5e7eb" }}
                    >
                      <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>
                        EvalPipeline #{pi + 1}
                      </span>
                      <button onClick={() => removePipeline(pipeline.id)} title="删除评估器">
                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600" />
                      </button>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* 字段映射 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600" style={{ fontWeight: 600 }}>字段映射</span>
                          <button
                            onClick={() =>
                              setPipelines((prev) =>
                                prev.map((p) =>
                                  p.id === pipeline.id
                                    ? { ...p, fields: [...p.fields, { key: "", value: "" }] }
                                    : p
                                )
                              )
                            }
                            className="text-xs"
                            style={{ color: "#4f46e5" }}
                          >
                            + 添加字段
                          </button>
                        </div>
                        <div className="space-y-2">
                          {pipeline.fields.map((field, fi) => (
                            <div key={fi} className="flex items-center gap-2">
                              <input
                                value={field.key}
                                onChange={(e) =>
                                  setPipelines((prev) =>
                                    prev.map((p) =>
                                      p.id === pipeline.id
                                        ? { ...p, fields: p.fields.map((f, i) => i === fi ? { ...f, key: e.target.value } : f) }
                                        : p
                                    )
                                  )
                                }
                                placeholder="键"
                                className="flex-1 border border-gray-200 rounded-lg px-2.5 py-2 text-xs outline-none focus:border-indigo-400"
                              />
                              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <input
                                value={field.value}
                                onChange={(e) =>
                                  setPipelines((prev) =>
                                    prev.map((p) =>
                                      p.id === pipeline.id
                                        ? { ...p, fields: p.fields.map((f, i) => i === fi ? { ...f, value: e.target.value } : f) }
                                        : p
                                    )
                                  )
                                }
                                placeholder="值"
                                className="flex-1 border border-gray-200 rounded-lg px-2.5 py-2 text-xs outline-none focus:border-indigo-400"
                              />
                              <button
                                onClick={() =>
                                  setPipelines((prev) =>
                                    prev.map((p) =>
                                      p.id === pipeline.id
                                        ? { ...p, fields: p.fields.filter((_, i) => i !== fi) }
                                        : p
                                    )
                                  )
                                }
                                title="移除字段"
                              >
                                <Minus className="w-3.5 h-3.5 text-red-400" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 评估配置 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-600" style={{ fontWeight: 600 }}>评估指标</span>
                          <button
                            onClick={() => openMetricPicker(pipeline.id, pipeline.metrics)}
                            className="text-xs"
                            style={{ color: "#4f46e5" }}
                          >
                            + 添加指标
                          </button>
                        </div>
                        {pipeline.metrics.length === 0 ? (
                          <div className="text-xs text-gray-400 text-center py-3 bg-gray-50 rounded-lg">
                            暂未选择指标，点击「添加指标」
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {pipeline.metrics.map((m) => (
                              <span
                                key={m}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs"
                                style={{ background: "#eef2ff", color: "#4338ca" }}
                              >
                                {m}
                                <button
                                  onClick={() =>
                                    setPipelines((prev) =>
                                      prev.map((p) =>
                                        p.id === pipeline.id
                                          ? { ...p, metrics: p.metrics.filter((x) => x !== m) }
                                          : p
                                      )
                                    )
                                  }
                                  title="移除指标"
                                >
                                  <X className="w-3 h-3 text-indigo-300 hover:text-indigo-600" />
                                </button>
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

            <div
              className="mt-4 rounded-lg px-3 py-2.5 text-xs"
              style={{ background: "#eef2ff", color: "#4338ca" }}
            >
              实验将对所选数据集进行评估。通过配置评估器来设置字段映射和评估策略（指标组或自定义指标）。
            </div>
          </SectionCard>

          {/* 底部占位，防止被固定底栏遮挡 */}
          <div className="h-4" />
        </div>
      </div>

      {/* 固定底部操作栏 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-8 py-4 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {canSubmit
              ? `实验「${formName}」准备就绪`
              : "请填写实验名称以继续"}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(isEdit ? `/eval-tasks/${editId}` : "/eval-tasks", { replace: true })}
              className="px-5 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="px-5 py-2 text-sm text-white rounded-lg transition-opacity disabled:opacity-40"
              style={{ background: "#4f46e5", fontWeight: 500 }}
            >
              {isEdit ? "保存修改" : "创建实验"}
            </button>
          </div>
        </div>
      </div>

      {/* ── 数据文件选择弹窗 ── */}
      {showFilePicker && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-[480px] max-h-[85vh] flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-base text-gray-900" style={{ fontWeight: 600 }}>选择数据文件</span>
                {formDataset && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded" style={{ background: "#eef2ff", color: "#4338ca" }}>
                    {formDataset.split(" ")[0]}
                  </span>
                )}
              </div>
              <button onClick={() => setShowFilePicker(false)} title="关闭">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="px-6 pt-4 pb-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  value={filePickerSearch}
                  onChange={(e) => setFilePickerSearch(e.target.value)}
                  placeholder="搜索文件名..."
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-indigo-400"
                />
              </div>
              {(() => {
                const allFiles = Object.values(DATASET_FILES).flat()
                  .filter((f) => f.toLowerCase().includes(filePickerSearch.toLowerCase()));
                const allChecked = allFiles.length > 0 && allFiles.every((f) => filePickerSelected.includes(f));
                return (
                  <div className="flex items-center justify-between mt-3 mb-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={() => {
                          if (allChecked) {
                            setFilePickerSelected((prev) => prev.filter((f) => !allFiles.includes(f)));
                          } else {
                            setFilePickerSelected((prev) => [...new Set([...prev, ...allFiles])]);
                          }
                        }}
                        className="rounded"
                        style={{ accentColor: "#4f46e5" }}
                      />
                      <span className="text-xs text-gray-600">全选所有文件</span>
                    </label>
                    <span className="text-xs text-gray-400">
                      已选 <span style={{ color: "#4f46e5", fontWeight: 600 }}>{filePickerSelected.length}</span> 个文件
                    </span>
                  </div>
                );
              })()}
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-2">
              {(() => {
                // 构建「数据集 → 文件」分组，支持搜索过滤
                const entries = Object.entries(DATASET_FILES)
                  .map(([dsKey, allFiles]) => ({
                    dsKey,
                    files: allFiles.filter((f) =>
                      f.toLowerCase().includes(filePickerSearch.toLowerCase())
                    ),
                  }))
                  .filter(({ files }) => files.length > 0);

                if (entries.length === 0) {
                  return (
                    <div className="text-center py-8 text-xs text-gray-400">
                      没有找到匹配的文件
                    </div>
                  );
                }

                return entries.map(({ dsKey, files }) => {
                  const isExpanded = expandedDatasets.has(dsKey);
                  const dsAllChecked = files.every((f) => filePickerSelected.includes(f));
                  const dsSomeChecked = files.some((f) => filePickerSelected.includes(f)) && !dsAllChecked;

                  const toggleDataset = () => {
                    setExpandedDatasets((prev) => {
                      const next = new Set(prev);
                      if (next.has(dsKey)) next.delete(dsKey);
                      else next.add(dsKey);
                      return next;
                    });
                  };

                  const toggleDsAll = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (dsAllChecked) {
                      setFilePickerSelected((prev) => prev.filter((f) => !files.includes(f)));
                    } else {
                      setFilePickerSelected((prev) => [...new Set([...prev, ...files])]);
                    }
                  };

                  return (
                    <div key={dsKey} className="rounded-lg border border-gray-100 overflow-hidden">
                      {/* 文件夹（数据集）标题行 */}
                      <div
                        className="flex items-center gap-2 px-3 py-2.5 cursor-pointer select-none hover:bg-gray-50 transition-colors"
                        style={{ background: "#f8f9ff" }}
                        onClick={toggleDataset}
                      >
                        {/* 文件夹全选 checkbox */}
                        <input
                          type="checkbox"
                          checked={dsAllChecked}
                          ref={(el) => { if (el) el.indeterminate = dsSomeChecked; }}
                          onChange={() => {}}
                          onClick={toggleDsAll}
                          className="rounded shrink-0"
                          style={{ accentColor: "#4f46e5" }}
                        />
                        <FolderOpen
                          className="w-4 h-4 shrink-0"
                          style={{ color: isExpanded ? "#4f46e5" : "#9ca3af" }}
                        />
                        <span className="flex-1 text-sm text-gray-800 truncate" style={{ fontWeight: 600 }}>
                          {dsKey}
                        </span>
                        <span className="text-[11px] text-gray-400 shrink-0 mr-1">
                          {files.filter((f) => filePickerSelected.includes(f)).length}/{files.length}
                        </span>
                        {isExpanded
                          ? <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          : <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        }
                      </div>

                      {/* 文件列表（展开时显示） */}
                      {isExpanded && (
                        <div className="divide-y divide-gray-50">
                          {files.map((f) => {
                            const checked = filePickerSelected.includes(f);
                            return (
                              <label
                                key={f}
                                className="flex items-center gap-3 pl-9 pr-3 py-2.5 cursor-pointer transition-colors"
                                style={{
                                  background: checked ? "#f5f3ff" : "#fff",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    setFilePickerSelected((prev) =>
                                      checked ? prev.filter((x) => x !== f) : [...prev, f]
                                    )
                                  }
                                  className="rounded shrink-0"
                                  style={{ accentColor: "#4f46e5" }}
                                />
                                <FileText
                                  className="w-3.5 h-3.5 shrink-0"
                                  style={{ color: checked ? "#6366f1" : "#9ca3af" }}
                                />
                                <span
                                  className="text-sm font-mono truncate"
                                  style={{ color: checked ? "#3730a3" : "#374151" }}
                                >
                                  {f}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setFilePickerSelected([])}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                清空选择
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilePicker(false)}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setFormDataFiles(filePickerSelected);
                    setShowFilePicker(false);
                  }}
                  className="px-4 py-2 text-sm text-white rounded-lg"
                  style={{ background: "#4f46e5", fontWeight: 500 }}
                >
                  确认选择（{filePickerSelected.length}）
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 指标选择弹窗 ── */}
      {metricPickerPipelineId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-[400px] max-h-[90vh] flex flex-col shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <span className="text-base text-gray-900" style={{ fontWeight: 600 }}>选择指标</span>
              <button onClick={() => setMetricPickerPipelineId(null)} title="关闭">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">搜索指标</label>
                <input
                  value={metricPickerSearch}
                  onChange={(e) => setMetricPickerSearch(e.target.value)}
                  placeholder="输入指标名称..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                />
              </div>
              <div className="space-y-2">
                {METRIC_OPTIONS.filter((m) =>
                  m.toLowerCase().includes(metricPickerSearch.toLowerCase())
                ).map((m) => (
                  <label key={m} className="flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 rounded text-xs text-gray-700 cursor-pointer hover:bg-indigo-50 transition-colors select-none">
                    <input
                      type="checkbox"
                      checked={metricPickerSelected.includes(m)}
                      onChange={() =>
                        setMetricPickerSelected((prev) =>
                          prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
                        )
                      }
                      className="rounded shrink-0"
                      style={{ accentColor: "#4f46e5" }}
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setMetricPickerPipelineId(null)}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={confirmMetricPicker}
                className="px-4 py-2 text-sm text-white rounded-lg"
                style={{ background: "#4f46e5", fontWeight: 500 }}
              >
                确认选择
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 辅助组件：Section 卡片 ──
function SectionCard({
  icon,
  title,
  required,
  action,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  required?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid #f3f4f6" }}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>
            {title}
          </span>
          {required && <span className="text-red-500 text-xs">*</span>}
        </div>
        {action}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}