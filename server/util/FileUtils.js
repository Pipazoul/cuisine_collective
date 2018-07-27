'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {

  /**
     * Load all files which are located in a folder.
     *
     * @param {string} folderPath Folder path
     * @returns {{filename: string, filepath:string}[]}
     */
  loadFolder: function(folderPath) {
    // Iterate over files and require them
    const scripts = fs.readdirSync(folderPath).map(function(filename) {
      const filepath = path.format({
        dir: folderPath,
        base: filename,
      });
      return {
        filename: filename,
        filepath: filepath,
      };
    });
    return scripts;
  },
};
