import { unstable_cache } from "next/cache"
import type { AlternateURLs } from "next/dist/lib/metadata/types/alternative-urls-types"

import { processPlace } from "@/lib/cms/collections/places"
import { fetchDatabasePages, notionClient } from "@/lib/cms/notion/fetch"
import { processPages } from "@/lib/cms/collections/pages"
import { i18n } from "@/content/i18n"
import { fetchBlocksChildren } from "@xennis/react-notion-render"

export async function getCachedPlaces() {
  return await unstable_cache(
    async () => {
      return fetchDatabasePages(process.env.NOTION_PLACES_DB_ID!, processPlace)
    },
    ["cms-places"],
    {
      revalidate: 5 * 60,
    },
  )()
}

export async function getCachedPages() {
  return await unstable_cache(
    async () => {
      const pages = await fetchDatabasePages(process.env.NOTION_PAGES_DB_ID!, processPages)
      return pages.map((p) => {
        const languages: AlternateURLs["languages"] = {}
        i18n.locales.forEach((lang) => {
          languages[lang] = `/${lang}/${p.slug}`
        })
        return {
          ...p,
          canonical: `/${p.lang}/${p.slug}`,
          languages: languages,
        }
      })
    },
    ["cms-pages"],
    {
      revalidate: 5 * 60,
    },
  )()
}

export async function getCachedPage({ lang, slug }: { lang: string; slug: string }) {
  const page = (await getCachedPages()).find((p) => p.lang.toString() === lang && p.slug === slug)
  return page ?? null
}

export async function getCachedPageContent(blockId: string) {
  return await unstable_cache(
    async () => {
      return fetchBlocksChildren(notionClient, blockId)
    },
    [`cms-page-${blockId}`],
    {
      revalidate: 5 * 60,
    },
  )()
}