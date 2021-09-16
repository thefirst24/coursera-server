const validateFullName = (name) => {
    let res = name !== "ANONYMIZED_NAME" && name !== "" && name
    return res;
}

module.exports = validateFullName
