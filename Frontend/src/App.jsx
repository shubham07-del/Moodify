import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import { AuthProvider } from "./Features/auth/auth.context";
import { SongContextProvider } from "./Features/home/song.context";

const App = () => {
  return (
    <>
      <AuthProvider>
        <SongContextProvider>
          <RouterProvider router={router} />
        </SongContextProvider>
      </AuthProvider>
    </>
  );
};

export default App;
