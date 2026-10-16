
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  const pages = new Set([1, totalPages]);

  for (
    let page = Math.max(1, currentPage - 1);
    page <= Math.min(totalPages, currentPage + 1);
    page++
  ) {
    pages.add(page);
  }

  const visiblePages = [...pages].sort((a, b) => a - b);

  function changePage(page) {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  }

  return (
    <nav
      aria-label="Sahifalar"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
        className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={16} />
        Oldingi
      </button>

      {visiblePages.map((page, index) => (
        <span key={page} className="flex items-center gap-2">
          {index > 0 && visiblePages[index - 1] !== page - 1 && (
            <span className="px-1">...</span>
          )}

          <button
            type="button"
            onClick={() => changePage(page)}
            aria-current={currentPage === page ? "page" : undefined}
            className={`h-9 min-w-9 rounded-md border px-3 text-sm ${
              currentPage === page
                ? "border-blue-600 bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        </span>
      ))}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
        className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
      >
        Keyingi
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
