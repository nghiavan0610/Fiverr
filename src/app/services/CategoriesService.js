const { ApiError } = require('../../helpers/ErrorHandler');
const { GigCategory, GigSubCategory, GigService } = require('../../db/models');

class CategoriesService {
    // categories
    // [GET] /api/categories
    async getAllCategories() {
        try {
            const categories = await GigCategory.findAll();
            return categories;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/categories/:category_slug
    async getCategoryBySlug(category_slug) {
        try {
            const category = await GigCategory.findOne({
                attributes: ['id', 'name', 'slug'],
                include: {
                    attributes: ['id', 'name', 'slug'],
                    model: GigSubCategory,
                },
                where: { slug: category_slug },
            });
            if (!category) throw new ApiError(404, `Gig category with slug='${category_slug}' was not found`);

            return category;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/categories/create-category
    async createCategory(formData) {
        try {
            const { category_name } = formData;
            const newCategory = await GigCategory.findOrCreate({
                where: { name: category_name },
                defaults: {},
            });
            return newCategory[0];
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/categories/:category_slug
    async editCategory(category_slug, formData) {
        try {
            const { category_name } = formData;
            const newCategory = await GigCategory.update({ name: category_name }, { where: { slug: category_slug } });
            if (!newCategory[0] && !newCategory[1][0]) {
                throw new ApiError(404, `Gig category with slug='${category_slug}' was not found to edit`);
            }
            return newCategory[1][0];
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, `This gig category already exists`);
            }
            throw err;
        }
    }

    // [DELETE] /api/categories/:category_slug
    async deleteCategory(category_slug) {
        try {
            const deleted = await GigCategory.destroy({
                where: { slug: category_slug },
            });
            if (!deleted) throw new ApiError(404, `Gig category with slug='${category_slug}' was not found to delete`);
        } catch (err) {
            throw err;
        }
    }

    // sub_categories
    // [GET] /api/categories/sub_categories
    async getAllSubCategories() {
        try {
            const subCategories = await GigSubCategory.findAll();
            return subCategories;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/categories/sub_categories/:sub_category_slug
    async getSubCategoryBySlug(sub_category_slug) {
        try {
            const subCategory = await GigSubCategory.findOne({
                attributes: ['id', 'name', 'gig_category_id', 'slug'],
                include: {
                    attributes: ['id', 'name', 'slug'],
                    model: GigService,
                },
                where: { slug: sub_category_slug },
            });
            if (!subCategory)
                throw new ApiError(404, `Gig sub_category with slug='${sub_category_slug}' was not found`);

            return subCategory;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/categories/sub_categories/create-sub-category
    async createSubCategory(formData) {
        try {
            const { sub_category_name, belong_to_category_id } = formData;
            const category = await GigCategory.findByPk(belong_to_category_id, { attributes: ['id'] });
            if (!category) {
                throw new ApiError(404, `Gig category with id='${belong_to_category_id}' was not found`);
            }

            const newSubCategory = await GigSubCategory.findOrCreate({
                where: { name: sub_category_name, gig_category_id: category.id },
                defaults: {},
            });
            return newSubCategory[0];
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/categories/sub_categories/:sub_category_slug
    async editSubCategory(sub_category_slug, formData) {
        try {
            const { sub_category_name, belong_to_category_id } = formData;
            const category = await GigCategory.findByPk(belong_to_category_id, { attributes: ['id'] });
            if (!category) {
                throw new ApiError(404, `Gig category with id='${belong_to_category_id}' was not found`);
            }

            const newSubCategory = await GigSubCategory.update(
                { name: sub_category_name, gig_category_id: category.id },
                { where: { slug: sub_category_slug } },
            );
            if (!newSubCategory[0] && !newSubCategory[1][0]) {
                throw new ApiError(404, `Gig sub_category with slug='${sub_category_slug}' was not found to edit`);
            }
            return newSubCategory[1][0];
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This gig sub_category already exists');
            }
            throw err;
        }
    }

    // [DELETE] /api/categories/sub_categories/:sub_category_slug
    async deleteSubCategory(sub_category_slug) {
        try {
            const deleted = await GigSubCategory.destroy({
                where: { slug: sub_category_slug },
            });
            if (!deleted)
                throw new ApiError(404, `Gig sub_category with slug='${sub_category_slug}' was not found to delete`);
        } catch (err) {
            throw err;
        }
    }

    // services
    // [GET] /api/categories/services
    async getAllServices() {
        try {
            const services = await GigService.findAll();
            return services;
        } catch (err) {
            throw err;
        }
    }

    // [GET] /api/categories/services/:service_slug
    async getServiceBySlug(service_slug) {
        try {
            const service = await GigService.findOne({
                attributes: ['id', 'name', 'gig_sub_category_id', 'slug'],
                where: { slug: service_slug },
            });
            if (!service) throw new ApiError(404, `Gig service with slug='${service_slug}' was not found`);

            return service;
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/categories/services/create-service
    async createService(formData) {
        try {
            const { service_name, belong_to_sub_category_id } = formData;
            const subCategory = await GigSubCategory.findByPk(belong_to_sub_category_id, { attributes: ['id'] });
            if (!subCategory) {
                throw new ApiError(404, `Gig sub_category with id='${belong_to_sub_category_id}' was not found`);
            }

            const newService = await GigService.findOrCreate({
                where: { name: service_name, gig_sub_category_id: subCategory.id },
                defaults: {},
            });
            return newService[0];
        } catch (err) {
            throw err;
        }
    }

    // [PUT] /api/categories/services/:service_slug
    async editService(service_slug, formData) {
        try {
            const { service_name, belong_to_sub_category_id } = formData;
            const subCategory = await GigSubCategory.findByPk(belong_to_sub_category_id, { attributes: ['id'] });
            if (!subCategory) {
                throw new ApiError(404, `Gig sub_category with id='${belong_to_sub_category_id}' was not found`);
            }

            const newService = await GigService.update(
                { name: service_name, gig_sub_category_id: subCategory.id },
                { where: { slug: service_slug } },
            );
            if (!newService[0] && !newService[1][0]) {
                throw new ApiError(404, `Gig service with slug='${service_slug}' was not found to edit`);
            }
            return newService[1][0];
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'This gig service already exists');
            }
            throw err;
        }
    }

    // [DELETE] /api/categories/services/:service_slug
    async deleteService(service_slug) {
        try {
            const deleted = await GigService.destroy({
                where: { slug: service_slug },
            });
            if (!deleted) throw new ApiError(404, `Gig service with slug='${service_slug}' was not found to delete`);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new CategoriesService();
