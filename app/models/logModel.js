const mongoose = require('../../server').mongoose;

let logSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },

    function: String,
    status: String
});

logSchema.statics = {
    newLog: async function (funcName, args, status) {
        let outArgs = ' ';
        for (let i = 0; i < args.length; i++) {
            outArgs += args[i] + ' ';
        }

        const newLog = {
            function: `${funcName}(${outArgs})`,
            status: status
        }

        await this.create(newLog);
    },
    getLogs: async function (limit) {
        const logs = await this.find().sort('-date').limit(limit);
        return logs.reverse();
    }
}
const logModel = mongoose.model('log', logSchema);

module.exports.logModel = logModel;