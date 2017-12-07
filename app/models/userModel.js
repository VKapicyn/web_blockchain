//тут схема данных с монгусом
const mongoose = require('../../server').mongoose;

let userSchema = mongoose.Schema({
    userId: {
        type: String,
        unique: true
    },
    address: String,
    privateKey: String
});

userSchema.statics = {
    addWallet: async function (walletData) {
        const newWallet = await this.create(walletData);

        return newWallet;
    },

    getUser: async function (userId) {
        const foundUser = await this.findOne({userId: userId});

        return foundUser;
    }
}

const userModel = mongoose.model('user', userSchema);

module.exports.userModel = userModel;
