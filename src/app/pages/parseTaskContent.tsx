import React from "react";

export interface DocBlock {
  id: string;
  page: number;
  type: string;
  typeColor: string;
  typeBg: string;
  borderColor: string;
  content: React.ReactNode;
}

export interface MdBlock {
  id: string;
  type: string;
  typeColor: string;
  typeBg: string;
  borderColor: string;
  content: React.ReactNode;
}

export interface OutlineItem {
  page: number;
  type: string;
  label: string;
  color: string;
  bg: string;
}

export interface FileContent {
  totalPages: number;
  markdown: string;
  json: string;
  outlineItems: OutlineItem[];
  docBlocks: DocBlock[];
  mdBlocks: MdBlock[];
}

/* ================================================================
   t001 — 采购合同_2024Q4.pdf
   ================================================================ */
const t001: FileContent = {
  totalPages: 3,
  markdown: `# 采购合同_2024Q4

## 第一条 合同基本信息

| 字段 | 内容 |
|------|------|
| 合同编号 | HT-2024-Q4-0001 |
| 签订日期 | 2024年10月15日 |
| 甲方 | 厦门供应链科技有限公司 |
| 乙方 | 上海原材料贸易有限公司 |

## 第二条 采购内容

本合同采购内容如下：

1. **电子元器件 A型号**：数量 10,000 件，单价 ¥12.50，合计 ¥125,000
2. **电子元器件 B型号**：数量 5,000 件，单价 ¥28.00，合计 ¥140,000
3. **精密零部件 C系列**：数量 2,000 套，单价 ¥86.00，合计 ¥172,000

**采购总金额：¥437,000（大写：肆拾叁万柒仟元整）**

## 第三条 交货条款

- 交货地点：厦门市同安区工业园区仓储中心
- 交货期限：合同签订后 45 个工作日内完成全部交货
- 分批交货：第一批次（50%）于签订后 20 个工作日内到货

## 第四条 质量标准

所供货物须符合以下标准：
- 国家标准 GB/T 14048.1-2023
- 企业内部质检标准 QS-2024-V3

## 第五条 付款方式

- 预付款：合同总额的 30%，签订后 3 个工作日内支付
- 货到验收后 7 个工作日内支付剩余 70%
`,
  json: `{
  "document_title": "采购合同_2024Q4",
  "document_type": "contract",
  "metadata": {
    "contract_number": "HT-2024-Q4-0001",
    "sign_date": "2024-10-15",
    "party_a": "厦门供应链科技有限公司",
    "party_b": "上海原材料贸易有限公司"
  },
  "procurement_items": [
    { "name": "电子元器件 A型号", "quantity": 10000, "unit_price": 12.50, "total": 125000 },
    { "name": "电子元器件 B型号", "quantity": 5000, "unit_price": 28.00, "total": 140000 },
    { "name": "精密零部件 C系列", "quantity": 2000, "unit_price": 86.00, "total": 172000 }
  ],
  "total_amount": 437000,
  "delivery": { "location": "厦门市同安区工业园区仓储中心", "deadline_days": 45 },
  "payment": { "prepayment_ratio": 0.30, "balance_days": 7 }
}`,
  outlineItems: [
    { page: 1, type: "标题", label: "采购合同", color: "#3b82f6", bg: "#eff6ff" },
    { page: 1, type: "表格", label: "合同基本信息表", color: "#10b981", bg: "#f0fdf4" },
    { page: 2, type: "文本", label: "第二条 采购内容", color: "#f59e0b", bg: "#fffbeb" },
    { page: 2, type: "列表", label: "商品清单", color: "#8b5cf6", bg: "#f5f3ff" },
    { page: 3, type: "文本", label: "第四条 质量标准", color: "#f59e0b", bg: "#fffbeb" },
    { page: 3, type: "列表", label: "标准编号列表", color: "#8b5cf6", bg: "#f5f3ff" },
  ],
  docBlocks: [
    {
      id: "b1", page: 1, type: "标题", typeColor: "#3b82f6", typeBg: "#eff6ff", borderColor: "#3b82f6",
      content: (<div className="text-center"><div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 2 }}>采购合同</div><div style={{ fontSize: 11, color: "#888" }}>合同编号：HT-2024-Q4-0001</div></div>),
    },
    {
      id: "b2", page: 1, type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b",
      content: (<div style={{ fontSize: 11, color: "#555", lineHeight: 1.7 }}><span style={{ fontWeight: 600 }}>甲方：</span>厦门供应链科技有限公司&nbsp;&nbsp;<span style={{ fontWeight: 600 }}>乙方：</span>上海原材料贸易有限公司&nbsp;&nbsp;<span style={{ fontWeight: 600 }}>签订日期：</span>2024年10月15日</div>),
    },
    {
      id: "b3", page: 1, type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981",
      content: (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead><tr style={{ background: "#f9fafb" }}>{["字段", "内容"].map((h) => (<th key={h} style={{ border: "1px solid #e5e7eb", padding: "4px 8px", textAlign: "left", color: "#374151", fontWeight: 600 }}>{h}</th>))}</tr></thead>
          <tbody>{[["合同编号", "HT-2024-Q4-0001"], ["签订日期", "2024年10月15日"], ["甲方", "厦门供应链科技有限公司"], ["乙方", "上海原材料贸易有限公司"]].map(([k, v]) => (<tr key={k}><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280", background: "#f9fafb" }}>{k}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827" }}>{v}</td></tr>))}</tbody>
        </table>
      ),
    },
    {
      id: "b4", page: 2, type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b",
      content: (<div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}><div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>第二条 采购内容</div>本合同采购内容如下，所有货物须按约定规格、数量及交货期限完成供货。采购总金额为<strong>¥437,000</strong>（大写：肆拾叁万柒仟元整）。</div>),
    },
    {
      id: "b5", page: 2, type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6",
      content: (
        <div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}>
          {[["电子元器件 A型号", "10,000 件", "¥12.50", "¥125,000"], ["电子元器件 B型号", "5,000 件", "¥28.00", "¥140,000"], ["精密零部件 C系列", "2,000 套", "¥86.00", "¥172,000"]].map(([name, qty, price, total], i) => (
            <div key={i} style={{ marginBottom: 3 }}><span style={{ color: "#8b5cf6", marginRight: 4 }}>{i + 1}.</span><strong>{name}</strong>：数量 {qty}，单价 {price}，合计 {total}</div>
          ))}
        </div>
      ),
    },
    {
      id: "b6", page: 3, type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b",
      content: (<div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}><div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>第四条 质量标准</div>所供货物须符合国家及企业相关质量标准，交货前须经乙方自检，甲方有权在收货后 5 个工作日内进行质量验收复核。</div>),
    },
    {
      id: "b7", page: 3, type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6",
      content: (<div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}><div>• 国家标准 GB/T 14048.1-2023</div><div>• 企业内部质检标准 QS-2024-V3</div><div>• ISO 9001:2015 质量管理体系</div></div>),
    },
    {
      id: "b8", page: 3, type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b",
      content: (<div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}><div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>第五条 付款方式</div><div>• 预付款：合同总额的 30%，签订后 3 个工作日内支付</div><div>• 货到验收后 7 个工作日内支付剩余 70%</div></div>),
    },
  ],
  mdBlocks: [
    { id: "md1", type: "标题", typeColor: "#3b82f6", typeBg: "#eff6ff", borderColor: "#3b82f6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`# 采购合同_2024Q4`}</pre>) },
    { id: "md2", type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 第一条 合同基本信息\n\n| 字段 | 内容 |\n|------|------|\n| 合同编号 | HT-2024-Q4-0001 |\n| 签订日期 | 2024年10月15日 |\n| 甲方 | 厦门供应链科技有限公司 |\n| 乙方 | 上海原材料贸易有限公司 |`}</pre>) },
    { id: "md3", type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 第二条 采购内容\n\n本合同采购内容如下：`}</pre>) },
    { id: "md4", type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`1. **电子元器件 A型号**：数量 10,000 件，单价 ¥12.50，合计 ¥125,000\n2. **电子元器件 B型号**：数量 5,000 件，单价 ¥28.00，合计 ¥140,000\n3. **精密零部件 C系列**：数量 2,000 套，单价 ¥86.00，合计 ¥172,000\n\n**采购总金额：¥437,000（大写：肆拾叁万柒仟元整）**`}</pre>) },
    { id: "md5", type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 第三条 交货条款`}</pre>) },
    { id: "md6", type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`- 交货地点：厦门市同安区工业园区仓储中心\n- 交货期限：合同签订后 45 个工作日内完成全部交货\n- 分批交货：第一批次（50%）于签订后 20 个工作日内到货`}</pre>) },
    { id: "md7", type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 第四条 质量标准\n\n所供货物须符合以下标准：`}</pre>) },
    { id: "md8", type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`- 国家标准 GB/T 14048.1-2023\n- 企业内部质检标准 QS-2024-V3`}</pre>) },
    { id: "md9", type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 第五条 付款方式`}</pre>) },
    { id: "md10", type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`- 预付款：合同总额的 30%，签订后 3 个工作日内支付\n- 货到验收后 7 个工作日内支付剩余 70%`}</pre>) },
  ],
};

/* ================================================================
   t002 — 供应商评审报告_20240301.docx
   ================================================================ */
const t002: FileContent = {
  totalPages: 2,
  markdown: `# 供应商评审报告

## 一、评审概况

| 字段 | 内容 |
|------|------|
| 评审编号 | SP-2024-0301 |
| 评审日期 | 2024年3月1日 |
| 评审对象 | 深圳恒通精密制造有限公司 |
| 评审组长 | 王志远 |

## 二、评审维度评分

| 维度 | 权重 | 得分 | 加权得分 |
|------|------|------|----------|
| 质量管理体系 | 30% | 88 | 26.4 |
| 交货准时率 | 25% | 92 | 23.0 |
| 价格竞争力 | 20% | 78 | 15.6 |
| 技术研发能力 | 15% | 85 | 12.75 |
| 售后服务 | 10% | 90 | 9.0 |

**综合得分：86.75 / 100（等级：A级供应商）**

## 三、评审结论

该供应商质量管理体系完善，交货准时率高于行业平均水平。建议继续保持合作关系，列入优选供应商名录。

## 四、改进建议

- 价格方面建议进一步协商年度框架协议
- 建议增加季度质量回顾会议频次
- 鼓励供应商投入新材料研发
`,
  json: `{
  "document_title": "供应商评审报告",
  "document_type": "supplier_review",
  "metadata": {
    "review_id": "SP-2024-0301",
    "review_date": "2024-03-01",
    "supplier": "深圳恒通精密制造有限公司",
    "reviewer": "王志远"
  },
  "scores": [
    { "dimension": "质量管理体系", "weight": 0.30, "score": 88, "weighted": 26.4 },
    { "dimension": "交货准时率", "weight": 0.25, "score": 92, "weighted": 23.0 },
    { "dimension": "价格竞争力", "weight": 0.20, "score": 78, "weighted": 15.6 },
    { "dimension": "技术研发能力", "weight": 0.15, "score": 85, "weighted": 12.75 },
    { "dimension": "售后服务", "weight": 0.10, "score": 90, "weighted": 9.0 }
  ],
  "total_score": 86.75,
  "grade": "A",
  "conclusion": "建议继续保持合作关系，列入优选供应商名录"
}`,
  outlineItems: [
    { page: 1, type: "标题", label: "供应商评审报告", color: "#3b82f6", bg: "#eff6ff" },
    { page: 1, type: "表格", label: "评审概况", color: "#10b981", bg: "#f0fdf4" },
    { page: 1, type: "表格", label: "评审维度评分", color: "#10b981", bg: "#f0fdf4" },
    { page: 2, type: "文本", label: "评审结论", color: "#f59e0b", bg: "#fffbeb" },
    { page: 2, type: "列表", label: "改进建议", color: "#8b5cf6", bg: "#f5f3ff" },
  ],
  docBlocks: [
    {
      id: "b1", page: 1, type: "标题", typeColor: "#3b82f6", typeBg: "#eff6ff", borderColor: "#3b82f6",
      content: (<div className="text-center"><div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 2 }}>供应商评审报告</div><div style={{ fontSize: 11, color: "#888" }}>评审编号：SP-2024-0301</div></div>),
    },
    {
      id: "b2", page: 1, type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981",
      content: (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead><tr style={{ background: "#f9fafb" }}>{["字段", "内容"].map((h) => (<th key={h} style={{ border: "1px solid #e5e7eb", padding: "4px 8px", textAlign: "left", color: "#374151", fontWeight: 600 }}>{h}</th>))}</tr></thead>
          <tbody>{[["评审编号", "SP-2024-0301"], ["评审日期", "2024年3月1日"], ["评审对象", "深圳恒通精密制造有限公司"], ["评审组长", "王志远"]].map(([k, v]) => (<tr key={k}><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280", background: "#f9fafb" }}>{k}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827" }}>{v}</td></tr>))}</tbody>
        </table>
      ),
    },
    {
      id: "b3", page: 1, type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981",
      content: (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead><tr style={{ background: "#f9fafb" }}>{["维度", "权重", "得分", "加权得分"].map((h) => (<th key={h} style={{ border: "1px solid #e5e7eb", padding: "4px 8px", textAlign: "left", color: "#374151", fontWeight: 600 }}>{h}</th>))}</tr></thead>
          <tbody>{[["质量管理体系", "30%", "88", "26.4"], ["交货准时率", "25%", "92", "23.0"], ["价格竞争力", "20%", "78", "15.6"], ["技术研发能力", "15%", "85", "12.75"], ["售后服务", "10%", "90", "9.0"]].map(([a, b, c, d]) => (<tr key={a}><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827" }}>{a}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280" }}>{b}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827" }}>{c}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827", fontWeight: 600 }}>{d}</td></tr>))}</tbody>
        </table>
      ),
    },
    {
      id: "b4", page: 2, type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b",
      content: (<div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}><div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>三、评审结论</div>该供应商质量管理体系完善，交货准时率高于行业平均水平。综合得分 <strong>86.75</strong>，等级 <strong>A级</strong>。建议继续保持合作关系，列入优选供应商名录。</div>),
    },
    {
      id: "b5", page: 2, type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6",
      content: (<div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}><div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>四、改进建议</div><div>• 价格方面建议进一步协商年度框架协议</div><div>• 建议增加季度质量回顾会议频次</div><div>• 鼓励供应商投入新材料研发</div></div>),
    },
  ],
  mdBlocks: [
    { id: "md1", type: "标题", typeColor: "#3b82f6", typeBg: "#eff6ff", borderColor: "#3b82f6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`# 供应商评审报告`}</pre>) },
    { id: "md2", type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 一、评审概况\n\n| 字段 | 内容 |\n|------|------|\n| 评审编号 | SP-2024-0301 |\n| 评审日期 | 2024年3月1日 |\n| 评审对象 | 深圳恒通精密制造有限公司 |\n| 评审组长 | 王志远 |`}</pre>) },
    { id: "md3", type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 二、评审维度评分\n\n| 维度 | 权重 | 得分 | 加权得分 |\n|------|------|------|----------|\n| 质量管理体系 | 30% | 88 | 26.4 |\n| 交货准时率 | 25% | 92 | 23.0 |\n| 价格竞争力 | 20% | 78 | 15.6 |\n| 技术研发能力 | 15% | 85 | 12.75 |\n| 售后服务 | 10% | 90 | 9.0 |\n\n**综合得分：86.75 / 100（等级：A级供应商）**`}</pre>) },
    { id: "md4", type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 三、评审结论\n\n该供应商质量管理体系完善，交货准时率高于行业平均水平。建议继续保持合作关系，列入优选供应商名录。`}</pre>) },
    { id: "md5", type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 四、改进建议\n\n- 价格方面建议进一步协商年度框架协议\n- 建议增加季度质量回顾会议频次\n- 鼓励供应商投入新材料研发`}</pre>) },
  ],
};

/* ================================================================
   t005 — 产品图册_高清版.pptx
   ================================================================ */
const t005: FileContent = {
  totalPages: 3,
  markdown: `# 产品图册 2024版

## 封面信息

- 标题：厦门供应链科技 · 产品图册
- 版本：2024年秋季版
- 编制部门：市场营销中心

## 产品系列一：工业传感器

### TS-200 温度传感器
- 测量范围：-40°C ~ 350°C
- 精度等级：±0.1°C
- 防护等级：IP68
- 响应时间：< 200ms

### PS-500 压力传感器
- 量程：0 ~ 60MPa
- 输出信号：4-20mA / RS485
- 材质：316L 不锈钢

## 产品系列二：智能控制模块

### CM-100 集中控制器
- 支持协议：Modbus / OPC UA / MQTT
- 最大节点数：256
- 看门狗定时器：内置硬件看门狗

## 技术参数总表

| 型号 | 类别 | 供电 | 通信 |
|------|------|------|------|
| TS-200 | 温度传感器 | 24V DC | RS485 |
| PS-500 | 压力传感器 | 24V DC | 4-20mA |
| CM-100 | 控制模块 | 220V AC | Ethernet |
`,
  json: `{
  "document_title": "产品图册 2024版",
  "document_type": "product_catalog",
  "metadata": {
    "version": "2024秋季版",
    "department": "市场营销中心"
  },
  "products": [
    {
      "model": "TS-200",
      "category": "温度传感器",
      "specs": { "range": "-40~350°C", "accuracy": "±0.1°C", "protection": "IP68" }
    },
    {
      "model": "PS-500",
      "category": "压力传感器",
      "specs": { "range": "0~60MPa", "output": "4-20mA/RS485", "material": "316L" }
    },
    {
      "model": "CM-100",
      "category": "集中控制器",
      "specs": { "protocols": ["Modbus","OPC UA","MQTT"], "max_nodes": 256 }
    }
  ]
}`,
  outlineItems: [
    { page: 1, type: "标题", label: "产品图册封面", color: "#3b82f6", bg: "#eff6ff" },
    { page: 1, type: "图片", label: "公司 Logo", color: "#ec4899", bg: "#fdf2f8" },
    { page: 2, type: "文本", label: "工业传感器系列", color: "#f59e0b", bg: "#fffbeb" },
    { page: 2, type: "列表", label: "产品规格参数", color: "#8b5cf6", bg: "#f5f3ff" },
    { page: 3, type: "表格", label: "技术参数总表", color: "#10b981", bg: "#f0fdf4" },
  ],
  docBlocks: [
    {
      id: "b1", page: 1, type: "标题", typeColor: "#3b82f6", typeBg: "#eff6ff", borderColor: "#3b82f6",
      content: (<div className="text-center"><div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 4 }}>厦门供应链科技 · 产品图册</div><div style={{ fontSize: 11, color: "#888" }}>2024年秋季版 · 市场营销中心编制</div></div>),
    },
    {
      id: "b2", page: 1, type: "图片", typeColor: "#ec4899", typeBg: "#fdf2f8", borderColor: "#ec4899",
      content: (<div style={{ background: "#f8f9fa", borderRadius: 8, padding: "24px 0", textAlign: "center", color: "#aaa", fontSize: 11 }}>[ 公司 Logo & 产品组合照片 ]</div>),
    },
    {
      id: "b3", page: 2, type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b",
      content: (<div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}><div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>产品系列一：工业传感器</div><div style={{ fontWeight: 600, marginBottom: 2 }}>TS-200 温度传感器</div>测量范围：-40°C ~ 350°C，精度 ±0.1°C，防护 IP68<div style={{ fontWeight: 600, marginTop: 8, marginBottom: 2 }}>PS-500 压力传感器</div>量程：0 ~ 60MPa，输出 4-20mA / RS485，316L 不锈钢</div>),
    },
    {
      id: "b4", page: 2, type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6",
      content: (<div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}><div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>产品系列二：智能控制模块</div><div>• CM-100 集中控制器：Modbus / OPC UA / MQTT</div><div>• 最大节点数 256，内置硬件看门狗</div></div>),
    },
    {
      id: "b5", page: 3, type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981",
      content: (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead><tr style={{ background: "#f9fafb" }}>{["型号", "类别", "供电", "通信"].map((h) => (<th key={h} style={{ border: "1px solid #e5e7eb", padding: "4px 8px", textAlign: "left", color: "#374151", fontWeight: 600 }}>{h}</th>))}</tr></thead>
          <tbody>{[["TS-200", "温度传感器", "24V DC", "RS485"], ["PS-500", "压力传感器", "24V DC", "4-20mA"], ["CM-100", "控制模块", "220V AC", "Ethernet"]].map(([a, b, c, d]) => (<tr key={a}><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827", fontWeight: 500 }}>{a}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280" }}>{b}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280" }}>{c}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280" }}>{d}</td></tr>))}</tbody>
        </table>
      ),
    },
  ],
  mdBlocks: [
    { id: "md1", type: "标题", typeColor: "#3b82f6", typeBg: "#eff6ff", borderColor: "#3b82f6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`# 产品图册 2024版`}</pre>) },
    { id: "md2", type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 封面信息\n\n- 标题：厦门供应链科技 · 产品图册\n- 版本：2024年秋季版\n- 编制部门：市场营销中心`}</pre>) },
    { id: "md3", type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 产品系列一：工业传感器\n\n### TS-200 温度传感器\n- 测量范围：-40°C ~ 350°C\n- 精度等级：±0.1°C\n- 防护等级：IP68\n\n### PS-500 压力传感器\n- 量程：0 ~ 60MPa\n- 输出信号：4-20mA / RS485`}</pre>) },
    { id: "md4", type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 产品系列二：智能控制模块\n\n### CM-100 集中控制器\n- 支持协议：Modbus / OPC UA / MQTT\n- 最大节点数：256`}</pre>) },
    { id: "md5", type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 技术参数总表\n\n| 型号 | 类别 | 供电 | 通信 |\n|------|------|------|------|\n| TS-200 | 温度传感器 | 24V DC | RS485 |\n| PS-500 | 压力传感器 | 24V DC | 4-20mA |\n| CM-100 | 控制模块 | 220V AC | Ethernet |`}</pre>) },
  ],
};

/* ================================================================
   t006 — 质检报告_扫描件.png
   ================================================================ */
const t006: FileContent = {
  totalPages: 1,
  markdown: `# 质量检验报告

## 报告信息

| 字段 | 内容 |
|------|------|
| 报告编号 | QC-2024-1128 |
| 检验日期 | 2024年11月28日 |
| 产品名称 | 电子元器件 A型号（批次 LOT-20241115） |
| 送检单位 | 上海原材料贸易有限公司 |
| 检验员 | 张明华 |

## 检验结果

| 检验项目 | 标准值 | 实测值 | 判定 |
|----------|--------|--------|------|
| 外观检查 | 无裂纹、划痕 | 合格 | ✓ |
| 尺寸公差 | ±0.05mm | 0.03mm | ✓ |
| 绝缘电阻 | ≥100MΩ | 320MΩ | ✓ |
| 耐压测试 | 1500V/1min | 通过 | ✓ |

**检验结论：合格（全部项目通过）**
`,
  json: `{
  "document_title": "质量检验报告",
  "document_type": "quality_report",
  "metadata": {
    "report_id": "QC-2024-1128",
    "date": "2024-11-28",
    "product": "电子元器件 A型号",
    "batch": "LOT-20241115",
    "inspector": "张明华"
  },
  "results": [
    { "item": "外观检查", "standard": "无裂纹、划痕", "actual": "合格", "pass": true },
    { "item": "尺寸公差", "standard": "±0.05mm", "actual": "0.03mm", "pass": true },
    { "item": "绝缘电阻", "standard": "≥100MΩ", "actual": "320MΩ", "pass": true },
    { "item": "耐压测试", "standard": "1500V/1min", "actual": "通过", "pass": true }
  ],
  "conclusion": "合格"
}`,
  outlineItems: [
    { page: 1, type: "标题", label: "质量检验报告", color: "#3b82f6", bg: "#eff6ff" },
    { page: 1, type: "表格", label: "报告基本信息", color: "#10b981", bg: "#f0fdf4" },
    { page: 1, type: "表格", label: "检验结果", color: "#10b981", bg: "#f0fdf4" },
  ],
  docBlocks: [
    {
      id: "b1", page: 1, type: "标题", typeColor: "#3b82f6", typeBg: "#eff6ff", borderColor: "#3b82f6",
      content: (<div className="text-center"><div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 2 }}>质量检验报告</div><div style={{ fontSize: 11, color: "#888" }}>报告编号：QC-2024-1128</div></div>),
    },
    {
      id: "b2", page: 1, type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981",
      content: (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead><tr style={{ background: "#f9fafb" }}>{["字段", "内容"].map((h) => (<th key={h} style={{ border: "1px solid #e5e7eb", padding: "4px 8px", textAlign: "left", color: "#374151", fontWeight: 600 }}>{h}</th>))}</tr></thead>
          <tbody>{[["报告编号", "QC-2024-1128"], ["检验日期", "2024年11月28日"], ["产品名称", "电子元器件 A型号"], ["送检单位", "上海原材料贸易有限公司"], ["检验员", "张明华"]].map(([k, v]) => (<tr key={k}><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280", background: "#f9fafb" }}>{k}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827" }}>{v}</td></tr>))}</tbody>
        </table>
      ),
    },
    {
      id: "b3", page: 1, type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981",
      content: (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead><tr style={{ background: "#f9fafb" }}>{["检验项目", "标准值", "实测值", "判定"].map((h) => (<th key={h} style={{ border: "1px solid #e5e7eb", padding: "4px 8px", textAlign: "left", color: "#374151", fontWeight: 600 }}>{h}</th>))}</tr></thead>
          <tbody>{[["外观检查", "无裂纹、划痕", "合格", "✓"], ["尺寸公差", "±0.05mm", "0.03mm", "✓"], ["绝缘电阻", "≥100MΩ", "320MΩ", "✓"], ["耐压测试", "1500V/1min", "通过", "✓"]].map(([a, b, c, d]) => (<tr key={a}><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827" }}>{a}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280" }}>{b}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827" }}>{c}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#10b981", fontWeight: 600 }}>{d}</td></tr>))}</tbody>
        </table>
      ),
    },
  ],
  mdBlocks: [
    { id: "md1", type: "标题", typeColor: "#3b82f6", typeBg: "#eff6ff", borderColor: "#3b82f6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`# 质量检验报告`}</pre>) },
    { id: "md2", type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 报告信息\n\n| 字段 | 内容 |\n|------|------|\n| 报告编号 | QC-2024-1128 |\n| 检验日期 | 2024年11月28日 |\n| 产品名称 | 电子元器件 A型号 |\n| 送检单位 | 上海原材料贸易有限公司 |\n| 检验员 | 张明华 |`}</pre>) },
    { id: "md3", type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 检验结果\n\n| 检验项目 | 标准值 | 实测值 | 判定 |\n|----------|--------|--------|------|\n| 外观检查 | 无裂纹、划痕 | 合格 | ✓ |\n| 尺寸公差 | ±0.05mm | 0.03mm | ✓ |\n| 绝缘电阻 | ≥100MΩ | 320MΩ | ✓ |\n| 耐压测试 | 1500V/1min | 通过 | ✓ |\n\n**检验结论：合格（全部项目通过）**`}</pre>) },
  ],
};

/* ================================================================
   t009 — 物流报告_批次007.docx
   ================================================================ */
const t009: FileContent = {
  totalPages: 2,
  markdown: `# 物流运输报告 — 批次007

## 运输概况

| 字段 | 内容 |
|------|------|
| 批次编号 | SHIP-2024-007 |
| 发货日期 | 2024年12月20日 |
| 始发地 | 上海市嘉定区物流园 |
| 目的地 | 厦门市同安区工业园区 |
| 承运方 | 顺丰速运 |
| 运输方式 | 公路 + 冷链 |

## 货物清单

1. **电子元器件 A型号** × 5,000 件（2 托盘）
2. **精密零部件 C系列** × 1,000 套（1 托盘）
3. **包装缓冲材料** × 200 kg

## 运输时效

- 发车时间：2024-12-20 08:00
- 到达时间：2024-12-21 16:30
- 总运输时长：32.5 小时
- 温度记录：全程 18°C ~ 22°C（达标）

## 签收确认

签收人：李建国（仓储主管）
签收日期：2024年12月21日
备注：货物完好，无损坏。
`,
  json: `{
  "document_title": "物流运输报告_批次007",
  "document_type": "logistics_report",
  "metadata": {
    "batch_id": "SHIP-2024-007",
    "ship_date": "2024-12-20",
    "origin": "上海市嘉定区物流园",
    "destination": "厦门市同安区工业园区",
    "carrier": "顺丰速运",
    "transport_mode": "公路+冷链"
  },
  "cargo": [
    { "name": "电子元器件 A型号", "quantity": 5000, "pallets": 2 },
    { "name": "精密零部件 C系列", "quantity": 1000, "pallets": 1 },
    { "name": "包装缓冲材料", "weight_kg": 200 }
  ],
  "timeline": {
    "departure": "2024-12-20T08:00:00",
    "arrival": "2024-12-21T16:30:00",
    "duration_hours": 32.5,
    "temperature_range": "18-22°C"
  },
  "receipt": { "receiver": "李建国", "date": "2024-12-21", "status": "完好" }
}`,
  outlineItems: [
    { page: 1, type: "标题", label: "物流运输报告", color: "#3b82f6", bg: "#eff6ff" },
    { page: 1, type: "表格", label: "运输概况", color: "#10b981", bg: "#f0fdf4" },
    { page: 1, type: "列表", label: "货物清单", color: "#8b5cf6", bg: "#f5f3ff" },
    { page: 2, type: "列表", label: "运输时效", color: "#8b5cf6", bg: "#f5f3ff" },
    { page: 2, type: "文本", label: "签收确认", color: "#f59e0b", bg: "#fffbeb" },
  ],
  docBlocks: [
    {
      id: "b1", page: 1, type: "标题", typeColor: "#3b82f6", typeBg: "#eff6ff", borderColor: "#3b82f6",
      content: (<div className="text-center"><div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 2 }}>物流运输报告 — 批次007</div><div style={{ fontSize: 11, color: "#888" }}>批次编号：SHIP-2024-007</div></div>),
    },
    {
      id: "b2", page: 1, type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981",
      content: (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead><tr style={{ background: "#f9fafb" }}>{["字段", "内容"].map((h) => (<th key={h} style={{ border: "1px solid #e5e7eb", padding: "4px 8px", textAlign: "left", color: "#374151", fontWeight: 600 }}>{h}</th>))}</tr></thead>
          <tbody>{[["批次编号", "SHIP-2024-007"], ["发货日期", "2024年12月20日"], ["始发地", "上海市嘉定区物流园"], ["目的地", "厦门市同安区工业园区"], ["承运方", "顺丰速运"], ["运输方式", "公路 + 冷链"]].map(([k, v]) => (<tr key={k}><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280", background: "#f9fafb" }}>{k}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827" }}>{v}</td></tr>))}</tbody>
        </table>
      ),
    },
    {
      id: "b3", page: 1, type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6",
      content: (<div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}><div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>货物清单</div><div><span style={{ color: "#8b5cf6", marginRight: 4 }}>1.</span><strong>电子元器件 A型号</strong> × 5,000 件（2 托盘）</div><div><span style={{ color: "#8b5cf6", marginRight: 4 }}>2.</span><strong>精密零部件 C系列</strong> × 1,000 套（1 托盘）</div><div><span style={{ color: "#8b5cf6", marginRight: 4 }}>3.</span><strong>包装缓冲材料</strong> × 200 kg</div></div>),
    },
    {
      id: "b4", page: 2, type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6",
      content: (<div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}><div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>运输时效</div><div>• 发车时间：2024-12-20 08:00</div><div>• 到达时间：2024-12-21 16:30</div><div>• 总运输时长：32.5 小时</div><div>• 温度记录：全程 18°C ~ 22°C（达标）</div></div>),
    },
    {
      id: "b5", page: 2, type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b",
      content: (<div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}><div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>签收确认</div><div>签收人：李建国（仓储主管）</div><div>签收日期：2024年12月21日</div><div>备注：货物完好，无损坏。</div></div>),
    },
  ],
  mdBlocks: [
    { id: "md1", type: "标题", typeColor: "#3b82f6", typeBg: "#eff6ff", borderColor: "#3b82f6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`# 物流运输报告 — 批次007`}</pre>) },
    { id: "md2", type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 运输概况\n\n| 字段 | 内容 |\n|------|------|\n| 批次编号 | SHIP-2024-007 |\n| 发货日期 | 2024年12月20日 |\n| 始发地 | 上海市嘉定区物流园 |\n| 目的地 | 厦门市同安区工业园区 |\n| 承运方 | 顺丰速运 |`}</pre>) },
    { id: "md3", type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 货物清单\n\n1. **电子元器件 A型号** × 5,000 件（2 托盘）\n2. **精密零部件 C系列** × 1,000 套（1 托盘）\n3. **包装缓冲材料** × 200 kg`}</pre>) },
    { id: "md4", type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 运输时效\n\n- 发车时间：2024-12-20 08:00\n- 到达时间：2024-12-21 16:30\n- 总运输时长：32.5 小时\n- 温度记录：全程 18°C ~ 22°C（达标）`}</pre>) },
    { id: "md5", type: "文本", typeColor: "#f59e0b", typeBg: "#fffbeb", borderColor: "#f59e0b", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 签收确认\n\n签收人：李建国（仓储主管）\n签收日期：2024年12月21日\n备注：货物完好，无损坏。`}</pre>) },
  ],
};

/* ================================================================
   t010 — 年度采购计划2026.pdf
   ================================================================ */
const t010: FileContent = {
  totalPages: 3,
  markdown: `# 年度采购计划 2026

## 编制信息

| 字段 | 内容 |
|------|------|
| 文档编号 | AP-2026-001 |
| 编制日期 | 2026年1月10日 |
| 编制部门 | 采购管理中心 |
| 审批人 | 陈总监 |

## 年度预算概览

- 总预算额度：¥8,500,000
- 电子元器件：¥3,200,000（37.6%）
- 精密零部件：¥2,800,000（32.9%）
- 包装材料：¥1,200,000（14.1%）
- 办公用品及其他：¥1,300,000（15.3%）

## Q1 采购计划

| 品类 | 数量 | 预算 | 供应商 |
|------|------|------|--------|
| 电子元器件 A | 15,000 件 | ¥187,500 | 上海原材料贸易 |
| 精密零部件 C | 3,000 套 | ¥258,000 | 深圳恒通精密 |
| 包装缓冲材料 | 2,000 kg | ¥96,000 | 广州包装科技 |

## Q2 采购计划

| 品类 | 数量 | 预算 | 供应商 |
|------|------|------|--------|
| 电子元器件 B | 8,000 件 | ¥224,000 | 上海原材料贸易 |
| 传感器 TS-200 | 500 套 | ¥175,000 | 厦门供应链科技 |

## 风险与应对

- 原材料价格波动：签订固定价格年度框架协议
- 供应商产能不足：建立二级备选供应商机制
- 物流延迟风险：要求供应商提前 5 天发货
`,
  json: `{
  "document_title": "年度采购计划 2026",
  "document_type": "procurement_plan",
  "metadata": {
    "doc_id": "AP-2026-001",
    "date": "2026-01-10",
    "department": "采购管理中心",
    "approver": "陈总监"
  },
  "budget": {
    "total": 8500000,
    "breakdown": [
      { "category": "电子元器件", "amount": 3200000, "ratio": 0.376 },
      { "category": "精密零部件", "amount": 2800000, "ratio": 0.329 },
      { "category": "包装材料", "amount": 1200000, "ratio": 0.141 },
      { "category": "办公用品及其他", "amount": 1300000, "ratio": 0.153 }
    ]
  },
  "quarterly_plans": {
    "Q1": [
      { "item": "电子元器件 A", "qty": 15000, "budget": 187500, "supplier": "上海原材料贸易" },
      { "item": "精密零部件 C", "qty": 3000, "budget": 258000, "supplier": "深圳恒通精密" }
    ],
    "Q2": [
      { "item": "电子元器件 B", "qty": 8000, "budget": 224000, "supplier": "上海原材料贸易" },
      { "item": "传感器 TS-200", "qty": 500, "budget": 175000, "supplier": "厦门供应链科技" }
    ]
  }
}`,
  outlineItems: [
    { page: 1, type: "标题", label: "年度采购计划", color: "#3b82f6", bg: "#eff6ff" },
    { page: 1, type: "表格", label: "编制信息", color: "#10b981", bg: "#f0fdf4" },
    { page: 1, type: "列表", label: "预算概览", color: "#8b5cf6", bg: "#f5f3ff" },
    { page: 2, type: "表格", label: "Q1 采购计划", color: "#10b981", bg: "#f0fdf4" },
    { page: 2, type: "表格", label: "Q2 采购计划", color: "#10b981", bg: "#f0fdf4" },
    { page: 3, type: "列表", label: "风险与应对", color: "#8b5cf6", bg: "#f5f3ff" },
  ],
  docBlocks: [
    {
      id: "b1", page: 1, type: "标题", typeColor: "#3b82f6", typeBg: "#eff6ff", borderColor: "#3b82f6",
      content: (<div className="text-center"><div style={{ fontSize: 15, fontWeight: 700, color: "#111", marginBottom: 2 }}>年度采购计划 2026</div><div style={{ fontSize: 11, color: "#888" }}>文档编号：AP-2026-001 · 采购管理中心</div></div>),
    },
    {
      id: "b2", page: 1, type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981",
      content: (
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead><tr style={{ background: "#f9fafb" }}>{["字段", "内容"].map((h) => (<th key={h} style={{ border: "1px solid #e5e7eb", padding: "4px 8px", textAlign: "left", color: "#374151", fontWeight: 600 }}>{h}</th>))}</tr></thead>
          <tbody>{[["文档编号", "AP-2026-001"], ["编制日期", "2026年1月10日"], ["编制部门", "采购管理中心"], ["审批人", "陈总监"]].map(([k, v]) => (<tr key={k}><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280", background: "#f9fafb" }}>{k}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827" }}>{v}</td></tr>))}</tbody>
        </table>
      ),
    },
    {
      id: "b3", page: 1, type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6",
      content: (<div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}><div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>年度预算概览</div><div>• 总预算额度：<strong>¥8,500,000</strong></div><div>• 电子元器件：¥3,200,000（37.6%）</div><div>• 精密零部件：¥2,800,000（32.9%）</div><div>• 包装材料：¥1,200,000（14.1%）</div><div>• 办公用品及其他：¥1,300,000（15.3%）</div></div>),
    },
    {
      id: "b4", page: 2, type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981",
      content: (
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 12, color: "#374151" }}>Q1 采购计划</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead><tr style={{ background: "#f9fafb" }}>{["品类", "数量", "预算", "供应商"].map((h) => (<th key={h} style={{ border: "1px solid #e5e7eb", padding: "4px 8px", textAlign: "left", color: "#374151", fontWeight: 600 }}>{h}</th>))}</tr></thead>
            <tbody>{[["电子元器件 A", "15,000 件", "¥187,500", "上海原材料贸易"], ["精密零部件 C", "3,000 套", "¥258,000", "深圳恒通精密"], ["包装缓冲材料", "2,000 kg", "¥96,000", "广州包装科技"]].map(([a, b, c, d]) => (<tr key={a}><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827" }}>{a}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280" }}>{b}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827", fontWeight: 500 }}>{c}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280" }}>{d}</td></tr>))}</tbody>
          </table>
        </div>
      ),
    },
    {
      id: "b5", page: 2, type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981",
      content: (
        <div>
          <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 12, color: "#374151" }}>Q2 采购计划</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead><tr style={{ background: "#f9fafb" }}>{["品类", "数量", "预算", "供应商"].map((h) => (<th key={h} style={{ border: "1px solid #e5e7eb", padding: "4px 8px", textAlign: "left", color: "#374151", fontWeight: 600 }}>{h}</th>))}</tr></thead>
            <tbody>{[["电子元器件 B", "8,000 件", "¥224,000", "上海原材料贸易"], ["传感器 TS-200", "500 套", "¥175,000", "厦门供应链科技"]].map(([a, b, c, d]) => (<tr key={a}><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827" }}>{a}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280" }}>{b}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#111827", fontWeight: 500 }}>{c}</td><td style={{ border: "1px solid #e5e7eb", padding: "4px 8px", color: "#6b7280" }}>{d}</td></tr>))}</tbody>
          </table>
        </div>
      ),
    },
    {
      id: "b6", page: 3, type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6",
      content: (<div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}><div style={{ fontWeight: 700, marginBottom: 4, fontSize: 12 }}>风险与应对</div><div>• 原材料价格波动：签订固定价格年度框架协议</div><div>• 供应商产能不足：建立二级备选供应商机制</div><div>• 物流延迟风险：要求供应商提前 5 天发货</div></div>),
    },
  ],
  mdBlocks: [
    { id: "md1", type: "标题", typeColor: "#3b82f6", typeBg: "#eff6ff", borderColor: "#3b82f6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`# 年度采购计划 2026`}</pre>) },
    { id: "md2", type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 编制信息\n\n| 字段 | 内容 |\n|------|------|\n| 文档编号 | AP-2026-001 |\n| 编制日期 | 2026年1月10日 |\n| 编制部门 | 采购管理中心 |\n| 审批人 | 陈总监 |`}</pre>) },
    { id: "md3", type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 年度预算概览\n\n- 总预算额度：¥8,500,000\n- 电子元器件：¥3,200,000（37.6%）\n- 精密零部件：¥2,800,000（32.9%）\n- 包装材料：¥1,200,000（14.1%）\n- 办公用品及其他：¥1,300,000（15.3%）`}</pre>) },
    { id: "md4", type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## Q1 采购计划\n\n| 品类 | 数量 | 预算 | 供应商 |\n|------|------|------|--------|\n| 电子元器件 A | 15,000 件 | ¥187,500 | 上海原材料贸易 |\n| 精密零部件 C | 3,000 套 | ¥258,000 | 深圳恒通精密 |\n| 包装缓冲材料 | 2,000 kg | ¥96,000 | 广州包装科技 |`}</pre>) },
    { id: "md5", type: "表格", typeColor: "#10b981", typeBg: "#f0fdf4", borderColor: "#10b981", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## Q2 采购计划\n\n| 品类 | 数量 | 预算 | 供应商 |\n|------|------|------|--------|\n| 电子元器件 B | 8,000 件 | ¥224,000 | 上海原材料贸易 |\n| 传感器 TS-200 | 500 套 | ¥175,000 | 厦门供应链科技 |`}</pre>) },
    { id: "md6", type: "列表", typeColor: "#8b5cf6", typeBg: "#f5f3ff", borderColor: "#8b5cf6", content: (<pre className="whitespace-pre-wrap text-xs font-mono text-gray-800">{`## 风险与应对\n\n- 原材料价格波动：签订固定价格年度框架协议\n- 供应商产能不足：建立二级备选供应商机制\n- 物流延迟风险：要求供应商提前 5 天发货`}</pre>) },
  ],
};

/* ================================================================
   Content map — keyed by task ID
   ================================================================ */
export const CONTENT_MAP: Record<string, FileContent> = {
  t001, t002, t005, t006, t009, t010,
};

/** Returns content for a task ID, falling back to t001 */
export function getContentForTask(taskId: string | undefined): FileContent {
  if (!taskId) return t001;
  return CONTENT_MAP[taskId] ?? t001;
}
