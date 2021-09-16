const exceljs = require('exceljs');
const {Specialization} = require('./Specialization');
const {findByName} = require('./Specialization');
const {findByStudentAndUniversity} = require('./Course')

const unloadBySpecialization = async (specializationName) => {

    const workbook = new exceljs.Workbook();
    const workSheet = workbook.addWorksheet("Выгрузка с Coursera");
    const specializations = await findByName(specializationName);
    if (specializations.length == 0) {
        return;
    }
    let courses = [];
    for (let i = 0; i < specializations.length; i++) {
        let studentCourses = await findByStudentAndUniversity(specializations[i].student, specializations[i].university);
        courses.push(studentCourses);
    }
    const courseNames = courses.sort(sortFunc)[courses.length - 1].map(course => course.courseName);
    workSheet.columns = [{
        header: "ФИО Ученика",
        key: "fio"
    }];
    for (let i = 0; i < courseNames.length; i++) 
    {
        const column = {
            header: courseNames[i],
            key: courseNames[i]
        }
        workSheet.columns = [...workSheet.columns, column]
    }
    for (let i = 0; i < specializations.length; i++) 
    {
        const courses = await findByStudentAndUniversity(specializations[i].student, specializations[i].university);
        let row = {
            fio: specializations[i].student
        }
        for (let k = 0; k < courseNames.length; k++) 
        {
            const course = courses.find(crs => crs.courseName == courseNames[k])
            if (!course) {
                row[courseNames[k]] = "Не проходил(а)"
            }
            else {
                row[courseNames[k]] = course.isCompleted ? 100 : 0
            }
        }
        workSheet.addRow(row);
    }
    await workbook.xlsx.writeFile("files/Specialization.xlsx");
    
}

module.exports = unloadBySpecialization;

const sortFunc = (a, b) => {
    if (a.length > b.length) {
      return 1;
    }
    if (a.length < b.length) {
      return -1;
    }
    // a должно быть равным b
    return 0;
  }