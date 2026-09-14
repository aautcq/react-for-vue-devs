// The Running Example's /todos route lives outside the (lessons) group and
// has no Sidebar, but still needs its own bounded, scrollable content pane
// under the app-wide sticky Header (see app/layout.tsx's fixed viewport shell).
export default function TodosLayout({ children }: LayoutProps<"/todos">) {
  return <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>;
}
