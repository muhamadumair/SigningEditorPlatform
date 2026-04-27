import { createContext, MutableRefObject, ReactNode, useContext, useRef } from "react";

type PageRefMap = Record<number, HTMLElement | null>;

const PageRefsContext = createContext<MutableRefObject<PageRefMap> | null>(null);

export const PageRefsProvider = ({ children }: { children: ReactNode }) => {
  const ref = useRef<PageRefMap>({});
  return <PageRefsContext.Provider value={ref}>{children}</PageRefsContext.Provider>;
};

/** Access the shared map of `pageNumber -> page DOM node`. */
export const usePageRefs = () => {
  const ctx = useContext(PageRefsContext);
  if (!ctx) throw new Error("usePageRefs must be used inside <PageRefsProvider>");
  return ctx;
};
