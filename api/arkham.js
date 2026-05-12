export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const data = req.body;

  // 1. 获取环境变量中的钉钉 Webhook
  const DINGTALK_URL = process.env.DINGTALK_WEBHOOK;

  // 2. 解析 Arkham 的数据 (这里以典型的 Arkham Alert 结构为例)
  // 你可以根据 Arkham 实际推送的 JSON 结构调整字段提取逻辑
  const label = data.label || 'Arkham 监控';
  const description = data.description || '发现新的链上活动';
  const externalUrl = data.url || 'https://www.arkhamintelligence.com/';

  // 3. 构造钉钉 Markdown 消息（比纯文本更美观）
  const dingtalkPayload = {
    "msgtype": "markdown",
    "markdown": {
      "title": "Arkham 提醒",
      "text": `### 🛡️ Arkham 链上监控提醒\n\n` +
              `**监控标签:** ${label}\n\n` +
              `**详情:** ${description}\n\n` +
              `[点击查看完整交易](${externalUrl})\n\n` +
              `> 注：此消息转发自 Vercel 自动化脚本` // 确保包含你在钉钉设置的“关键词”
    }
  };

  try {
    await fetch(DINGTALK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dingtalkPayload)
    });
    return res.status(200).json({ status: 'success' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}