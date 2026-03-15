import { Jimp } from 'jimp';

async function processLogo() {
  const imageDark = await Jimp.read('public/brand/logo-icon.jpg');
  const imageLight = await Jimp.read('public/brand/logo-icon.jpg');

  // Create dark version (for white backgrounds) - just remove white bg
  imageDark.scan(0, 0, imageDark.bitmap.width, imageDark.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // white tolerance
    if (r > 230 && g > 230 && b > 230) {
      this.bitmap.data[idx + 3] = 0; // Set alpha to 0
    }
  });
  await imageDark.write('public/brand/logo-icon-dark.png');

  // Create light version (for dark backgrounds) - remove white bg, and turn dark colors to white
  imageLight.scan(0, 0, imageLight.bitmap.width, imageLight.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Check if it's white background
    if (r > 230 && g > 230 && b > 230) {
      this.bitmap.data[idx + 3] = 0; // Set alpha to 0
    } else {
      // It's part of the logo. 
      // The dark brown/grey parts look very dark. The gold parts are brighter.
      // E.g., Dark brown is maybe R=60, G=50, B=50. Gold is maybe R=200, G=160, B=80
      // Let's turn anything that is relatively dark into white.
      if (r < 100 && g < 100 && b < 100) {
        this.bitmap.data[idx + 0] = 255; // R
        this.bitmap.data[idx + 1] = 255; // G
        this.bitmap.data[idx + 2] = 255; // B
      }
    }
  });
  await imageLight.write('public/brand/logo-icon-light.png');

  console.log('Both light and dark logos generated!');
}

processLogo().catch(console.error);
