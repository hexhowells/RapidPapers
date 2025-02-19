import React from 'react';

function Pagination({ pageNum, setPageNum, numPages }) {
    const firstPage = 1;
    const lastPage = numPages;
    const startPage = Math.max(firstPage, pageNum - 2);
    const endPage = Math.min(lastPage, pageNum + 2);

    // Update page on change
    const handlePageChange = (page, event) => {
        event.preventDefault(); // Prevent the default link behavior
        setPageNum(page);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    // Goto next page
    const handleNext = (event) => {
        event.preventDefault(); // Prevent default link behavior
        if (pageNum < lastPage) handlePageChange(pageNum + 1, event);
    };

    // Goto previous page
    const handlePrev = (event) => {
        event.preventDefault(); // Prevent default link behavior
        if (pageNum > firstPage) handlePageChange(pageNum - 1, event);
    };

    // Get number of pages to display on the bottom of the screen
    let pages = [];
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
                <li className={`page-item ${pageNum === firstPage ? 'disabled' : ''}`}>
                    <a className="page-link" href="/#" onClick={handlePrev}>Previous</a>
                </li>

                <li className={`page-item ${firstPage === pageNum ? 'active' : ''}`}>
                    <a className="page-link" href="/#" onClick={(e) => handlePageChange(firstPage, e)}>
                        {firstPage}
                    </a>
                </li>

                {startPage > firstPage + 1 && <li className="page-item"><span className="page-link">...</span></li>}

                {pages.map(page =>
                    page !== firstPage && page !== lastPage && (
                        <li className={`page-item ${page === pageNum ? 'active' : ''}`} key={page}>
                            <a className="page-link" href="/#" onClick={(e) => handlePageChange(page, e)}>
                                {page}
                                {page === pageNum && <span className="sr-only"></span>}
                            </a>
                        </li>
                    )
                )}

                {endPage < lastPage - 1 && <li className="page-item"><span className="page-link">...</span></li>}

                <li className={`page-item ${lastPage === pageNum ? 'active' : ''}`}>
                    <a className="page-link" href="/#" onClick={(e) => handlePageChange(lastPage, e)}>
                        {lastPage}
                    </a>
                </li>

                <li className={`page-item ${pageNum === lastPage ? 'disabled' : ''}`}>
                    <a className="page-link" href="/#" onClick={handleNext}>Next</a>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;
