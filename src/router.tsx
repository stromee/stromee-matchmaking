import { createBrowserRouter } from "react-router-dom";

import { Root } from "@layouts/root";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Root />,
      //   errorElement: <ErrorPage />,
      children: [
        {
          path: "matches/:producerId",
          lazy: () => import("@routes/match"),
        },
        {
          path: "matches",
          lazy: () => import("@routes/matches"),
        },

        {
          path: "",
          lazy: () => import("@routes/home"),
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

export { router };
