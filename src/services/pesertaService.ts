import api from "../api/axiosInstance";

interface Peserta {
    id: string;
    fullName: string;
    tglLahir: string;
    asalSekolah: string;
    usia: number;
}

const pesertaService = {
    async deletePeserta(id: string) {
        const response = await api.delete(`/peserta/${id}`);

        return response.data.data;
    }
}

export default pesertaService