'use strict';

/**
 * fortune-telling-user controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::fortune-telling-user.fortune-telling-user', ({ strapi }) => ({
  // 获取枚举映射配置
  async getEnumMappings(ctx) {
    try {
      const service = strapi.service('api::fortune-telling-user.fortune-telling-user');
      const mappings = service.getEnumMappings();
      
      ctx.body = {
        data: mappings
      };
    } catch (error) {
      ctx.throw(500, '获取枚举映射失败');
    }
  }
}));
