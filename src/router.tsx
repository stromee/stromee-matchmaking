import { createBrowserRouter } from "react-router-dom";

import { Root } from "@layouts/root";

import { Home } from "@routes/home";
import { Matches } from "@routes/matches";
import { Match } from "@routes/match";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    //   errorElement: <ErrorPage />,
    children: [
      {
        path: "matches/:producerId",
        element: <Match />,
      },
      {
        path: "matches",
        element: <Matches />,
      },

      {
        path: "",
        element: <Home />,
      },
    ],
  },
]);

export { router };
