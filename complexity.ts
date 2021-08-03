const cognitiveAnalysis = require("cognitive-complexity-ts/build/src/cognitive-complexity/output");
const Table = require("console-table-printer").Table;
const fs = require("fs");

function getFiles(path: any) {
    const entries = fs.readdirSync(path, { withFileTypes: true });

    // Get files within the current directory and add a path key to the file objects
    const files = entries
        .filter((file: any) => !file.isDirectory())
        .map((file: any) => ({ ...file, path: path + file.name }));

    // Get folders within the current directory
    const folders = entries.filter((folder: any) => folder.isDirectory());

    for (const folder of folders)
        /*
          Add the found files within the subdirectory to the files array by calling the
          current function itself
        */
        files.push(...getFiles(`${path}${folder.name}/`));

    return files;
}

function getColor(score: number): string {
    if (score >= 15)
        return 'red';
    if (score >= 10)
        return 'yellow';
    return 'green';
}

function printResults(results: Array<any>) {
    const p = new Table({
        columns: [
            { name: 'file', alignment: 'left', title: 'File' },
            { name: 'score', title: 'Score' }
        ]
    });

    let lastScore = -1;
    results.sort((a, b) => a.score - b.score);
    for (let i = 0; i < results.length - 1; i++) {
        let needsSeparator = false;
        
        if (lastScore > -1 && i < results.length - 1 && lastScore < results[i + 1].score) {
            needsSeparator = true;
        }

        lastScore = results[i + 1].score;

        p.addRow(results[i], { bottomBorder: needsSeparator, color: getColor(results[i].score) });
    }

    p.printTable();
}

let files = getFiles("./src/");
let expectedCount = files.length;
let results = new Array<any>();

files.forEach((file: any) => {
    cognitiveAnalysis.getFileOrFolderOutput(file.path).then((analysis: any) => {
        results.push({ file: file.path, score: analysis.score });
        --expectedCount;
        if (expectedCount == 0) {
            printResults(results);
        }
    }).catch((err: any) => {
        --expectedCount;
        if (expectedCount == 0) {
            printResults(results);
        }
    });
});