/**
 * minimize files
 * 1. images
 * 2. text files
 */

import minifyImage from './minifyImage'


window.addEventListener('load', () => {

  const input = document.querySelector('.input')
  const image : HTMLImageElement = document.querySelector('.image')
  
  console.log(input)
  input.addEventListener('change', async (event) => {
    const [file] = event.target.files
    const a: string = await minifyImage(file)
    image.src = a
    console.log(a)
  })
})


export {
  minifyImage
}

export default {
  minifyImage
}