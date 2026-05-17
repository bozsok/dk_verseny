const babelJest = require('babel-jest').default || require('babel-jest');
const transformer = babelJest.createTransformer();

module.exports = {
  process(src, filename, options) {
    // Szövegesen helyettesítjük az import.meta.env kifejezést a parser előtt
    const modifiedSrc = src.replace(/import\.meta\.env/g, '({ BASE_URL: "/" })');
    return transformer.process(modifiedSrc, filename, options);
  }
};
