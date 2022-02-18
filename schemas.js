const { extend } = require('joi');
const Basejoi = require('joi');
const sanitizeHTML = require('sanitize-html'); 

const extention = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label} must not include HTML!}'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = Basejoi.extend(extention);

module.exports.campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required().escapeHTML(),
        price: joi.number().required().min(0),
        //image: joi.string().required(),
        location: joi.string().required().escapeHTML(),
        discription: joi.string().required().escapeHTML()
    }).required(),
    deleteImages: joi.array()
    
});



module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required(),
        body: joi.string().required().escapeHTML()
    }).required()
})