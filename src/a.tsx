import "@tamagui/polyfill-dev";

import { RouterProvider } from "react-router-dom";
import { router } from "./Router";

const App = () => {
  return <RouterProvider router={router} />;
};

export { App };
