export default function DefaultLayout({ children, params }: { children: React.ReactNode; params: { lang: string } }) {
  return <main className="px-8 py-10">{children}</main>
}
