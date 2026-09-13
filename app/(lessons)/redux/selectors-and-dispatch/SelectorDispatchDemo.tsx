"use client";

import { useState, type ReactNode } from "react";
import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

// Same tiny counter slice as the previous lesson, rebuilt here so this Demo
// is self-contained — the point this time is the typed hooks, not the slice.
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    incremented(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
  },
});

const { incremented } = counterSlice.actions;

function makeStore() {
  return configureStore({ reducer: { counter: counterSlice.reducer } });
}

type AppStore = ReturnType<typeof makeStore>;
type RootState = ReturnType<AppStore["getState"]>;
type AppDispatch = AppStore["dispatch"];

// The typed-hooks pattern: wrap the raw react-redux hooks once, per-store,
// so every call site gets inference instead of writing this state's shape
// out by hand at every useSelector call.
const useAppDispatch: () => AppDispatch = useDispatch;
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function CounterReadout() {
  // No annotation needed — useAppSelector already knows `state.counter.value`
  // exists and is a number.
  const value = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => dispatch(incremented(-1))}
        className="rounded-md border border-black/[.15] px-3 py-1.5 text-sm font-medium dark:border-white/[.2]"
      >
        −1
      </button>
      <span className="min-w-[2ch] text-center text-lg font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => dispatch(incremented(1))}
        className="rounded-md border border-black/[.15] px-3 py-1.5 text-sm font-medium dark:border-white/[.2]"
      >
        +1
      </button>
    </div>
  );
}

function LocalStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);
  return <Provider store={store}>{children}</Provider>;
}

export function SelectorDispatchDemo() {
  return (
    <LocalStoreProvider>
      <CounterReadout />
    </LocalStoreProvider>
  );
}
