"use server";

import * as cheerio from "cheerio";

export async function getArticleContent(formData: FormData) {
  const url = formData.get("url") as string;
  const rawText = formData.get("rawText") as string;

  // 1. 직접 텍스트를 붙여넣은 경우
  if (rawText && rawText.trim().length > 0) {
    return { content: rawText, source: "manual" };
  }

  // 2. URL이 입력된 경우 크롤링 시작
  if (url) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      const html = await response.text();
      const $ = cheerio.load(html);

      // 연합뉴스 본문 선택자 (상황에 따라 업데이트 필요)
      // 보통 .sc_article-body 나 article.story-news 등에 본문이 있습니다.
      let content =
        $(".article-body").text() ||
        $(".story-news").text() ||
        $("article").text();

      // 불필요한 공백 및 기자 메일 등 정규식으로 간단히 정제
      content = content
        .replace(/\s+/g, " ")
        .replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})/g, "") // 이메일 제거
        .trim();

      return { content, source: "url" };
    } catch (error) {
      console.error("Scraping error:", error);
      throw new Error("기사를 가져오는데 실패했습니다.");
    }
  }

  return { content: "", source: "none" };
}
