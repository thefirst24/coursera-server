const validateFullName = (name) => {
    let res = name !== "ANONYMIZED_NAME" && name !== "" && name !== undefined && name !== null
    return res;
}

module.exports = validateFullName
