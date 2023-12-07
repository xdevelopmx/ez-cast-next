export function separateNameAndSurname(fullName: string) {
    // Split the full name into words
    const words = fullName.split(' ');

    // The first element is the first name
    const firstName = words[0];

    // Check if there is more than one name
    if (words.length > 1) {
        // The second element is the middle name if there are more than two words, otherwise it is part of the first name
        const middleName = words.length > 2 ? words[1] : null;

        // The last element and any subsequent elements are the surnames
        const surnames = words.slice(words.length > 2 ? 2 : 1).join(' ');

        // Return an object with the first name, middle name (if it exists), and surnames
        return {
            firstName: firstName,
            middleName: middleName,
            surnames: surnames
        };
    } else {
        // If there is only one name, there is no middle name or surnames
        return {
            firstName: firstName,
            middleName: null,
            surnames: null
        };
    }
}
