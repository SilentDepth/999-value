import * as cheerio from "cheerio";

export type CurrencyInfo = {
	code: string;
	name: string;
	result: number;
};

const MAX_AGE = 3600_000; // 1 hour
let lastCheck = 0;
let currencies: CurrencyInfo[];

export default defineEventHandler(async () => {
	if (Date.now() - lastCheck > MAX_AGE) {
		const html = await $fetch<string>(
			"https://currency.world/exchange_rates/all/CNY",
			{
				headers: { "Accept-Language": "zh-CN" },
			},
		);

		const $ = cheerio.load(html);
		const data = $(".ratestable > .item")
			.toArray()
			.map((el) => ({
				code: $(".code", el).text(),
				name: $(".curname", el).text(),
				result: Number($(".rate", el).text()) * 999,
			}))
			.filter((it) => it.result <= 999)
			.sort((a, b) => a.result - b.result);
		currencies = data.slice(
			Math.min(
				data.findIndex((it) => it.code === "JPY"),
				data.findIndex((it) => it.result >= 50),
			),
		);

		lastCheck = Date.now();
	}

	return currencies;
});
