const exceljs = require('exceljs');
const {GetStudentsWithFilters} = require('./Student')

const Unload = async () => {
    const workbook = new exceljs.Workbook();

    const sheet = workbook.addWorksheet("Выгрузка с Coursera");

    const students = await GetStudentsWithFilters({name: "", specializations:[], courses: [], orderBy:"name", isDescending: false})
    const rows = [];
    rows.push(["№", "Имя", "Курсы"]);
    for (let i = 0; i < students.length; i++) {
        rows.push([i + 1 , students[i].fullName, students[i].courses.map(course => course.courseName).join(' \n ')])
    }
    sheet.addRows(rows);
    await workbook.csv.writeFile("files/unload.csv", {encoding: 'utf8'})
    .then(() => console.log("n1ce"))
    .catch((err) => console.log(err))

    console.log("writing ended");
}

module.exports = Unload;