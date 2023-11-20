import { useParams } from "react-router-dom";

const useDefinedParam = (param) => {
  const params = useParams();
  const value = params[param];
  if (value === undefined) {
    throw new Error(`param ${param} must be defined`);
  }

  return value;
};

export { useDefinedParam };
