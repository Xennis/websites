import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints"
import { propsFirstPlainText, propsNumber, propsSelect } from "@react-notion-cms/fetch"

const langSelects = ["de", "en"] as const
export type PageLang = (typeof langSelects)[number]

export type Page = {
  title: string
  subtitle: string | null
  lang: PageLang
  slug: string
  description: string
  sitemapPriority: number
  lastEdited: Date
  blockId: string
}

const stringToLang = (lang: string | null): PageLang | null => {
  return langSelects.find((s) => s.toString() === lang) ?? null
}

export const processPages = (page: PageObjectResponse): Page | null => {
  const title = propsFirstPlainText(page.properties, "Name")
  const lang = stringToLang(propsSelect(page.properties, "lang"))
  const slug = propsFirstPlainText(page.properties, "slug")
  const description = propsFirstPlainText(page.properties, "description")
  const sitemapPriority = propsNumber(page.properties, "sitemap-priority")
  const lastEdited = new Date(page.last_edited_time)

  if (!title || !lang || !slug || !description || !sitemapPriority || Number.isNaN(lastEdited)) {
    console.warn(`page with id=${page.id} and title="${title}" has invalid properties`)
    return null
  }

  const subtitle = propsFirstPlainText(page.properties, "subtitle")

  return {
    title: title,
    subtitle: subtitle,
    lang: lang,
    slug: slug,
    description: description,
    sitemapPriority: sitemapPriority,
    lastEdited: lastEdited,
    blockId: page.id,
  }
}