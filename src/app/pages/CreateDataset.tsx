import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Upload, X } from "lucide-react";

type DatasetStatus = "已上传" | "创建中" | "创建失败";

export const USE_SCENARIO_OPTIONS = ["文本生成", "图片理解"] as const;
export type UseScenario = (typeof USE_SCENARIO_OPTIONS)[number];

export interface DatasetForCreate {
  id: string;
  name: string;
  desc: string;
  status: DatasetStatus;
  fileSize: string;
  fileCount: number;
  dataVolume: string;
  latestVersion: string;
  useScenarios: UseScenario[];
  tags: string[];
  createdAt: string;
}

export function CreateDataset() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", desc: "" });
  const [useScenario, setUseScenario] = useState<UseScenario | "">("");
  const [version, setVersion] = useState("V1");
  const [tagList, setTagList] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const totalSize = uploadedFiles.reduce((sum, f) => sum + f.size, 0);
    const formatSize = (b: number) =>
      b < 1024 * 1024
        ? `${(b / 1024).toFixed(1)} KB`
        : `${(b / 1024 / 1024).toFixed(1)} MB`;

    const newId = `ds${Date.now()}`;
    const newDs: DatasetForCreate = {
      id: newId,
      name: formData.name.trim(),
      desc: formData.desc.trim(),
      status: "创建中",
      fileSize: uploadedFiles.length > 0 ? formatSize(totalSize) : "0 KB",
      fileCount: uploadedFiles.length,
      dataVolume: "—",
      latestVersion: version.trim() || "V1",
      useScenarios: useScenario ? [useScenario] : [],
      tags: tagList,
      createdAt: new Date().toISOString().split("T")[0],
    };
    navigate("/datasets", { state: { newDataset: newDs } });
  };

  const inputBase =
    "w-full rounded-md px-3 py-2 outline-none transition-colors focus:ring-2 focus:ring-[#5E6AD2]/25 focus:border-[#5E6AD2]";
  const inputStyle = {
    fontSize: 14,
    border: "1px solid #E5E5EB",
    background: "#F7F8FA",
    color: "#111118",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F7F8FA" }}>
      {/* 头部：与数据集列表/详情页一致 */}
      <div
        className="shrink-0 flex items-center px-7"
        style={{
          height: 56,
          background: "#ffffff",
          borderBottom: "1px solid #E5E5EB",
        }}
      >
        <button
          onClick={() => navigate("/datasets")}
          className="p-1.5 rounded-md hover:bg-[#F0F0F5] transition-colors mr-1"
          style={{ color: "#6B6B80" }}
          aria-label="返回"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#111118",
            letterSpacing: "-0.02em",
          }}
        >
          创建数据集
        </h1>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-7 py-5 max-w-2xl mx-auto">
          <div
            className="bg-white rounded-lg p-6 overflow-hidden"
            style={{ border: "1px solid #E5E5EB" }}
          >
          {/* 基本信息 */}
          <section className="mb-6">
            <h2
              className="mb-4"
              style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}
            >
              基本信息
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  className="block mb-1.5"
                  style={{ fontSize: 12, color: "#8A8AA0" }}
                >
                  数据集名称 <span style={{ color: "#E5484D" }}>*</span>
                </label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="请输入数据集名称"
                  className={inputBase}
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  className="block mb-1.5"
                  style={{ fontSize: 12, color: "#8A8AA0" }}
                >
                  使用场景（选填）
                </label>
                <div className="flex flex-wrap gap-4">
                  {USE_SCENARIO_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className="inline-flex items-center gap-2 cursor-pointer select-none"
                    >
                      <input
                        type="radio"
                        name="useScenario"
                        checked={useScenario === opt}
                        onChange={() => setUseScenario(opt)}
                        className="border-[#DCDCE5] text-[#5E6AD2] focus:ring-2 focus:ring-[#5E6AD2]/25 w-4 h-4"
                      />
                      <span style={{ fontSize: 14, color: "#111118" }}>
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label
                  className="block mb-1.5"
                  style={{ fontSize: 12, color: "#8A8AA0" }}
                >
                  描述（选填）
                </label>
                <textarea
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                  placeholder="简要描述数据集用途与内容"
                  rows={3}
                  className={`${inputBase} resize-none rounded-md`}
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  className="block mb-1.5"
                  style={{ fontSize: 12, color: "#8A8AA0" }}
                >
                  标签（选填）
                </label>
                <div
                  className="min-h-[42px] w-full rounded-md px-3 py-2 flex flex-wrap gap-2 items-center cursor-text border transition-colors focus-within:ring-2 focus-within:ring-[#5E6AD2]/25 focus-within:border-[#5E6AD2]"
                  style={{
                    border: "1px solid #E5E5EB",
                    background: "#F7F8FA",
                  }}
                  onClick={(e) => {
                    const inp = (e.currentTarget as HTMLElement).querySelector(
                      "input"
                    );
                    inp?.focus();
                  }}
                >
                  {tagList.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md shrink-0"
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        background: "#EEEFFC",
                        color: "#5E6AD2",
                      }}
                    >
                      {t}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTagList((prev) => prev.filter((x) => x !== t));
                        }}
                        className="hover:text-red-500 transition-colors leading-none p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        const val = tagInput.trim().replace(/,$/, "");
                        if (val && !tagList.includes(val))
                          setTagList((prev) => [...prev, val]);
                        setTagInput("");
                      } else if (
                        e.key === "Backspace" &&
                        tagInput === "" &&
                        tagList.length > 0
                      ) {
                        setTagList((prev) => prev.slice(0, -1));
                      }
                    }}
                    onBlur={() => {
                      const val = tagInput.trim().replace(/,$/, "");
                      if (val && !tagList.includes(val))
                        setTagList((prev) => [...prev, val]);
                      setTagInput("");
                    }}
                    placeholder={
                      tagList.length === 0
                        ? "输入后按 Enter 或逗号添加"
                        : ""
                    }
                    className="flex-1 min-w-[120px] outline-none bg-transparent py-1"
                    style={{ fontSize: 14, color: "#111118" }}
                  />
                </div>
                <p
                  className="mt-1.5"
                  style={{ fontSize: 12, color: "#9090A8" }}
                >
                  按 Enter 或逗号添加，Backspace 删除最后一个
                </p>
              </div>
            </div>
          </section>

          {/* 数据文件 */}
          <section className="mb-6">
            <h2
              className="mb-4"
              style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}
            >
              数据文件
            </h2>
            <div className="mb-4">
              <label
                className="block mb-1.5"
                style={{ fontSize: 12, color: "#8A8AA0" }}
              >
                版本号
              </label>
              <input
                value={version}
                readOnly
                className="w-full rounded-md px-3 py-2 outline-none max-w-[160px] cursor-not-allowed"
                style={{
                  fontSize: 14,
                  border: "1px solid #E5E5EB",
                  background: "#F0F0F5",
                  color: "#6B6B80",
                }}
              />
              <p className="mt-1.5" style={{ fontSize: 12, color: "#9090A8" }}>
                当前版本标识，默认为 V1，不可修改
              </p>
            </div>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                dragging
                  ? "border-[#5E6AD2] bg-[#EEEFFC]"
                  : "border-[#E5E5EB] hover:border-[#5E6AD2]/50 hover:bg-[#FAFAFB]"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                if (e.dataTransfer.files.length)
                  setUploadedFiles(Array.from(e.dataTransfer.files));
              }}
              onClick={() => fileRef.current?.click()}
            >
              <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: "#A0A0B4" }} />
              <div style={{ fontSize: 13, color: "#6B6B80" }}>拖拽文件到此处，或点击选择</div>
              <div className="mt-1" style={{ fontSize: 12, color: "#9090A8" }}>支持 JSON、PDF 等格式，可多选</div>
            </div>
            <input
              type="file"
              ref={fileRef}
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files)
                  setUploadedFiles(Array.from(e.target.files));
              }}
            />
            {uploadedFiles.length > 0 && (
              <div className="mt-3 rounded-md p-3 space-y-2 border border-[#E5E5EB] bg-[#FAFAFB]">
                <div style={{ fontSize: 12, color: "#8A8AA0" }}>
                  已选 {uploadedFiles.length} 个文件
                </div>
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm truncate"
                    style={{ color: "#6B6B80" }}
                  >
                    <span className="truncate">{file.name}</span>
                    <span style={{ fontSize: 12, color: "#9090A8" }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
          </div>
        </div>
      </div>

      {/* 吸底按钮栏 */}
      <div
        className="shrink-0 flex justify-end gap-2 px-7 py-4"
        style={{ borderTop: "1px solid #E5E5EB", background: "#F7F8FA" }}
      >
        <div className="max-w-2xl w-full mx-auto flex justify-end gap-2">
          <button
            onClick={() => navigate("/datasets")}
            className="px-3 py-1.5 rounded-md hover:bg-[#EEEEF2] transition-colors"
            style={{ fontSize: 14, color: "#6B6B80", border: "1px solid #E5E5EB" }}
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name.trim()}
            className="px-3.5 py-2 rounded-md text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontSize: 14, background: "#5E6AD2" }}
          >
            创建
          </button>
        </div>
      </div>
    </div>
  );
}
