const categoriesService = require('../services/CategoriesService');
const { response } = require('../../helpers/Response');

class CategoriesController {
    // categories
    // [GET] /api/categories
    async getAllCategories(req, res, next) {
        try {
            const categories = await categoriesService.getAllCategories();
            res.status(200).json(response(categories));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/categories/:category_slug
    async getCategoryBySlug(req, res, next) {
        try {
            const { category_slug } = req.params;
            const category = await categoriesService.getCategoryBySlug(category_slug);
            res.status(200).json(response(category));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/categories/create-category
    async createCategory(req, res, next) {
        try {
            const formData = req.body;
            const newCategory = await categoriesService.createCategory(formData);
            res.status(201).json(response(newCategory));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/categories/:category_slug
    async editCategory(req, res, next) {
        try {
            const { category_slug } = req.params;
            const formData = req.body;
            const newCategory = await categoriesService.editCategory(category_slug, formData);
            res.status(201).json(response(newCategory));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/categories/:category_slug
    async deleteCategory(req, res, next) {
        try {
            const { category_slug } = req.params;
            await categoriesService.deleteCategory(category_slug);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // sub_categories
    // [GET] /api/categories/sub_categories
    async getAllSubCategories(req, res, next) {
        try {
            const subCategories = await categoriesService.getAllSubCategories();
            res.status(200).json(response(subCategories));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/categories/sub_categories/:sub_category_slug
    async getSubCategoryBySlug(req, res, next) {
        try {
            const { sub_category_slug } = req.params;
            const sub_category = await categoriesService.getSubCategoryBySlug(sub_category_slug);
            res.status(200).json(response(sub_category));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/categories/sub_categories/create-category
    async createSubCategory(req, res, next) {
        try {
            const formData = req.body;
            const newSubCategory = await categoriesService.createSubCategory(formData);
            res.status(201).json(response(newSubCategory));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/categories/sub_categories/:sub_category_slug
    async editSubCategory(req, res, next) {
        try {
            const { sub_category_slug } = req.params;
            const formData = req.body;
            const newSubCategory = await categoriesService.editSubCategory(sub_category_slug, formData);
            res.status(201).json(response(newSubCategory));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/categories/sub_categories/:sub_category_slug
    async deleteSubCategory(req, res, next) {
        try {
            const { sub_category_slug } = req.params;
            await categoriesService.deleteSubCategory(sub_category_slug);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }

    // services
    // [GET] /api/categories/services
    async getAllServices(req, res, next) {
        try {
            const services = await categoriesService.getAllServices();
            res.status(200).json(response(services));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/categories/services/:service_slug
    async getServiceBySlug(req, res, next) {
        try {
            const { service_slug } = req.params;
            const service = await categoriesService.getServiceBySlug(service_slug);
            res.status(200).json(response(service));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/categories/services/create-service
    async createService(req, res, next) {
        try {
            const formData = req.body;
            const newService = await categoriesService.createService(formData);
            res.status(201).json(response(newService));
        } catch (err) {
            next(err);
        }
    }

    // [PUT] /api/categories/services/:service_slug
    async editService(req, res, next) {
        try {
            const { service_slug } = req.params;
            const formData = req.body;
            const newService = await categoriesService.editService(service_slug, formData);
            res.status(201).json(response(newService));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/categories/services/:service_slug
    async deleteService(req, res, next) {
        try {
            const { service_slug } = req.params;
            await categoriesService.deleteService(service_slug);
            res.status(200).json(response());
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new CategoriesController();
