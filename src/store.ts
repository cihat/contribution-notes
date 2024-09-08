import { writable } from "svelte/store";
import { Status, type State as StoreState, type UserContributions } from "./types";
import { toast } from "svelte-sonner";

const initialState: StoreState = {
  userName: "",
  userContributions: null,
  status: Status.Idle,
};

function createUserContributionStore() {
  const { subscribe, update, set } = writable<StoreState>(initialState);

  return {
    subscribe,
    setUserName: (userName: string) => {
      update((state) => ({
        ...state,
        userName,
      }));
    },
    setUserContributions: (userContributions: UserContributions) => {
      update((state) => {
        if (userContributions.years.length == 0 || userContributions.contributions.length == 0) {
          return {
            ...initialState,
            status: Status.Error,
          };
        }
        toast.success('User found successfully 🚀', {
          description: "User's contributions are fetched successfully!"
        });

        return {
          ...state,
          userContributions,
          status: Status.Success,
        };
      });
    },
    setStatus: (status: Status) => {
      update((state) => ({
        ...state,
        status,
      }));
    },
    reset: () => {
      set(initialState);
    },
  };
}

export const userStore = createUserContributionStore();
