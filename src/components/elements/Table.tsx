import { useState } from "react";
import { FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface TableProps {
  thead: string[];
  tbody: { [key: string]: string }[];
  onClickDelete?: (id: string) => void;
}

function Table({ thead, tbody, onClickDelete }: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Hitung total halaman
  const totalPages = Math.ceil(tbody.length / itemsPerPage);

  // Ambil data untuk halaman saat ini
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tbody.slice(indexOfFirstItem, indexOfLastItem);

  // Fungsi untuk pindah halaman
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate nomor halaman yang akan ditampilkan
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Tampilkan semua halaman jika total halaman <= 5
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logika untuk menampilkan halaman dengan ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-box border border-base-content/10 bg-base-100">
        <table className="table table-zebra">
          {/* head */}
          <thead className="bg-[#E6EAFB]">
            <tr>
              {thead.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, rowIndex) => {
              const values = Object.values(row);
              const lastIndex = values.length - 1;
              const id = row.Aksi;
              return (
                <tr key={rowIndex}>
                  {values.map((cell, cellIndex) => (
                    <td key={cellIndex} className="align-middle">
                      {cellIndex === lastIndex ? (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm btn-circle text-error"
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            if (onClickDelete) onClickDelete(id);
                          }}
                        >
                          <FaTrash />
                        </button>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* Tombol Previous */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="btn btn-sm btn-circle"
          >
            <FaChevronLeft />
          </button>

          {/* Nomor Halaman */}
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && goToPage(page)}
              disabled={page === "..."}
              className={`btn btn-sm ${
                currentPage === page
                  ? "btn-primary"
                  : page === "..."
                  ? "btn-disabled"
                  : "btn-ghost"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Tombol Next */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="btn btn-sm btn-circle"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Info Halaman */}
      {tbody.length > 0 && (
        <div className="text-center text-sm text-base-content/70">
          Menampilkan {indexOfFirstItem + 1} -{" "}
          {Math.min(indexOfLastItem, tbody.length)} dari {tbody.length} data
        </div>
      )}
    </div>
  );
}

export default Table;
