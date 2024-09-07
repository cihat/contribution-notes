import { writable } from "svelte/store";
import { Status, type UserContributions } from "./types";

interface State {
  userName: string;
  userContributions: UserContributions;
  status: Status;
}

function createUserContributionStore() {
  const initialState: State = {
    userName: "",
    userContributions: {
      years: {},
      contributions: {}
    },
    status: Status.Idle
  };

  const store = writable<State>(initialState);

  return {
    subscribe: store.subscribe,
    setUserName: (userName: string) => {
      store.update((state) => {
        state.userName = userName;
        return state;
      });
    },
    setUserContributions: (userContributions: UserContributions) => {
      store.update((state) => {
        if (userContributions.years.length === 0 || Object.keys(userContributions.contributions).length === 0) {
          state.status = Status.Error;
        } else {
          state.userContributions = userContributions;
          state.status = Status.Success;
        }
        return state;
      });
    },
    setStatus: (status: Status) => {
      store.update((state) => {
        state.status = status;
        return state;
      });
    },
  };
}

export const userStore = createUserContributionStore();
