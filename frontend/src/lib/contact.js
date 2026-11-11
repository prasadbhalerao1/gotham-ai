import { createContext, useContext } from "react";

// Lets any button open the site-wide contact modal (provided by <Layout>).
export const ContactContext = createContext(() => {});
export const useContact = () => useContext(ContactContext);
