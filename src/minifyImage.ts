export const OUTPUT_BASE64 = 'base64'
export const OUTPUT_BLOB = 'blob'

interface BrowserMinifyImageOptions {
  mimeType?: string;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  outputType?: string;
}

interface FileLoadEventTarget extends EventTarget {
  result: string
}

interface Image extends HTMLImageElement {
  mimeType: string
}


declare function browserMinifyImageMinifyCallback(data: any): void


const createFileReader = (file: File) => {
  return new Promise((resolve, reject) => {
    if (file) {
      const fileReader = new FileReader()
      fileReader.addEventListener('load', resolve)
      fileReader.readAsDataURL(file)
    } else {
      reject()
    }
  })
}


const onFileRead = (event: ProgressEvent) => {
  return new Promise((resolve, reject) => {
    if (event.target) {
      const image = new Image()
      image.onload = resolve
      image.onabort = reject
      image.onerror = reject
      image.src = (<FileLoadEventTarget>event.target).result
    } else {
      reject()
    }
  })
}

const onImageLoad = (event: Event, minifyOptions: BrowserMinifyImageOptions ={}) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (context) {
      const image = <Image>event.target
      const { width, height, mimeType: originMimeType }= image
      const {
        mimeType = originMimeType,
        maxWidth = 500,
        maxHeight = 500,
        outputType,
        quality
      } = minifyOptions
      let targetWidth = width
      let targetHeight = height;
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth * (height / width));
        } else {
          targetHeight = maxHeight;
          targetWidth = Math.round(maxHeight * (width / height));
        }
      }
      canvas.width = targetWidth
      canvas.height = targetHeight
      context.drawImage(image, 0, 0, targetWidth, targetHeight)
      if (outputType === OUTPUT_BLOB) {
        canvas.toBlob(<any>resolve, mimeType, quality)
      } else {
        const dataURL = canvas.toDataURL(mimeType, quality)
        resolve(dataURL)
      }
    } else {
      reject()
    }
  })
}

const minifyImage = async (file: File, options: BrowserMinifyImageOptions) => {
  const progressEvent = await createFileReader(file)
  const imageLoadEvent = await onFileRead(<ProgressEvent>progressEvent)
  return onImageLoad(<Event>imageLoadEvent, options)
}

export default minifyImage
