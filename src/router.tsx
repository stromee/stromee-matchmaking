import { createBrowserRouter } from "react-router-dom";

import { Root } from "./routes/layouts/root";

import { Home } from "./routes/home";
import Contact from "./routes/contact";

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
