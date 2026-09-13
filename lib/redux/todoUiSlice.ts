/**
 * Client-only UI state for the Todo Running Example: which filter is
 * active, and which todo IDs have a mutation in flight. Deliberately
 * does NOT hold the todos themselves — those stay server state, owned
 * by Server Actions / TanStack Query / tRPC depending on the lesson. See
 * the "Where Redux Stops" lesson and CONTEXT.md's Client State entry.
 */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TodoFilter = "all" | "active" | "done";

type TodoUiState = {
  filter: TodoFilter;
  pendingIds: string[];
};

const initialState: TodoUiState = {
  filter: "all",
  pendingIds: [],
};

const todoUiSlice = createSlice({
  name: "todoUi",
  initialState,
  reducers: {
    filterChanged(state, action: PayloadAction<TodoFilter>) {
      state.filter = action.payload;
    },
    pendingStarted(state, action: PayloadAction<string>) {
      if (!state.pendingIds.includes(action.payload)) {
        state.pendingIds.push(action.payload);
      }
    },
    pendingEnded(state, action: PayloadAction<string>) {
      state.pendingIds = state.pendingIds.filter((id) => id !== action.payload);
    },
  },
});

export const { filterChanged, pendingStarted, pendingEnded } = todoUiSlice.actions;
export const todoUiReducer = todoUiSlice.reducer;
