const path = require('path');
const fs = require('fs-extra');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const {mnemonic, projectID} = require('./secrets.json');
const provider = new HDWalletProvider(mnemonic, projectID);
const Web3 = require('web3');
const web3 = new Web3(provider);
const compiledFactory = require('./build/CampaignFactory.json');
// const compiledCampaign = require('../Ethereum/build/Campaign.json');

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account: ', accounts[0]);

    const result = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '2000000' });

    result.setProvider(provider);

    console.log('Contract deployed to: ', result.options.address);
    fs.removeSync('factoryAddress.json');
    fs.outputJSONSync(
        path.resolve('factoryAddress.json'),
        {address: result.options.address}
    );
};
deploy();