const gigsService = require('../services/GigsService');
const { response } = require('../../helpers/Response');
const cloudinary = require('cloudinary').v2;
const { ApiError } = require('../../helpers/ErrorHandler');

class GigsController {
    // [GET] /api/gigs
    async getAllGigs(req, res, next) {
        try {
            const queryData = req.query;
            const gigs = await gigsService.getAllGigs(queryData);
            res.status(200).json(response(gigs));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/gigs/:gig_slug
    async getGigBySlug(req, res, next) {
        try {
            const { gig_slug } = req.params;
            const gig = await gigsService.getGigBySlug(gig_slug);
            res.status(200).json(response(gig));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/gigs/categories/:category_slug
    async getAllCategoryGigs(req, res, next) {
        try {
            const { category_slug } = req.params;
            const gigs = await gigsService.getAllCategoryGigs(category_slug);
            res.status(200).json(response(gigs));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/gigs/sub_categories/:sub_category_slug
    async getAllSubCategoryGigs(req, res, next) {
        try {
            const { sub_category_slug } = req.params;
            const gigs = await gigsService.getAllSubCategoryGigs(sub_category_slug);
            res.status(200).json(response(gigs));
        } catch (err) {
            next(err);
        }
    }

    // [GET] /api/gigs/services/:service_slug
    async getAllServiceGigs(req, res, next) {
        try {
            const { service_slug } = req.params;
            const gigs = await gigsService.getAllServiceGigs(service_slug);
            res.status(200).json(response(gigs));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/gigs/create-gig
    async createGig(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const newGig = await gigsService.createGig(id, formData);
            res.status(201).json(response(newGig));
        } catch (err) {
            next(err);
        }
    }

    // [POST] /api/gigs/:gig_slug/upload-gig-image
    async uploadGigImage(req, res, next) {
        try {
            const { id } = req.user;
            const { gig_slug } = req.params;

            if (!req.file) {
                throw new ApiError(404, 'Please upload a file');
            }
            const image = req.file.path;
            const newGigImage = await gigsService.uploadGigImage(id, gig_slug, image);
            res.status(201).json(response(newGigImage));
        } catch (err) {
            if (req.file) {
                cloudinary.uploader.destroy(req.file.filename);
            }
            next(err);
        }
    }

    // [PUT] /api/gigs/:gig_slug/edit
    async editGig(req, res, next) {
        try {
            const { id } = req.user;
            const { gig_slug } = req.params;
            const formData = req.body;
            const newGig = await gigsService.editGig(id, gig_slug, formData);
            res.status(201).json(response(newGig));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/gigs/:gig_slug/delete
    async deleteGig(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const { gig_slug } = req.params;
            await gigsService.deleteGig(id, gig_slug, formData);
            res.status(200).json(response('Gig deleted successfully'));
        } catch (err) {
            next(err);
        }
    }

    // [DELETE] /api/gigs/:gig_slug/admin-delete
    async adminDeleteGig(req, res, next) {
        try {
            const { id } = req.user;
            const formData = req.body;
            const { gig_slug } = req.params;
            await gigsService.adminDeleteGig(id, gig_slug, formData);
            res.status(200).json(response('Gig has been removed'));
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new GigsController();
