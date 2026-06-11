/** SVGO: strip comments, metadata, and whitespace only — no geometry/style changes. */
export default {
  multipass: false,
  js2svg: {
    indent: 0,
    pretty: false,
  },
  plugins: [
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeEditorsNSData',
    'removeDesc',
    'removeTitle',
    'removeEmptyText',
    'removeUnusedNS',
  ],
};
