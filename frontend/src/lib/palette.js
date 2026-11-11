import { createContext, useContext } from "react";

// Lets any button open the site-wide search (provided by <Layout>).
export const PaletteContext = createContext(() => {});
export const usePalette = () => useContext(PaletteContext);
