const joi=require('joi');
const listingSchema=joi.object({
    title:joi.string().required(),
    description:joi.string().allow('',null),
    image:joi.string().allow('',null),
    price:joi.number().min(0),
    location:joi.string().allow('',null),
    country:joi.string().allow('',null),
});

module.exports.listingSchema=listingSchema;

module.exports.reviewSchema=joi.object({
    review:joi.object({

        rating:joi.number().min(1).max(5).required(),
        comment:joi.string().required()
    }
    ).required()
});