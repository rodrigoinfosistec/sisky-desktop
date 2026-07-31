const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sizes = [16, 32, 48, 64, 128, 256, 512];

async function buildIcons() {
    const svgPath = path.join(__dirname, '../assets/icon.svg');
    const svgBuffer = fs.readFileSync(svgPath);

    // Gera PNGs em vários tamanhos
    for (const size of sizes) {
        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(path.join(__dirname, `../assets/icon-${size}.png`));
        console.log(`✅ icon-${size}.png gerado`);
    }

    // Gera o PNG principal (256x256)
    await sharp(svgBuffer)
        .resize(256, 256)
        .png()
        .toFile(path.join(__dirname, '../assets/icon.png'));
    console.log('✅ icon.png gerado');
}

buildIcons().catch(console.error);