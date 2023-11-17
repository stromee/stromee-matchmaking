import { createBrowserRouter } from "react-router-dom";

import { Root } from "./routes/layouts/root";

import { Home } from "./routes/home";
import Contact, { Bla, loader } from "./routes/contact";
import { queryClient } from "./query-client";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    //   errorElement: <ErrorPage />,
    children: [
      {
        path: "contact/:contactId",
        element: <Contact />,
      },
      {
        path: "",
        element: <Home />,
      },
    ],
  },
]);

export { router };
