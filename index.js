const fs = require("fs")
const path = require("path")
const ObjectsToCsv = require('objects-to-csv');
const {KalmanFilter} = require('kalman-filter');
const FILE_NAME = "kmou_dataset009-1.csv"


const csvPath = path.join(__dirname,FILE_NAME);
const csv = fs.readFileSync(csvPath,"utf-8")
const rows = csv.split("\r\n")
const kf = new KalmanFilter();
for (let i=1; i<=7; i++) 
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
            const title = columnTitle[index]
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


let x_data = []; 
for(let e in results ){
    x_data.push(results[e].x)
}
let y_data = []; 
for(let e in results ){
    y_data.push(results[e].y)
}
let z_data = []; 
for(let e in results ){
    z_data.push(results[e].z)
}
x_data = kf.filterAll(x_data)
y_data = kf.filterAll(y_data)
z_data = kf.filterAll(z_data)

// let recursion = 0
// results.map((e) =>{
    

for (let i in results){
    results[i].x = x_data[i][0]
    results[i].y = y_data[i][0]
    results[i].z = z_data[i][0]
}

console.log(results)
// })
// console.log(realResult)
async function makeCSV () {
    const Rcsv = new ObjectsToCsv(results);
   
    // Save to file:
    await Rcsv.toDisk('./kalman_dataset009.csv',{allColumns: true});
   
    // Return the CSV file as string:
    console.log(await Rcsv.toString());
  };
  makeCSV()