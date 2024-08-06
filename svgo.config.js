module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Desactivar el plugin que elimina los IDs
          removeViewBox: false,
          removeXMLNS: false,
          removeDimensions: false,
          removeAttrs: {
            attrs: 'id' // Solo eliminar atributos id específicos si es necesario
          }
        }
      }
    }
  ]
};
