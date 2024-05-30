type Project = { name: string; href: string; tags: Array<string>; shortDescription: string }

function ProjectItem({
  name,
  href,
  tags,
  shortDescription,
  tagsSrLabel,
}: Project & {
  tagsSrLabel: string
}) {
  return (
    <>
      <div className="flex">
        <a href={href} target="_blank">
          {name}
        </a>
        <ul className="flex gap-1 ps-2" aria-label={tagsSrLabel}>
          {tags.map((t, index) => (
            <li key={index}>
              <span aria-hidden={true}>#</span>
              {t}
            </li>
          ))}
        </ul>
      </div>
      {shortDescription}
    </>
  )
}

export function Projects({
  projects,
  dictionary,
}: {
  projects: Array<Project>
  dictionary: { headline: string; tagsSrLabel: string }
}) {
  return (
    <>
      <h2 className="pb-2 pt-7 text-2xl font-semibold tracking-tight sm:text-3xl">{dictionary.headline}</h2>
      <ul className="ms-6 list-outside list-disc py-1 leading-7 text-gray-700">
        {projects.map((p, index) => (
          <li key={index} className="pt-2">
            <ProjectItem {...p} tagsSrLabel={dictionary.tagsSrLabel} />
          </li>
        ))}
      </ul>
    </>
  )
}
