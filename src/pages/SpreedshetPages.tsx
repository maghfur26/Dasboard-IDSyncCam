import { useEffect, useState } from "react";
import ListButton from "../components/elements/ListButton";
import Table from "../components/elements/Table";
import Search from "../components/elements/Search";
import api from "../api/axiosInstance";

interface Peserta {
  id: string;
  fullName: string;
  asalSekolah: string;
  tglLahir: Date;
  usia: string;
  createdAt?: string;
}

interface GroupedData {
  bulan: string;
  jumlah: number;
  peserta: Peserta[];
}

function SpreedshetPages() {
  const [daftarPeserta, setDaftarPeserta] = useState<Peserta[]>([]);
  const [filteredPeserta, setFilteredPeserta] = useState<Peserta[]>([]);
  const [groupedData, setGroupedData] = useState<GroupedData[]>([]);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("semua");
  const [loading, setLoading] = useState(false);

  // Fungsi untuk mendapatkan nama bulan saat ini
  const getCurrentMonth = () => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const currentDate = new Date();
    return months[currentDate.getMonth()];
  };

  // Fetch data peserta
  const fetchPeserta = async () => {
    try {
      setLoading(true);
      const response = await api.get("/peserta", {
        params: { groupByMonth: true },
      });

      if (response.data.success) {
        setGroupedData(response.data.data);

        // Gabungkan semua peserta untuk tampilan "semua"
        const allPeserta = response.data.data.flatMap(
          (item: GroupedData) => item.peserta
        );
        setDaftarPeserta(allPeserta);

        // Set default ke bulan ini
        const currentMonth = getCurrentMonth();
        const currentMonthData = response.data.data.find(
          (item: GroupedData) => item.bulan === currentMonth
        );

        if (currentMonthData) {
          setFilteredPeserta(currentMonthData.peserta);
          setSelectedMonth(currentMonth);
        } else {
          setFilteredPeserta(allPeserta);
          setSelectedMonth("semua");
        }
      }
    } catch (error) {
      console.error("Error fetching peserta:", error);
      setDaftarPeserta([]);
      setFilteredPeserta([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle perubahan bulan
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = e.target.value;
    setSelectedMonth(month);

    if (month === "semua") {
      setFilteredPeserta(daftarPeserta);
    } else {
      const monthData = groupedData.find((item) => item.bulan === month);
      setFilteredPeserta(monthData ? monthData.peserta : []);
    }
  };

  // Filter berdasarkan search
  const getFilteredData = () => {
    if (!search) return filteredPeserta;

    return filteredPeserta.filter(
      (peserta) =>
        peserta.fullName.toLowerCase().includes(search.toLowerCase()) ||
        peserta.asalSekolah.toLowerCase().includes(search.toLowerCase())
    );
  };

  useEffect(() => {
    fetchPeserta();
  }, []);

  const displayedData = getFilteredData();

  return (
    <div className="my-10 mx-6">
      <h1 className="font-thin font-poppins text-[#939393] text-3xl mb-5">
        Sheet
      </h1>

      {/* Pass selectedMonth dan filteredPeserta ke ListButton */}
      <ListButton
        selectedMonth={selectedMonth}
        filteredPeserta={filteredPeserta}
      />

      <div className="flex flex-col gap-4">
        {/* Filter dan Search Row */}
        <div className="flex justify-between items-center mt-6 gap-4">
          {/* Dropdown Filter Bulan */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Filter Bulan:
            </label>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="select select-bordered select-sm w-48"
              disabled={loading}
            >
              <option value="semua">Semua Bulan</option>
              {groupedData.map((item) => (
                <option key={item.bulan} value={item.bulan}>
                  {item.bulan} ({item.jumlah})
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <Search value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Info dan Stats */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Menampilkan:{" "}
            <span className="font-semibold">{displayedData.length}</span>{" "}
            peserta
            {selectedMonth !== "semua" && (
              <span className="ml-2 text-primary">({selectedMonth})</span>
            )}
          </div>
          {search && (
            <div className="text-gray-500">Hasil pencarian: "{search}"</div>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : displayedData.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Tidak ada data peserta</p>
            {selectedMonth !== "semua" && (
              <p className="text-sm mt-2">untuk bulan {selectedMonth}</p>
            )}
          </div>
        ) : (
          <Table
            thead={["No", "Nama Lengkap", "Asal Sekolah", "Usia", "Aksi"]}
            tbody={displayedData.map((peserta: Peserta, index: number) => ({
              No: (index + 1).toString(),
              "Nama Lengkap": peserta.fullName,
              "Asal Sekolah": peserta.asalSekolah,
              Usia: peserta.usia,
              Aksi: peserta.id,
            }))}
          />
        )}
      </div>
    </div>
  );
}

export default SpreedshetPages;
