/* jshint esversion: 6 */
/* global __dirname, Promise */
(() => {
  'use strict';
  
  const _ = require('lodash');
  const util = require('util');
  const Promise = require('bluebird');
  
  class Models {
    
    constructor (logger, shadySequelize) {
      this.logger = logger;
      this.sequelize = shadySequelize.sequelize;
      this.Sequelize = shadySequelize.Sequelize;
      this.defineModels();
    }
    
    defineModels() {
      const Sequelize = this.Sequelize;
      
      this.defineModel('ConnectSession', {
        sid: {
          type: Sequelize.STRING(191),
          primaryKey: true
        },
        userId: Sequelize.STRING(191),
        expires: Sequelize.DATE,
        data: Sequelize.TEXT
      });
      
      this.defineModel('SavedSearch', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        userId: Sequelize.STRING(191),
        search: Sequelize.TEXT('long')
      });
    }
    
    defineModel(name, attributes, options) {
      this[name] = this.sequelize.define(name, attributes, Object.assign(options || {}, {
        charset: 'utf8mb4',
        dialectOptions: {
          collate: 'utf8mb4_unicode_ci'
        }
      }));
      this[name].sync();
    }

    findSavedSearch(id) {
      return this.SavedSearch.findOne({ where: { id : id } });
    }
    
    createSavedSearch(searchJson, userId) {
      return this.SavedSearch.create({
        search: searchJson,
        userId: userId
      });
    }
    
  } 
  
  module.exports = (options, imports, register) => {
    const shadySequelize = imports['shady-sequelize'];
    const logger = imports['logger'];
    const models = new Models(logger, shadySequelize);
    
    register(null, {
      'paatos-ui-models': models
    });
    
  };
  
})();