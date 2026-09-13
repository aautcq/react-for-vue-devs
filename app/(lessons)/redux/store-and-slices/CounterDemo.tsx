"use client";

import { useState, type ReactNode } from "react";
import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

// A tiny standalone slice, just for this Demo — the Running Example's real
// todoUi slice doesn't show up until "A Filter Slice for the Todo List".
type CounterState = { value: number };
const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    // Looks like direct mutation, but createSlice wraps every reducer in
    // Immer: `state.value += ...` produces a brand-new immutable state
    // object under the hood, it just reads like plain JS.
    incremented(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
    reset(state) {
      state.value = 0;
    },
  },
});

const { incremented, reset } = counterSlice.actions;

function makeCounterStore() {
  return configureStore({ reducer: { counter: counterSlice.reducer } });
}

type CounterRootState = ReturnType<ReturnType<typeof makeCounterStore>["getState"]>;

function CounterButtons() {
  const value = useSelector((state: CounterRootState) => state.counter.value);
  const dispatch = useDispatch();

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
      <button
        type="button"
        onClick={() => dispatch(reset())}
        className="ml-2 rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-zinc-900"
      >
        Reset
      </button>
    </div>
  );
}

function LocalStoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeCounterStore);
  return <Provider store={store}>{children}</Provider>;
}

export function CounterDemo() {
  return (
    <LocalStoreProvider>
      <CounterButtons />
    </LocalStoreProvider>
  );
}
