export async function readCsvFileContents(file) {
    let csvContents = [];
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
        const allLines = file.split('\n');

        allLines.forEach((line) => {
            csvContents.push(line);
        });
    };

    await fileReader.readAsText(file);

    return csvContents;
}