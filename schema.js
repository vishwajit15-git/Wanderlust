const Joi = require('joi');
const reviews = require('./models/reviews');

module.exports.listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0),  //non negative value
        "image.url":Joi.string().allow("",null),  //this dome because we have used this format for image
        "image.filename":Joi.string().allow("",null),
    }).required().unknown(true)
});

module.exports.reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required()
});