const IncludesIgnoreCase = require("./StringIncludesIgnoreCase")

const sortByName = function(a, b, desc){
    if(a.fullName < b.fullName) { return -1 * desc; }
    if(a.fullName > b.fullName) { return 1 * desc; }
    return 0;
}

const sortByNumber = function(a, b, desc){
    return (a - b) * desc;
}

const findUser = (filters , users, courses,specializations) => {
    console.log(filters)
    let res = []
    users.map(x => {
        if (x === undefined) return false
        const filtCourses = courses.filter(course => IncludesIgnoreCase(course.student,x.fullName))
        const specsFilt = specializations.filter(course => IncludesIgnoreCase(course.student,x.fullName))

        const name = IncludesIgnoreCase(x.fullName,filters.name)
        const crs = (
            filters.courses.some(elem => filtCourses.find(course => course.courseName === elem)))
        const specs = (
            filters.specializations.some(elem => specsFilt.find(spec => spec.specializationName === elem)))

        if (name &&  (crs || specs) || (name && filters.specializations.length == 0 && filters.courses.length == 0 )) {
            res.push({
                fullName: x.fullName,
                group: x.group,
                averageHours: filtCourses.length === 0 ? 0 : filtCourses.map(course => course.learningHours).reduce((a,b) => a +b , 0) / filtCourses.length,
                averageGrade: filtCourses.length === 0 ? 0 : filtCourses.map(course => course.grade).reduce((a,b) => a +b , 0) / filtCourses.length,
            })
        }
        return name &&  crs ||  specs
    })
    const desc = filters.isDescending ? -1 : 1;
    switch (filters.orderBy) {
        case "hours":
            console.log("ordering by hours");
            return res.sort((a,b) =>  sortByNumber(a.averageHours,b.averageHours, desc))
        case "grade":
            console.log("ordering by grade");
            return res.sort((a,b) => sortByNumber(a.averageGrade, b.averageGrade, desc))
        case "name":
            console.log("ordering by name");
            return res.sort((a, b) => sortByName(a,b,desc))
    }
    return res;   
}

module.exports = findUser;