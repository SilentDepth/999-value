import { Client } from '@notionhq/client'

export type Config = {
  currency: string
  value: number
}

const notion = new Client({ auth: process.env.NOTION_TOKEN })

export default defineEventHandler(async () => {
  const { results: [data] } = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE,
  })
  const properties = (data as any).properties
  return {
    currency: properties.Currency.title[0].plain_text,
    value: properties.Value.number,
  }
})
