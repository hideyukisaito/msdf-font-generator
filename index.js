const generateBMFont = require('msdf-bmfont-xml')
const fs = require('fs')
const path = require('path')

if (2 === process.argv.length) {

  console.log('Usage: node ./index.js sourceFileName fontFileName fontSize ')
  return

}

const sourceTextFileName = process.argv[2]
const fontFileName = process.argv[3]
const fontSize = process.argv[4]

console.log('source file: ' + sourceTextFileName)
console.log('font file: ' + fontFileName)
console.log('font size: ' + fontSize)

fs.readFile(sourceTextFileName, { encoding: 'utf8' }, (err, result) => {

  if (err) {

    throw err

  }

  generateBMFont(fontFileName, {

    charset: result,
    roundDecimal: 6,
    fontSize: fontSize,
    textureSize: [4096, 4096],
    outputType: 'json',
    pot: true,
    distanceRange: 4,

  }, (error, textures, font) => {

    if (error) throw error;

    const prefix = path.join(__dirname, 'export', Date.now().toString()) 

    try {

      fs.statSync(prefix)

    } catch (e) {

      fs.mkdirSync(prefix)

    }

    textures.forEach((texture, index) => {

      let filename = texture.filename.split('/').pop()
      
      fs.writeFile(prefix + '/' + filename + '.png', texture.texture, (err) => {

        if (err) throw err;

        console.log('texture is saved in ' + prefix + '/' + filename + '.png')

      })

    })

    let filename = font.filename.split('/').pop()
    
    fs.writeFile(prefix + '/' + filename, font.data, (err) => {

      if (err) throw err;

      console.log('fnt file is saved in ' + prefix + '/' + filename)

    })

  })

})