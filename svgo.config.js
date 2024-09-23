module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeTitle: false,             // No elimina el título si existe
          removeViewBox: false,           // Mantiene el atributo viewBox
        },
      },
    },
    'removeDimensions',                   // Elimina los atributos width y height
    'sortAttrs',                          // Ordena los atributos para mejorar la compresión
    'removeXMLNS',                        // Elimina el atributo xmlns
    {
      name: 'addAttributesToSVGElement',  // Añade clases u otros atributos a los elementos SVG
      params: {
        attributes: [
          {class: 'optimized-svg'},       // Ejemplo de clase agregada
        ],
      },
    },
    {
      name: 'removeAttrs',                // Elimina atributos específicos
      params: {
        attrs: '(stroke|fill)'            // Por ejemplo, elimina los atributos de stroke o fill
      },
    },
  ],
};
