import { useEffect, useRef, useState, useMemo } from "react";
import Baner from "../components/elements/Baner";
import Charts from "../components/elements/Chart";
import Card from "../components/elements/Card";
import api from "../api/axiosInstance";
import { usePesertaStore } from "../store/usePesertaStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HomePages = () => {
  const { pesertaList } = usePesertaStore();
  const [totalUser, setTotalUser] = useState<number>(0);
  const [totalPeserta, setTotalPeserta] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const hasFetched = useRef(false);

  const CARDS_PER_PAGE = 5;

  const monthNames = [
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

  const fetchUser = async () => {
    try {
      const users = await api.get("/users");
      setTotalUser(users.data.data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPeserta = async () => {
    try {
      const peserta = await api.get("/peserta");
      setTotalPeserta(peserta.data.data.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Hitung jumlah peserta per bulan dan buat array bulan yang memiliki peserta
  const monthlyData = useMemo(() => {
    const monthCount: { [key: string]: number } = {};

    pesertaList.forEach((peserta) => {
      const date = new Date(peserta.tglLahir);
      const monthIndex = date.getMonth();
      const monthName = monthNames[monthIndex];
      monthCount[monthName] = (monthCount[monthName] || 0) + 1;
    });

    // Konversi object menjadi array, filter, dan urutkan berdasarkan urutan bulan
    return monthNames
      .map((month) => ({
        month,
        count: monthCount[month] || 0,
      }))
      .filter((data) => data.count > 0); // Hanya tampilkan bulan yang ada pesertanya
  }, [pesertaList]);

  // Hitung total halaman
  const totalPages = Math.ceil(monthlyData.length / CARDS_PER_PAGE);

  // Ambil data untuk halaman saat ini
  const currentData = useMemo(() => {
    const startIndex = currentPage * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    return monthlyData.slice(startIndex, endIndex);
  }, [monthlyData, currentPage]);

  // Fungsi navigasi
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchPeserta();
      fetchUser();
      hasFetched.current = true;
    }
  }, []);

  // Reset ke halaman pertama jika data berubah
  useEffect(() => {
    setCurrentPage(0);
  }, [monthlyData.length]);

  return (
    <>
      <Baner />
      <section className="w-full flex flex-col lg:flex-row px-4 lg:px-10 py-4 gap-6 lg:gap-8">
        <div id="chart" className="flex-1">
          <h1 className="font-poppins text-[#969696] font-extralight text-3xl mt-10 mb-4">
            Jumlah Peserta
          </h1>
          <div className="border border-[#969696] rounded-xl h-[424px] py-2">
            <Charts />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="font-poppins text-[#969696] font-extralight text-3xl mt-10 mb-4">
            Data
          </h1>
          <div className="flex flex-col gap-4">
            <Card
              width={117}
              height={448}
              title="Total User"
              count={totalUser}
            />
            <Card
              width={117}
              height={448}
              title="Total Peserta"
              count={totalPeserta}
            />
          </div>

          {/* Container untuk cards dengan pagination */}
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {currentData.map((data, index) => (
                <Card
                  key={`${data.month}-${index}`}
                  className="bg-[#EFF6FF] flex flex-col items-center justify-center"
                  countColor="text-[#0049A7]"
                  width={120}
                  height={87}
                  title={data.month}
                  desc="Peserta"
                  count={data.count}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-poppins transition-all ${
                    currentPage === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#0049A7] text-white hover:bg-[#003580]"
                  }`}
                >
                  <ChevronLeft size={20} />
                  <span>Previous</span>
                </button>

                <span className="text-[#969696] font-poppins">
                  {currentPage + 1} / {totalPages}
                </span>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages - 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-poppins transition-all ${
                    currentPage === totalPages - 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-[#0049A7] text-white hover:bg-[#003580]"
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePages;
