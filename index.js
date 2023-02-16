// import fs from "fs"
const fs = require("fs")
const {marked} = require("marked")
const config = require("./config")
const path = require("path");
const matter = require("gray-matter");
const mkdirp = require("mkdirp")
const glob = require("glob")


const readMarkedown = (filename)=> {
    const rawFile = fs.readFileSync(filename, 'utf-8')
    const parsedFile = matter(rawFile)
    const html = marked(parsedFile.content)
    return {...parsedFile,html}
}

function createtemplate(template,sourceFile){
    template = template
    .replace(/<!-- Title -->/, sourceFile.data.title)
    .replace(/<!-- Content -->/, sourceFile.html)
    .replace(/<!-- Date -->/, sourceFile.data.date);
    template.title = sourceFile.data.title

    return template
}

const savefile = (filename,content) => {
    const dir = path.dirname(filename)
    mkdirp.sync(dir)
    fs.writeFileSync(filename,content)
}

function getOutPutFileName(filename,outpath){
    const basename = path.basename(filename)
    const newFileHtml = basename.substring(0,basename.length-2) + 'html'
    const outfilePath = path.join(outpath,newFileHtml)
    return outfilePath
}

const processFile = (filename,template,outPath)=>{
    const markedownOutput = readMarkedown(filename)
    const outFileName = getOutPutFileName(filename,outPath)

    const implementedTemplate = createtemplate(
        template,
        markedownOutput
    )
    savefile(outFileName,implementedTemplate)
}

const main = ()=> {
    const srcPath =  path.join(__dirname,"src")
    const outPath = path.join(__dirname,'dist')
    const template = fs.readFileSync(path.join(srcPath,'index.html'),'utf-8')

    const filenames = glob.sync(path.join(__dirname, 'src/content/**/*.md'))

    filenames.forEach(filename => {
       return processFile(filename,template,outPath)
    });
}
main()