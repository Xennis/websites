import { unstable_cache } from "next/cache"
import type { AlternateURLs } from "next/dist/lib/metadata/types/alternative-urls-types"

import { i18n } from "@/content/i18n"
import { blogTagPage, businessIdeasPage } from "@/content/config"
import { tagToString } from "@/lib/cms/blog-posts"
import { fetchBlogPosts, fetchBusinessIdeasPages, fetchPageContent, fetchPages } from "@/lib/cms/fetch"

export const tagPageContent = (blockId: string) => `cms-page-${blockId}`
export const tagCmsData = "cms-data"

export const getCachedPages = unstable_cache(
  async () => {
    const pages = await fetchPages()
    console.debug(`fetched ${pages.length} pages from notion database ${process.env.NOTION_PAGES_DB_ID!}`)
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
    revalidate: false,
    tags: [tagCmsData],
  },
)

export const getCachedPageContent = async (blockId: string) => {
  return await unstable_cache(
    async () => {
      const children = await fetchPageContent(blockId)
      console.info(`fetched ${children.length} first-class child blocks from notion block ${blockId}`)
      return children
    },
    [`cms-page-${blockId}`],
    {
      revalidate: false,
      tags: [tagPageContent(blockId)],
    },
  )()
}

export const getCachedBusinessIdeasPages = unstable_cache(
  async () => {
    const pages = await fetchBusinessIdeasPages()
    console.debug(
      `fetched ${pages.length} pages from notion database ${process.env.NOTION_GUIDE_BUSINESS_IDEAS_DB_ID!}`,
    )
    return pages.map((p) => {
      return {
        ...p,
        canonical: businessIdeasPage(i18n.defaultLocale, p.slug),
      }
    })
  },
  ["cms-business-ideas-pages"],
  {
    revalidate: false,
    tags: [tagCmsData],
  },
)

export const getCachedBlogPosts = unstable_cache(
  async () => {
    const posts = await fetchBlogPosts()
    console.debug(`fetched ${posts.length} pages from notion database 0decc798-b1fd-4d76-87c8-2ffc8f5e5fa4`)
    return posts
  },
  ["cms-blog-posts"],
  {
    revalidate: false,
    tags: [tagCmsData],
  },
)

export const getCachedBlogTags = unstable_cache(
  async () => {
    const tags = new Set<string>()
    ;(await getCachedBlogPosts()).forEach((p) => {
      p.tags.forEach((t) => tags.add(t))
    })
    return Array.from(tags).map((t) => ({
      name: t,
      label: tagToString(t),
      canonical: blogTagPage(i18n.defaultLocale, t),
    }))
  },
  ["cms-blog-tags"],
  {
    revalidate: false,
    tags: [tagCmsData], // the tags depend on the posts
  },
)
