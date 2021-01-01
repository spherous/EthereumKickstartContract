import Web3 from 'web3';

let web3;
if(typeof window !== 'undefined')
{
    // Browser
    web3 = new Web3(window.ethereum);
}
else
{
    // Server
    const {projectID} = require('./secrets.json');
    const provider = new Web3.providers.HttpProvider(
        projectID
    );
    web3 = new Web3(provider);
}

export default web3;