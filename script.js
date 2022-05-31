let my_chart;
const BLUE_COLOR = "rgb(83, 131, 236)";
const RED_COLOR = 'rgb(216, 81, 64)'

function controller() {
    const PAYMENT_PERIOD = Number(document.querySelector('#payment-period').value);
    const MAKE_NUM = Number(document.querySelector('#make-num').value);

    if (my_chart) {
        my_chart.destroy();
        deleteTableRow();
    }

    let sales_data = makeSalesList(MAKE_NUM);
    let payment_data = makePaymentList(PAYMENT_PERIOD);

    my_chart = makeChart(sales_data.slice(0,7), payment_data.slice(0,7));
    makeTable(sales_data, payment_data);

    let id_cross_point = document.querySelector("#cross-point")
    id_cross_point.innerHTML = crossPoint(sales_data, payment_data);
    id_cross_point.style.color = BLUE_COLOR;
    
    let id_half_year = document.querySelector("#half-year");
    id_half_year.innerHTML = (Math.round((sales_data[6] - payment_data[6]) / 1000) / 10);
    id_half_year.style.color = BLUE_COLOR;

    let id_first_year = document.querySelector("#first-year");
    id_first_year.innerHTML = (Math.round((sales_data[12] - payment_data[12]) / 1000) / 10);
    id_first_year.style.color = BLUE_COLOR;

    let id_fixed = document.querySelector("#fixed");
    id_fixed.innerHTML = 9;
}

function makeSalesList(make_num) {
    sales_data = [0,0,30000,90000];
    for (let i = 1; i <= 9; i++) {
        let sales = sales_data.slice(-1)[0] + 15000 * make_num;
        sales_data.push(sales);
    }
    return sales_data;
}

function makePaymentList(payment_period) {
    let payment_data = [];
    switch (payment_period) {
        case 1:
            payment_data.push(275000, 275000, 275000);
            break;
        case 2:
            payment_data.push(137500, 275000, 275000);
            break;
        case 3:
            payment_data.push(91670, 183340, 275010);
            break;
    }
    for (let i = 1; i <= 10; i++) {
        let payment = payment_data.slice(-1)[0] + 33000;
        payment_data.push(payment);
    }
    return payment_data;
}

function makeTable(sales_list, payment_list) {
    let table = document.querySelector('table');
    let thead = document.querySelector('thead');
    let tbody = document.querySelector('tbody');

    // 表の中身
    for (let i = 0; i <= 12; i++) {
        let row = document.createElement('tr');
        let row_data_1 = document.createElement('td');
        row_data_1.innerHTML = i + "ヶ月";
        row_data_1.classList.add("text-center");
        let row_data_2 = document.createElement('td');
        row_data_2.innerHTML = payment_list[i].toLocaleString();
        let row_data_3 = document.createElement('td');
        row_data_3.innerHTML = sales_list[i].toLocaleString();
        let row_data_4 = document.createElement('td');
        row_data_4.innerHTML = (sales_list[i] - payment_list[i]).toLocaleString();

        if (i == 6 || i == 12) {
            row.classList.add("bg-warning");
            row_data_4.style.color = BLUE_COLOR;
            row_data_4.style.fontWeight = "bold";
        }
        row.appendChild(row_data_1);
        row.appendChild(row_data_2);
        row.appendChild(row_data_3);
        row.appendChild(row_data_4);
        tbody.appendChild(row);
    }
}

function makeChart(sales_list, payment_list) {
    let ctx = document.getElementById("myChart").getContext('2d');

    ctx.canvas.height = "100%";

    let sales_data = sales_list;
    let payment_data = payment_list;
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [0,1,2,3,4,5,6],
            datasets: [{
                label: '売上',
                data: sales_data,
                backgroundColor: [
                    BLUE_COLOR
                ],
                borderColor: [
                    BLUE_COLOR
                ],
                borderWidth: 2,
                datalabels: {
                    color: BLUE_COLOR,
                    font: {
                        weight: 'bold',
                        size: 16
                    },
                    align: '-135',
                    anchor: 'end',
                }
            },
            {
                label: '支払い',
                data: payment_data,
                backgroundColor: [
                    RED_COLOR
                ],
                borderColor: [
                    RED_COLOR
                ],
                borderWidth: 2,
                datalabels: {
                    color: RED_COLOR,
                    font: {
                        weight: 'bold',
                        size: 16
                    },
                    align: '-135',
                    anchor: 'end',
                }
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '時間（ヶ月）',
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '金額（円）'
                    }
                }
            }
        },
        plugins: [ChartDataLabels],
    });
    
    return myChart;
}

function deleteTableRow() {
    let table = document.querySelector("table");
    while (table.rows.length > 1) {
        table.deleteRow(-1);
    }
}

function crossPoint(sales_data, payment_data) {
    let line1 = {
        start : {
            x : 3,
            y : sales_data[3]
        },
        end : {
            x : 12,
            y : sales_data[12]
        }
    };
    let line2 = {
        start : {
            x : 3,
            y : payment_data[3]
        },
        end : {
            x : 12,
            y : payment_data[12]
        }
    };

	let x0 = line1.start.x,
        y0 = line1.start.y,
        x1 = line1.end.x,
        y1 = line1.end.y,
        x2 = line2.start.x,
        y2 = line2.start.y,
        x3 = line2.end.x,
        y3 = line2.end.y;

	let a0 = (y1 - y0) / (x1 - x0),
        a1 = (y3 - y2) / (x3 - x2);

	let x = (a0 * x0 - y0 - a1 * x2 + y2) / (a0 - a1),
	    y = (y1 - y0) / (x1 - x0) * (x - x0) + y0;

	if (Math.abs(a0) === Math.abs(a1)) return false;

	if (x > Math.max(x0, x1) || x > Math.max(x2, x3) ||
		y > Math.max(y0, y1) || y > Math.max(y2, y3) ||
		x < Math.min(x0, x1) || x < Math.min(x2, x3) ||
		x < Math.min(x0, x1) || y < Math.min(y2, y3) ) return false;

	return (Math.round(x * 10) / 10);
};