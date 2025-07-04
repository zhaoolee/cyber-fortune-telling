'use strict';

/**
 * fortune-telling-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::fortune-telling-user.fortune-telling-user');
