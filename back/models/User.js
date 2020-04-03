const mongoose = require('mongoose');
const nanoid = require('nanoid');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
   username: {
       type: String,
       required: true,
       unique: true,
       validate: {
           validator: async function (value){
               if(!this.isModified('username')) return true;
               const user = await User.findOne({username: value});
               if(user) throw new Error('This user is already registered');
           }
       }
   },
    password: {
       type: String,
        required: true
    },
    token: {
       type: String,
        required: true
    }
});


UserSchema.methods.generateToken = function () {
    this.token = nanoid();
};

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;
    next();
});

UserSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
