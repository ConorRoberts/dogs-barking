import create from "zustand";

interface SearchModalStoreState {
  open: boolean;
  text: string;
  setText: (value: string) => void;
  setOpen: (value: boolean) => void;
  toggleOpen: (e: globalThis.KeyboardEvent) => void;
  type: "course" | "program";
  setType: (value: "course" | "program") => void;
}

const useSearchModalStore = create<SearchModalStoreState>((set, get) => ({
  open: false,
  text: "",
  type: "course",
  setType: (value: "course" | "program") => set({ type: value }),
  setText: (value) => set({ text: value }),
  setOpen: (value) => set({ open: value, text: "" }),
  toggleOpen: (e: globalThis.KeyboardEvent) => {
    const store = get();

    // Close modal
    if (e.key === "Escape") {
      e.preventDefault();
      store.setOpen(false);
    }

    // Toggle open
    if (e.key === "k" && e.ctrlKey) {
      e.preventDefault();
      store.setOpen(!store.open);
    }
  },
}));

export default useSearchModalStore;
