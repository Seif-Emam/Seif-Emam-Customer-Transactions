



//============Check My Api ====== ///

async function getData() {
    const api = 'JS/data.json';
    try {
        let response = await fetch(api);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let data = await response.json();
        initialData(data.customers, data.transactions); // Call to start app
        createChart(data.transactions); // Call to create chart
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}
             
function initialData(customers, transactions) {
    const container = document.getElementById('transactionTableBody');
    const customerFilter = document.getElementById('customerName');
    const amountFilter = document.getElementById('transactionAmount');

    // Display initial data
    displayData(customers, transactions, container);

    // Add event listeners for filtering with slight delay
    let timeout;
    customerFilter.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            filterData(customers, transactions, container);
            updateChart(transactions); // Update chart on filter
        }, 300);
    });
    amountFilter.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            filterData(customers, transactions, container);
            updateChart(transactions); // Update chart on filter
        }, 300);
    });
}
 
//============Display Data ====== ///


function displayData(customers, transactions, container) {
    container.innerHTML = '';
    let cartona = '';
    transactions.forEach(transaction => {
        const customer = customers.find(cust => cust.id === transaction.customer_id);
        if (customer) {
            cartona += `
                <tr>
                    <td>${transaction.customer_id}</td>
                    <td class="customer-name">${customer.name}</td>
                    <td>${transaction.id}</td>
                    <td>${transaction.date}</td>
                    <td>$${transaction.amount}</td>
                </tr>
            `;
        }
    });
    container.innerHTML = cartona;
}
 

//============Filter  data  ====== ///

function filterData(customers, transactions, container) {
    const nameFilter = document.getElementById('customerName').value.toLowerCase();
    const amountFilter = document.getElementById('transactionAmount').value;
    container.innerHTML = '';

    transactions.forEach(transaction => {
        const customer = customers.find(cust => cust.id === transaction.customer_id);
        const nameMatch = customer.name.toLowerCase().includes(nameFilter);
        const amountMatch = amountFilter ? transaction.amount == amountFilter : true;

        if (nameMatch && amountMatch) {
            const cartona = `
                <tr>
                    <td>${transaction.customer_id}</td>
                    <td>${customer.name}</td>
                    <td>${transaction.id}</td>
                    <td>${transaction.date}</td>
                    <td>$${transaction.amount}</td>
                </tr>
            `;
            container.innerHTML += cartona;
        }
    });
}
            


function createChart(transactions) {
    const ctx = document.getElementById('transactionChart').getContext('2d');

    // Extracting transaction amounts for the chart
    const amounts = transactions.map(transaction => transaction.amount);

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: transactions.map(transaction => transaction.id),
            datasets: [{
                label: 'Transaction Amounts ($)',
                data: amounts,
                backgroundColor: 'rgba(255, 255, 255, 1)', // White background with transparency
                borderColor: 'rgba(255, 255, 255, 1)', // White border
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: 'white' // White font color for x-axis labels
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: 'rgba(255, 255, 255, 0.1)', // Light white grid lines
                        lineWidth: 3
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: 'white', // White font color for y-axis labels
                        callback: function(value, index, values) {
                            return '$' + value;
                        }
                    }
                }]
            },
            legend: {
                display: false // Hide the legend for simplicity
            },
            tooltips: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark background for tooltips
                titleFontColor: 'white', // White font color for tooltip title
                bodyFontColor: 'white', // White font color for tooltip body
                callbacks: {
                    label: function(tooltipItem, data) {
                        return '$' + tooltipItem.yLabel.toFixed(2);
                    }
                }
            }
        }
    });

    return chart;
}

function updateChart(transactions) {
    const chart = createChart(transactions); // Recreate the chart with updated data
    // Optionally, you can return the chart object or manage it globally for further updates.
}
getData();
