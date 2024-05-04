import { type Metadata } from "next"

import { AuthorHeader } from "@/components/author-header"
import { getDictionary } from "@/content/i18n/dictionaries"
import { getCollections } from "@/content/i18n/collections"
import { Projects } from "@/components/projects"
import { aboutPage, host } from "@/lib/links"
import { createAlternativeUrls } from "@/lib/next"

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata | null> {
  const dictionary = getDictionary(params.lang)
  return {
    title: dictionary.pages.about.title,
    alternates: createAlternativeUrls(aboutPage),
  }
}

export default function AboutPage({ params }: { params: { lang: string } }) {
  const dictionary = getDictionary(params.lang)
  const collections = getCollections(params.lang)

  return (
    <>
      <AuthorHeader
        socialLinks={collections.socialLinks}
        dictionary={dictionary.component.authorHeader}
        includeJsonLd={true}
      />
      <Projects projects={collections.projects} dictionary={dictionary.component.projects} />
    </>
  )
}
