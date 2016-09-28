import * as fs from 'fs'
import * as path from 'path'
import * as mocha from 'mocha'

let baseDir:string = path.join(__dirname, '../');

let tree = {}

function ReadFolder(parentDir: string, node: any) {
    let files = fs.readdirSync(parentDir);
    files.map(file => {
        let filePath = path.join(parentDir, file);
         
        if (fs.statSync(filePath).isDirectory()) {
            ReadFolder(filePath, node[file] = {});
        }
        else {
            node[file] = file;
            //console.log(filePath);
        }
    })
}

describe('recursive', function() {
    it('recursive1', function() {

        ReadFolder(baseDir, tree);
        
        console.log(tree);

    })
})