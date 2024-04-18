function fifoPageReplacement(pages, numRows) {
    let tableData = [];
    let pageFaults = 0;
    let frame = Array(numRows).fill(null);
    let isHit = Array(pages.length).fill(false);
    for (let i = 0; i < pages.length; i++) {
        let rowData = [];
        const page = pages[i];

        // Check if the page exists in the frame
        const pageExistsIndex = frame.findIndex(item => item === page);

        if (pageExistsIndex !== -1) {
            rowData = tableData[tableData.length - 1].slice();
            isHit[i] = true;
        } else {
            // Page fault, replace or put the page in the frame
            pageFaults++;
            if (frame[numRows - 1] !== null) {
                // Column full, replace first element with the new page
                frame.shift();
                frame.push(page);
            } else {
                // Put the new page in the frame
                const firstNullIndex = frame.findIndex(item => item === null);
                frame[firstNullIndex] = page;
            }
            rowData = frame.slice();
        }

        tableData.push(rowData);
    }
    console.log(tableData);
    return { tableData, pageFaults, isHit };
}

// function createTable() {
//     const numRows = parseInt(document.getElementById("input1").value);
//     if (isNaN(numRows) || numRows <= 0) {
//         alert("Please enter a valid positive number for rows or frames.");
//         return;
//     }

//     const pageNumberList = document.getElementById("input2").value.split(',').map(Number);
//     if (pageNumberList.length === 0) {
//         alert("Please enter at least one page number.");
//         return;
//     }

//     const { tableData, pageFaults } = fifoPageReplacement(pageNumberList, numRows);

//     const table = document.createElement('table');

//     for(let i = 0; i < numRows; i++){
//         const row = document.createElement('tr');

//         for(let j = 0; j < tableData.length; j++){
//             const cell = document.createElement('td');
//             cell.textContent = tableData[j][i] === null ? "" : tableData[j][i];
//             row.appendChild(cell);
//         }

//         table.appendChild(row);
//     }

//     const resultsDiv = document.querySelector('.results-fifo');
//     // Clear previous results
//     resultsDiv.innerHTML = '';
//     resultsDiv.appendChild(table);

//     const pageFaultsDiv = document.createElement('div');
//     pageFaultsDiv.textContent = "Total page faults: " + pageFaults;
//     resultsDiv.appendChild(pageFaultsDiv);

//     console.log("Total page faults:", pageFaults);
// }
function createTable() {
    const numRows = parseInt(document.getElementById("input1").value);
    if (isNaN(numRows) || numRows <= 0) {
        alert("Please enter a valid positive number for rows or frames.");
        return;
    }

    const pageNumberList = document.getElementById("input2").value.split(',').map(Number);
    if (pageNumberList.length === 0) {
        alert("Please enter at least one page number.");
        return;
    }

    const { tableData, pageFaults, isHit } = fifoPageReplacement(pageNumberList, numRows);

    const table = document.createElement('table');

    // Create table rows
    for (let i = 0; i < numRows; i++) {
        const row = document.createElement('tr');

        // Fill cells with page numbers
        for (let j = 0; j < tableData.length; j++) {
            const cell = document.createElement('td');
            cell.textContent = tableData[j][i] === null ? "" : tableData[j][i];
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    // Create the last row with symbols
    const lastRow = document.createElement('tr');
    for (let i = 0; i < tableData.length; i++) {
        const symbolCell = document.createElement('td');
        symbolCell.textContent = isHit[i] ? "✓" : "✗";
        if(isHit[i]){
            symbolCell.style.backgroundColor = 'lightgreen';
        }
        else{
            symbolCell.style.backgroundColor = 'red';
        }
        lastRow.appendChild(symbolCell);
    }
    table.appendChild(lastRow);

    const resultsDiv = document.querySelector('.results-fifo');
    // Clear previous results
    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(table);

    const totalAccesses = pageNumberList.length;
    const pageFaultRatio = (pageFaults / totalAccesses).toFixed(2); // Round to 2 decimal places
    const pageFaultsDiv = document.createElement('div');
    pageFaultsDiv.textContent = "Total page faults: " + pageFaults + ", Page Fault Ratio: " + pageFaultRatio;
    resultsDiv.appendChild(pageFaultsDiv);

    console.log("Total page faults:", pageFaults);
}
