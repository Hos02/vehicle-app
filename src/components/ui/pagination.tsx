import { Button } from "@/components/ui/button"; // Assuming Button is available
import { useState } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) => {
    return (
        <div className="flex justify-center items-center gap-2 mt-4">
            <Button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Previous
            </Button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <Button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
