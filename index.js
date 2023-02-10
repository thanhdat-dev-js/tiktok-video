const puppeteer = require("puppeteer");
const fs = require("fs");
async function crawler(keyword) {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto("https://www.tiktok.com/");

    var index = 0;
    var result = [];
    var len = 0;

    while (index < 1000) {
      await page.goto(
        `https://www.tiktok.com/api/search/general/full/?aid=1988&app_language=vi-VN&app_name=tiktok_web&battery_info=0.19&browser_language=en-US&browser_name=Mozilla&browser_online=true&browser_platform=MacIntel&browser_version=5.0%20%28Macintosh%3B%20Intel%20Mac%20OS%20X%2010_15_7%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F110.0.0.0%20Safari%2F537.36&channel=tiktok_web&cookie_enabled=true&device_id=7198449806602929665&device_platform=web_pc&focus_state=true&from_page=search&history_len=4&is_fullscreen=false&is_page_visible=true&keyword=${keyword}&offset=${
          index * 12
        }&os=mac&priority_region=&referer=https%3A%2F%2Fwww.google.com%2F&region=VN&root_referer=https%3A%2F%2Fwww.google.com%2F&screen_height=900&screen_width=1440&tz_name=Asia%2FSaigon&verifyFp=verify_ldyavfqb_hpxVheNb_BD9b_4yAZ_BsDk_NHHtH9U5TVoA&webcast_language=vi-VN&msToken=mLLnTWhFi28gaeaSk0MmFhQAtc4_bmtkpZfZzwq1_KqtC1xuwkXKaJQZlvjurGYF4xnrVX1CEYiDxiKWqKVOrs5LkM9SMZAxI2DsFIAezbH42JyA9In4ApynbKqT4dop-JVtph5y5j64KS4=&X-Bogus=DFSzswVggAhANnFfShB88N7TlqeL&_signature=_02B4Z6wo000017bOgIwAAIDAIhjbg-Ty6Le2zoQAAI5e8d`,
        { waitUntil: "networkidle0" }
      );
      index += 1;
      const text = await page.$eval("body > pre", (el) => el.textContent);
      console.log("index " + index + " ");
      const textRes = JSON.parse(text);
      if (textRes.status_code == 0) break;
      const res = textRes.data
        .filter((item) => item.type == 1)
        .map((item) => {
          return {
            createTime: item.item.createTime,
            link: `https://www.tiktok.com/@${item.item.author.uniqueId}/video/${item.item.id}`,
          };
        });
      result = result.concat(res);
      len += res.length;
    }
    fs.writeFileSync(
      `${keyword}-${len}-${Date.now()}.json`,
      JSON.stringify(result)
    );
    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

const keywords = ["facebook", "youtube", "tiktok"];
keywords.forEach((item) => {
  crawler(item);
});
