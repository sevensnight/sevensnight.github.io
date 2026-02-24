/**
 * 计算文章字数的工具函数
 * 使用与 SiteStats.astro 相同的算法
 * 
 * @param text 文章内容
 * @returns 字数统计对象
 */
export function calculateWordCount(text: string) {
	// 只移除代码块，保留内联代码
	let processedText = text 
		.replace(/```[\s\S]*?```/g, "") // 移除代码块
		.replace(/\s+/g, " ") // 合并空白
		.trim();

	// 分别计算中文字符和英文字符
	const chineseChars = processedText.match(/[\u4e00-\u9fa5]/g) || [];
	const englishChars = processedText.match(/[a-zA-Z]/g) || [];

	const wordCount = chineseChars.length + englishChars.length;

	// 估算时间：英文 200词/分，中文 350字/分
	const minutes = englishChars.length / 200 + chineseChars.length / 350;

	return {
		words: wordCount,
		minutes: Math.max(1, Math.round(minutes)),
		chineseChars: chineseChars.length,
		englishChars: englishChars.length
	};
}