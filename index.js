const fs = require("fs")
const path = require("path")
const ObjectsToCsv = require('objects-to-csv');
const {KalmanFilter} = require('kalman-filter');
const kf = new KalmanFilter();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let Filename = `./kmou_dataset009`
let DownName = `./kalman_dataset009`


for(let i=1; i<=7; i++){
    A(i)
}

// async function makeCSV (results) {
//     let Rcsv = new ObjectsToCsv(results);
    
//     // Save to file:
//     await Rcsv.toDisk(`./kalman_dataset009-4.csv`,{allColumns: true});
    
//     // Return the CSV file as string:
//     // console.log(await Rcsv.toString());
//     console.log("makeCSV 함수")
// };
async function A (num){
let FILE_NAME = `${Filename}-${num}.csv`
let csvPath = path.join(__dirname,FILE_NAME);
let csv = fs.readFileSync(csvPath,"utf-8")
let rows = csv.split("\r\n")
console.log(rows.slice(0,5))
// 저장된 파일이 빈 csv파일일때, 아래것으로 실행

//let rows = csv.split("\n")

if(rows[rows.length - 1] === ''){
    
    console.log("empty")
    rows.pop()
}

let results = []
let columnTitle = []
for (const i in rows){
    const row = rows[i]
    const data = row.split(",")
    if (i === "0"){
        columnTitle = data
    } else {
        let row_data = {}
        for (const index in columnTitle) {
            const title = String(columnTitle[index])
            if(index === "1" || index === "2" || index === "3"){
            row_data[title] = data[index]
            } else {
            row_data[title] = Number(data[index])
            }
            //row_data[title] = 1
        }
        results.push(row_data)
    }
}
let Overall_data = []; 
for(let e in results ){
    Overall_data.push(results[e].Overall)
}
let Temperature_data = []; 
for(let e in results ){
    Temperature_data.push(results[e].Temperature)
}
let Humidity_data = []; 
for(let e in results ){
    Humidity_data.push(results[e].Humidity)
}
Overall_data = kf.filterAll(Overall_data)
Temperature_data = kf.filterAll(Temperature_data)
Humidity_data = kf.filterAll(Humidity_data)

// let recursion = 0
// results.map((e) =>{
    

for (let i in results){
    results[i].Overall = Overall_data[i][0]
    results[i].Temperature = Temperature_data[i][0]
    results[i].Humidity = Humidity_data[i][0]
}
console.log(results.slice(0,5))
// await makeCSV(results)
console.log(`Kalman ${FILE_NAME} ... done`)
CSV(results,num)

}


function CSV (data,i){
    const csvWriter = createCsvWriter({
        path: `${DownName}-${i}.csv`,
        header : [
            {id:`MMSI`, title: "MMSI"},
            {id:"ShipName", title: "ShipName"},
            {id:"DataInfo", title: "DataInfo"},
            {id:"x", title: "x"},
            {id:"y", title: "y"},
            {id:"z", title: "z"},
            {id:"Overall", title: "Overall"},
            {id:"Temperature", title: "Temperature"},
            {id:"Humidity", title: "Humidity"}
        ]
    })
    csvWriter.writeRecords(data)
    .then(()=>{
        console.log("Save ... Done ")
    })
}

// //

// function convertArrayOfObjectsToCSV(args) {  
//     var result, ctr, keys, columnDelimiter, lineDelimiter, data;

//     data = args.data || null;
//     if (data == null || !data.length) {
//         return null;
//     }

//     columnDelimiter = args.columnDelimiter || ',';
//     lineDelimiter = args.lineDelimiter || '\n';

//     keys = Object.keys(data[0]);

//     result = '';
//     result += keys.join(columnDelimiter);
//     result += lineDelimiter;

//     data.forEach(function(item) {
//         ctr = 0;
//         keys.forEach(function(key) {
//             if (ctr > 0) result += columnDelimiter;

//             result += item[key];
//             ctr++;
//         });
//         result += lineDelimiter;
//     });

//     return result;
// }
// function downloadCSV(args) {  
//     var data, filename, link;
//     var csv = convertArrayOfObjectsToCSV({
//         data: stockData
//     });
//     if (csv == null) return;

//     filename = args.filename || 'export.csv';

//     if (!csv.match(/^data:text\/csv/i)) {
//         csv = 'data:text/csv;charset=utf-8,' + csv;
//     }
//     data = encodeURI(csv);

// }