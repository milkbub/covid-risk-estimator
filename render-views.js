// this renders all the html files
// make sure that from the root directory, both these folders exist before running the script
// ./rendered-views/
// ./rendered-views/content
const pug = require('pug');
const glob = require('glob');
const datapoints = require('./data/all.js');       
const fs = require('fs').promises;

glob('views/**/*.pug', function(error, paths) {
    paths.forEach(async function(path) {

        const file = await fs.readFile(path, 'utf8');
        const content = pug.compile(file, { filename: path, pretty: true })({ data: datapoints });
        const target = path.replace('views/','').replace('.pug', '.html');
        await fs.writeFile(`rendered-views/${target}`, content);
    });
            
});
