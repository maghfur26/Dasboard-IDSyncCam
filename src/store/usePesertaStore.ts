import {create} from "zustand";

interface Peserta {
  id: string;
  fullName: string;
  tglLahir: string;
  asalSekolah: string;
  usia: number;
}

interface PesertaState {
    pesertaList: Peserta[];
    setPesertaList: (peserta: Peserta[]) => void;
}

export const usePesertaStore = create<PesertaState>()((set) => ({
    pesertaList: [],
    setPesertaList: (peserta) => set({pesertaList: peserta})
}))