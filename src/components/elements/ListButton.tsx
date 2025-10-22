import { useState } from "react";
import { RiFileExcel2Line } from "react-icons/ri";
import { FaRegFilePdf } from "react-icons/fa6";
import api from "../../api/axiosInstance";

interface ListButtonProps {
  selectedMonth?: string;
  filteredPeserta?: any[];
}

function ListButton({
  selectedMonth = "semua",
  filteredPeserta = [],
}: ListButtonProps) {
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  // Fungsi untuk download file
  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Handle Export Excel
  const handleExportExcel = async () => {
    try {
      setLoadingExcel(true);

      let title = "Data Peserta";
      let shouldGroupByMonth = false;

      if (selectedMonth === "semua") {
        title = "Data Peserta - Semua Bulan";
        shouldGroupByMonth = true;
      } else {
        title = `Data Peserta - ${selectedMonth}`;
        shouldGroupByMonth = false;
      }

      const response = await api.post(
        "/export/excel",
        {
          title,
          groupByMonth: shouldGroupByMonth,
          month: selectedMonth,
        },
        {
          responseType: "blob",
        }
      );

      const filename = `data-peserta-${selectedMonth}-${Date.now()}.xlsx`;
      downloadFile(response.data, filename);

      alert("✅ Excel berhasil diexport!");
    } catch (error: any) {
      console.error("Error exporting Excel:", error);

      // Tampilkan error message yang lebih spesifik
      if (error.response?.status === 404) {
        alert(`Tidak ada data peserta untuk bulan ${selectedMonth}`);
      } else {
        alert("Gagal export Excel. Silakan coba lagi.");
      }
    } finally {
      setLoadingExcel(false);
    }
  };

  // Handle Export PDF
  const handleExportPdf = async () => {
    try {
      setLoadingPdf(true);

      let title = "Data Peserta";
      let shouldGroupByMonth = false;

      if (selectedMonth === "semua") {
        title = "Data Peserta - Semua Bulan";
        shouldGroupByMonth = true;
      } else {
        title = `Data Peserta - ${selectedMonth}`;
        shouldGroupByMonth = false;
      }

      const response = await api.post(
        "/export/pdf",
        {
          title,
          groupByMonth: shouldGroupByMonth,
          month: selectedMonth, // Kirim parameter bulan
        },
        {
          responseType: "blob",
        }
      );

      const filename = `data-peserta-${selectedMonth}-${Date.now()}.pdf`;
      downloadFile(response.data, filename);

      alert("✅ PDF berhasil diexport!");
    } catch (error: any) {
      console.error("Error exporting PDF:", error);

      // Tampilkan error message yang lebih spesifik
      if (error.response?.status === 404) {
        alert(`Tidak ada data peserta untuk bulan ${selectedMonth}`);
      } else {
        alert("Gagal export PDF. Silakan coba lagi.");
      }
    } finally {
      setLoadingPdf(false);
    }
  };

  return (
    <div>
      <div className="flex font-poppins gap-2">
        <button
          onClick={handleExportExcel}
          disabled={loadingExcel || filteredPeserta.length === 0}
          className="cursor-pointer flex items-center gap-2 bg-[#4954b6] text-white px-4 py-4 rounded hover:bg-[#4f5bc6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loadingExcel ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Exporting Excel...
            </>
          ) : (
            <>
              <RiFileExcel2Line size={20} />
              Export Excel
              {selectedMonth !== "semua" && ` (${selectedMonth})`}
            </>
          )}
        </button>
        <button
          onClick={handleExportPdf}
          disabled={loadingPdf || filteredPeserta.length === 0}
          className="cursor-pointer flex items-center gap-2 bg-[#4954b6] text-white px-4 py-4 rounded hover:bg-[#4f5bc6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loadingPdf ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Exporting PDF...
            </>
          ) : (
            <>
              <FaRegFilePdf size={20} />
              Export PDF
              {selectedMonth !== "semua" && ` (${selectedMonth})`}
            </>
          )}
        </button>
      </div>

      {filteredPeserta.length === 0 && (
        <p className="text-xs text-red-500 mt-2">
          ⚠️ Tidak ada data untuk diexport
        </p>
      )}
    </div>
  );
}

export default ListButton;
