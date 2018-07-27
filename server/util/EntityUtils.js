'use strict';

const timeout = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
  /**
   * Insert entities into the given model, in the same order that they are listed in the {entities} array
   *
   * @param {Object} model
   * @param {array} entities
   * @returns {array}
   */
  createInOrder: async function(model, entities) {
    const created = [];
    for (let key in entities) {
      created.push(await model.create(entities[key]));
      // await timeout(1);
    }
    return created;
  },
};
