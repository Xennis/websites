import { fetchDatabasePages } from "@xennis/react-notion-cms-fetch"
import { fetchBlocksChildren } from "@xennis/react-notion-cms-render"
import { Client } from "@notionhq/client"
import type { QueryDatabaseParameters } from "@notionhq/client/build/src/api-endpoints"

import { processPages } from "@/lib/cms/pages"
import { processBusinessIdeasPages } from "@/lib/cms/business-ideas"
import { downloadImageToPublicDir } from "@/lib/cms/image"
import { processBlogPosts } from "@/lib/cms/blog-posts"
import { blogPagePost } from "@/content/config"

const notionClient = new Client({
  auth: process.env.NOTION_ACCESS_TOKEN,
  timeoutMs: 20 * 1000,
})

export const fetchPageContent = async (blockId: string) => {
  return fetchBlocksChildren(
    notionClient,
    {
      block_id: blockId,
      page_size: 100,
    },
    {
      resolveImageFn: (url: string, meta: { blockId: string; lastEditedTime: Date }) =>
        downloadImageToPublicDir(url, `image-${meta.blockId}`, meta.lastEditedTime),
    },
  )
}

export const fetchPage = (pageId: string) => notionClient.pages.retrieve({ page_id: pageId })

export const fetchPages = () =>
  fetchDatabasePages(notionClient, processPages, {
    database_id: process.env.NOTION_PAGES_DB_ID!,
    page_size: 100,
  })

export const fetchBusinessIdeasPages = () =>
  fetchDatabasePages(notionClient, processBusinessIdeasPages, {
    database_id: process.env.NOTION_GUIDE_BUSINESS_IDEAS_DB_ID!,
    page_size: 100,
    filter: {
      property: "public",
      type: "checkbox",
      checkbox: {
        equals: true,
      },
    },
  })

export const fetchBlogPosts = async (draftMode?: boolean) => {
  const filter: QueryDatabaseParameters["filter"] =
    draftMode === true
      ? undefined
      : {
          property: "public",
          type: "checkbox",
          checkbox: {
            equals: true,
          },
        }
  const posts = await fetchDatabasePages(notionClient, processBlogPosts, {
    database_id: "0decc798-b1fd-4d76-87c8-2ffc8f5e5fa4",
    page_size: 100,
    filter: filter,
    sorts: [
      {
        property: "publish-date",
        direction: "descending",
      },
    ],
  })
  return posts.map((p) => ({
    ...p,
    canonical: blogPagePost(p.slug),
  }))
}
