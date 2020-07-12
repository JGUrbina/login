const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    nameBusiness: {
        type: String
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    motherLastName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    genero: {
        type: String
    },
    password: {
        type: String,
        trim: true,
        minlength: 8

    },
    rol: {
        type: String,
        required: true
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    logo: {
        type: String
    },
    coverImg: {
        type: String
    },
    comercialName: {
        type: String
    },
    businessDescription: {
        type: String
    },
    webUrl: {
        type: String
    },
    instaUrl: {
        type: String
    },
    fbUrl: {
        type: String
    },
    twitterUrl: {
        type: String
    },
    whatsNumber: {
        type: Number
    },
    promotionalImg: {
        type: String
    },
    ratingEmail: {
        type: String
    },
    whataccepts: { 
        delivery: {
            type: Boolean,
            default: false
        },
        localconsume: {
            type: Boolean,
            default: false
        },
        takeOrder: {
            type: Boolean,
            default: false
        }
    },
    isVerify: Boolean,
    plan: {
        type: String
    },
},
{
    timestamps: true,
});

userSchema.pre('save', function(next) {
    let user = this;
    if (!user.isModified('password'))return next();

    bcrypt.genSalt(5, (err, salt) => {
        if(err) return next(err)
        console.log('este es el salt', salt)

        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) return next(err)
            user.password = hash
            console.log('este es el hash', hash, 'y esto el error: ', err)
            next()
        })

    })

})


const User = mongoose.model('User', userSchema)

module.exports = User;