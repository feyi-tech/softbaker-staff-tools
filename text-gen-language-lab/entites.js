function replaceEntitiesWithCharacters(text) {
    // Define a mapping of HTML entities to their corresponding characters
    const entityToCharMap = {
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">",
        "&quot;": '"',
        "&#39;": "'",
        "&#039;": "'",
        "&#x22;": '"',
        "&#x27;": "'",
        "&#60;": "<",
        "&#62;": ">",
        "&#x3C;": "<",
        "&#x3E;": ">",
        "&#x2F;": "/",
        "&#x5C;": "\\",
        "&#x60;": "`",
        "&#x25;": "%",
        "&#x3A;": ":",
        "&#x3B;": ";",
        "&#x5F;": "_",
        "&#x40;": "@"
    };

    // Use a regular expression to match and replace all entities
    return text.replace(/&[a-zA-Z0-9#]+;/g, (match) => {
        return entityToCharMap[match] || match; // Replace with corresponding character or keep unchanged
    });
}


function replaceCharactersWithEntities(text) {
    // Define a mapping of characters to their corresponding HTML entities
    const charToEntityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        "`": "&#x60;",
        "/": "&#x2F;",
        "\\": "&#x5C;",
        "%": "&#x25;",
        ":": "&#x3A;",
        ";": "&#x3B;",
        "_": "&#x5F;",
        "@": "&#x40;"
    };

    // Use a regular expression to match and replace all characters
    return text.replace(/[&<>"'`\/%:;_@]/g, (match) => {
        return charToEntityMap[match] || match; // Replace with corresponding entity or keep unchanged
    });
}
