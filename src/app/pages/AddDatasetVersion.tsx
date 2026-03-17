import { useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

function getNextVersionName(state: unknown): string {
  const next = (state as { nextVersionName?: string } | null)?.nextVersionName;
  if (next) return next;
  return "V3";
}

export function AddDatasetVersion() {
  const { id = "" } = useParams();
  const location = useLocation();
  const nextVersionName = getNextVersionName(location.state);

  const [versionDesc, setVersionDesc] = useState("");
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (files.length === 0) {
      toast.error("请至少上传一个文件");
      return;
    }
    toast.success(`版本 ${nextVersionName} 创建成功`);
    // 可在此接入实际提交逻辑，再跳转回详情
    window.history.back();
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
      <header className="shrink-0 bg-white" style={{ borderBottom: "1px solid #E5E5EB" }}>
        <div className="px-7 py-4 flex items-center gap-3">
          <Link
            to={`/datasets/${id}`}
            className="p-1.5 rounded-md hover:bg-[#F0F0F5] transition-colors shrink-0"
            style={{ color: "#6B6B80" }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A2E", letterSpacing: "-0.02em" }}>
            新增版本
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="px-7 py-5 max-w-2xl mx-auto">
          <div
            className="bg-white rounded-lg p-6 overflow-hidden"
            style={{ border: "1px solid #E5E5EB" }}
          >
          {/* 版本号 */}
          <section className="mb-6">
            <label
              className="block mb-1.5"
              style={{ fontSize: 12, color: "#8A8AA0" }}
            >
              版本号
            </label>
            <input
              value={nextVersionName}
              readOnly
              className="w-full rounded-md px-3 py-2 outline-none max-w-[120px] cursor-not-allowed"
              style={{
                fontSize: 14,
                border: "1px solid #E5E5EB",
                background: "#F0F0F5",
                color: "#6B6B80",
              }}
            />
            <p className="mt-1.5" style={{ fontSize: 12, color: "#9090A8" }}>
              在当前最大版本号基础上 +1，不可修改
            </p>
          </section>

          {/* 版本描述 */}
          <section className="mb-6">
            <label
              className="block mb-1.5"
              style={{ fontSize: 12, color: "#8A8AA0" }}
            >
              版本描述（选填）
            </label>
            <textarea
              value={versionDesc}
              onChange={(e) => setVersionDesc(e.target.value)}
              placeholder="简要描述本版本变更内容"
              rows={4}
              className={`${inputBase} resize-none`}
              style={inputStyle}
            />
          </section>

          {/* 文件上传 */}
          <section className="mb-6">
            <label
              className="block mb-1.5"
              style={{ fontSize: 12, color: "#8A8AA0" }}
            >
              文件上传 <span style={{ color: "#E5484D" }}>*</span>
            </label>
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
                  setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
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
                  setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
              }}
            />
            {files.length > 0 && (
              <div className="mt-3 rounded-md p-3 space-y-2 border border-[#E5E5EB] bg-[#FAFAFB]">
                <div style={{ fontSize: 12, color: "#8A8AA0" }}>
                  已选 {files.length} 个文件
                </div>
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between text-sm truncate"
                    style={{ color: "#6B6B80" }}
                  >
                    <span className="truncate">{file.name}</span>
                    <span style={{ fontSize: 12, color: "#9090A8" }}>
                      {file.size < 1024 ? `${file.size} B` : `${(file.size / 1024).toFixed(1)} KB`}
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
          <Link
            to={`/datasets/${id}`}
            className="px-3 py-1.5 rounded-md hover:bg-[#EEEEF2] transition-colors inline-block"
            style={{ fontSize: 14, color: "#6B6B80", border: "1px solid #E5E5EB" }}
          >
            取消
          </Link>
          <button
            onClick={handleSubmit}
            disabled={files.length === 0}
            className="px-3.5 py-2 rounded-md text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontSize: 14, background: "#5E6AD2" }}
          >
            创建版本
          </button>
        </div>
      </div>
    </div>
  );
}
