const findUser = (userName , users) => {
    if (userName === "") return []
    let result = users.filter(x => {
        if (x === undefined) return false
        return x.fullName.toLowerCase().includes(userName.toLowerCase())
    })

    return result;   
}

module.exports = findUser;