import { configureStore } from "@reduxjs/toolkit";
import { todoUiReducer } from "./todoUiSlice";

/**
 * One store per mount, not a module-level singleton — each Demo creates
 * its own via makeStore() inside a "use client" Provider, since Demos are
 * independent and this app is a static export of many pages, not a
 * single SPA. See the Store & Slices lesson.
 */
export function makeStore() {
  return configureStore({
    reducer: {
      todoUi: todoUiReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
