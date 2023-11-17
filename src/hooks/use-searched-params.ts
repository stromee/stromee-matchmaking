import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

const desiralizeParams = (searchParams: URLSearchParams) => {
  const desiralizedParams: Record<string, string[]> = {};
  searchParams.forEach((value, name) => {
    if (name in desiralizeParams) {
      desiralizedParams[name].push(value);
    } else {
      desiralizedParams[name] = [value];
    }
  });

  const finalParams: Record<string, string | string[]> = {};
  Object.entries(desiralizedParams).forEach(([name, values]) => {
    if (values.length === 1) {
      finalParams[name] = values[0];
    } else {
      finalParams[name] = values;
    }
  });

  return finalParams;
};

const useSearchedParams = () => {
  const [searchParams] = useSearchParams();

  const desiralizedParams = useMemo(() => {
    return desiralizedParams(searchParams);
  }, [searchParams]);

  return desiralizedParams;
};

export { useSearchedParams };
