const mongoose = require('../../server').mongoose,
    toHash = require('md5');


let adminSchema = mongoose.Schema({
    username: String,
    password: String
});

adminSchema.statics = {
    addAdmin: async function (adminData) {
        let newAdmin = new this(adminData);
        newAdmin.password = toHash(adminData.password);

        return await newAdmin.save();
    },
    checkAdmin: async function (username, password) {
        const foundAdmin = await this.findOne({
            username: username,
            password: toHash(password)
        });

        return foundAdmin;
    }
}

let adminModel = mongoose.model('admin', adminSchema);
module.exports.adminModel = adminModel;