import { usePageContext } from "./context";

export const useData = <T = any>() => {
  const { data } = usePageContext();
  return data as T;
};
