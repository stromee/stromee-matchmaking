import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

const desiralizeParams = (searchParams: URLSearchParams) => {
  const paramsArray: Record<string, string[]> = {};
  searchParams.forEach((value, name) => {
    if (name in paramsArray) {
      paramsArray[name].push(value);
    } else {
      paramsArray[name] = [value];
    }
  });

  const finalParams: Record<string, string | string[]> = {};
  Object.entries(paramsArray).forEach(([name, values]) => {
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
    return desiralizeParams(searchParams);
  }, [searchParams]);

  return desiralizedParams;
};

export { useSearchedParams };
