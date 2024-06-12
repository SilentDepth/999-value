import { Client } from "@notionhq/client";
import { match, P } from "ts-pattern";

export type Config = {
	currency: string;
	value: number;
};

const { NOTION_TOKEN, NOTION_DATABASE } = process.env;
if (!NOTION_TOKEN || !NOTION_DATABASE) {
	throw new Error("Notion config not ready");
}

const notion = new Client({ auth: NOTION_TOKEN });

export default defineEventHandler(async () => {
	const {
		results: [data],
	} = await notion.databases.query({
		database_id: NOTION_DATABASE,
	});
	return match(data)
		.with(
			{
				properties: {
					Value: { number: P.select("value", P.number) },
					Currency: { title: [{ plain_text: P.select("currency", P.string) }] },
				},
			},
			(select) => select,
		)
		.run();
});
