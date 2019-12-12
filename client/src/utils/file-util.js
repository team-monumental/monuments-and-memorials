/**
 * Read the contents from the CSV file into a String array
 * @param file - The CSV file to read
 * @returns {Promise<[]>} - Promise that when awaited, returns the contents of the specified file in a String array
 */
export function readCsvFileContents(file) {
    let csvContents = [];
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
        fileReader.onerror = () => {
            fileReader.abort();
            reject(new DOMException("ERROR: Unable to read the specified file."))
        };

        fileReader.onload = (event) => {
            const file = event.target.result;
            const allLines = file.split(/\n/);

            allLines.forEach((line) => {
                csvContents.push(line);
            });

            resolve(csvContents);
        };

        fileReader.readAsText(file);
    });
}