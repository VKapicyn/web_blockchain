let options = require('../../options.json'),
    web3 = require('./eth').web3;
    inUsing = [],
    allWallets = [];

module.exports.inUsing = inUsing;

exports.init = function () {
    for(let i=0; i<options.address.length; i++) {
        web3.eth.accounts.wallet.add({
            privateKey: options.privateKey[i],
            address: options.address[i]
        });
        allWallets.push({
            privateKey: options.privateKey[i],
            address: options.address[i]           
        });
    }
}

exports.removeInUsing = (address) => {
    for(let i=0; i<inUsing.length; i++){
        if(inUsing[i].address == address) {
            inUsing.splice(i, 1);
        }
    }
}

exports.getAdminAcc = () =>{
    let _wallet;
    if (inUsing.length < allWallets.length){
        for (let j=0; j<allWallets.length; j++) {
            n = 0;
            for (let i=0; i<inUsing.length; i++) {
                if (inUsing[i].address != allWallets[j].address)
                    n++;
            }
            if(n == inUsing.length){ 
                _wallet = {
                    address: allWallets[j].address,
                    privateKey: allWallets[j].privateKey
                };
                inUsing.push(_wallet)
                break;
            }
        }
        return _wallet;
    }
    else 
        return null
}
