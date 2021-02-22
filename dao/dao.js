import fs from 'fs'
import path from 'path'

const encoding = 'utf-8';
/**
 * async write to the file if the file exits, else create the file and then write to it
 * utilises promises from fs module
 * 
 * @param {*} data : data to save
 */
async function writeData(fileName, data) {
    try {
        return await fs.promises.writeFile(path.resolve(fileName), JSON.stringify(data), {
            encoding: encoding
        })
    } catch (error) {
        throw new Error(error.toString())
    }
}

/**
 * async read for file data utilising promises from fs module
 * and creates the file, if the file doesn't exist
 * 
 * @param {*} fileName : fileName
 * 
 * @returns fileData or Empty array
 */
async function readData(fileName) {
    try {
        let data = await fs.promises.readFile(path.resolve(fileName), {
            encoding: encoding
        });
        return JSON.parse(data)
    } catch (error) {
        fs.openSync(path.resolve(fileName), 'w');
        return Array.of();
    }
}

export {
    writeData,
    readData
}