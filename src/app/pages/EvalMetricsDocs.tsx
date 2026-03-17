import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  BookOpen,
  Search,
  ExternalLink,
  Info,
  ChevronDown,
} from "lucide-react";

const METRICS = [
  { id: "m01", name: "RuleAudioDuration", type: "RULE", desc: "检测音频时长是否符合标准", requiredFields: ["content"] },
  { id: "m02", name: "RuleAudioSnrQuality", type: "RULE", desc: "检测音频信噪比是否满足质量要求", requiredFields: ["content"] },
  { id: "m03", name: "RuleAbnormalChar", type: "RULE", desc: "综合特殊字符与不可见字符检测，识别乱码及反爬取字符", requiredFields: ["content"] },
  { id: "m04", name: "RuleAbnormalHtml", type: "RULE", desc: "综合 HTML 实体与标签检测，识别异常 HTML 内容", requiredFields: ["content"] },
  { id: "m05", name: "RuleAbnormalNumber", type: "RULE", desc: "检测 PDF 内容中破坏文本流的异常页码或索引数字", requiredFields: ["content"] },
  { id: "m06", name: "RuleAlphaWords", type: "RULE", desc: "检测包含至少一个字母字符的单词比例是否高于阈值", requiredFields: ["content"] },
  { id: "m07", name: "RuleAudioDataFormat", type: "RULE", desc: "检测音频数据格式是否正确", requiredFields: ["content"] },
  { id: "m08", name: "RuleCapitalWords", type: "RULE", desc: "检测大写单词比例是否高于阈值（比例过高影响可读性）", requiredFields: ["content"] },
  { id: "m09", name: "RuleCharNumber", type: "RULE", desc: "检测字符数量是否达到最小阈值", requiredFields: ["content"] },
  { id: "m10", name: "RuleCharSplit", type: "RULE", desc: "检测 PDF 内容中异常字符拆分导致可读性下降的情况", requiredFields: ["content"] },
  { id: "m11", name: "RuleColonEndCount", type: "RULE", desc: "检测以冒号结尾的行比例是否超过阈值", requiredFields: ["content"] },
  { id: "m12", name: "RuleContentNull", type: "RULE", desc: "检测内容字段是否为空或 null", requiredFields: ["content"] },
  { id: "m13", name: "RuleDuplicateParagraph", type: "RULE", desc: "检测文档内重复段落", requiredFields: ["content"] },
  { id: "m14", name: "RuleEmojiCount", type: "RULE", desc: "检测 Emoji 字符比例是否超过阈值", requiredFields: ["content"] },
  { id: "m15", name: "RuleEnterCount", type: "RULE", desc: "检测换行符比例是否超过阈值", requiredFields: ["content"] },
  { id: "m16", name: "RuleHtmlEntity", type: "RULE", desc: "检测文本内容中的异常 HTML 实体字符", requiredFields: ["content"] },
  { id: "m17", name: "RuleImageCount", type: "RULE", desc: "检测文档中图片数量是否在预期范围内", requiredFields: ["content"] },
  { id: "m18", name: "RuleLineEndWithEllipsis", type: "RULE", desc: "检测以省略号结尾的行比例是否超过阈值", requiredFields: ["content"] },
  { id: "m19", name: "LlmTextQuality", type: "LLM", desc: "使用语言模型对文本内容的整体质量进行综合评估", requiredFields: ["content"] },
  { id: "m20", name: "LlmRelevance", type: "LLM", desc: "使用语言模型评估内容与参考文本的相关程度", requiredFields: ["content", "prompt"] },
];

const TYPE_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  RULE:  { label: "RULE",  bg: "#dbeafe", color: "#2563eb" },
  LLM:   { label: "LLM",   bg: "#ede9fe", color: "#7c3aed" },
  AGENT: { label: "AGENT", bg: "#dcfce7", color: "#16a34a" },
};

export function EvalMetricsDocs() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("全部");

  const filtered = METRICS.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.desc.includes(search);
    const matchType = typeFilter === "全部" || m.type === typeFilter;
    return matchSearch && matchType;
  });

  const ruleCount = METRICS.filter((m) => m.type === "RULE").length;
  const llmCount = METRICS.filter((m) => m.type === "LLM").length;
  const agentCount = METRICS.filter((m) => m.type === "AGENT").length;

  return (
    <div className="min-h-screen" style={{ background: "#F7F8FA" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-7"
        style={{ height: 56, background: "#ffffff", borderBottom: "1px solid #DCDCE5" }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/eval-tasks")}
            className="flex items-center gap-1.5 transition-colors hover:text-gray-800"
            style={{ fontSize: 14, color: "#6B6B80" }}
          >
            <ArrowLeft className="w-4 h-4" />
            返回评估任务
          </button>
          <span style={{ color: "#DCDCE5" }}>/</span>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: "#5E6AD2" }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: "#111118", letterSpacing: "-0.02em" }}>评估指标文档</span>
          </div>
        </div>
      </div>

      <div className="px-7 py-6">
        {/* Dingo SDK hint */}
        <div className="rounded-lg px-5 py-4 mb-6" style={{ background: "#eef2ff", border: "1px solid #c7d2fe" }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Info className="w-4 h-4" style={{ color: "#5E6AD2" }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: "#111118" }}>关于评估指标</span>
          </div>
          <p style={{ fontSize: 14, color: "#4338ca", lineHeight: 1.6 }}>
            所有指标均基于开源{" "}
            <a href="#" className="inline-flex items-center gap-0.5 underline" style={{ color: "#4f46e5" }}>
              Dingo SDK
              <ExternalLink className="w-3 h-3" />
            </a>
            {" "}评估引擎，支持规则型（RULE）、大模型型（LLM）和智能体型（AGENT）三种评估方式。
            在创建评估任务时，可从下方指标列表中选择需要的指标组合。
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "全部指标", count: METRICS.length, color: "#5E6AD2", bg: "#EEEFFC" },
            { label: "RULE 规则型", count: ruleCount, color: "#2563eb", bg: "#dbeafe" },
            { label: "LLM 大模型型", count: llmCount, color: "#7c3aed", bg: "#ede9fe" },
            { label: "AGENT 智能体型", count: agentCount, color: "#16a34a", bg: "#dcfce7" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg px-5 py-4" style={{ border: "1px solid #E5E5EB" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.count}</div>
              <div style={{ fontSize: 13, color: "#6B6B80", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search & filter */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 border rounded-md bg-white outline-none"
              style={{ color: "#111118", fontSize: 14, borderColor: "#DCDCE5" }}
            >
              <option value="全部">全部类型</option>
              <option value="RULE">RULE</option>
              <option value="LLM">LLM</option>
              <option value="AGENT">AGENT</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#9090A8" }} />
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9090A8" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索指标名称或描述..."
              className="w-full pl-9 pr-4 py-2 border rounded-md bg-white outline-none"
              style={{ fontSize: 14, color: "#111118", borderColor: "#DCDCE5" }}
            />
          </div>
          <div style={{ fontSize: 13, color: "#6B6B80" }}>
            共 <span style={{ fontWeight: 600, color: "#5E6AD2" }}>{filtered.length}</span> 个指标
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((m) => {
            const badge = TYPE_BADGE[m.type];
            return (
              <div
                key={m.id}
                className="bg-white rounded-lg p-5 transition-colors"
                style={{ border: "1px solid #E5E5EB" }}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#111118" }}>{m.name}</span>
                  <span
                    className="px-2 py-0.5 rounded"
                    style={{ background: badge.bg, color: badge.color, fontWeight: 600, fontSize: 11 }}
                  >
                    {badge.label}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "#6B6B80", marginBottom: 14, lineHeight: 1.6 }}>{m.desc}</p>
                <div className="flex items-center gap-2">
                  <span style={{ color: "#f59e0b", fontWeight: 500, fontSize: 13 }}>必填字段：</span>
                  {m.requiredFields.map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-0.5 rounded"
                      style={{ fontSize: 12, color: "#4A4A62", background: "#F3F4F6" }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-lg p-16 text-center" style={{ border: "1px solid #E5E5EB" }}>
            <BookOpen className="w-10 h-10 mx-auto mb-4" style={{ color: "#D0D0DC" }} />
            <div style={{ fontSize: 14, color: "#6B6B80" }}>没有找到匹配的指标</div>
          </div>
        )}
      </div>
    </div>
  );
}
