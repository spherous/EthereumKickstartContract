const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../Ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../Ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
        .deploy({ data: compiledFactory.evm.bytecode.object })
        .send({ from: accounts[0], gas: '2000000' });

    factory.setProvider(provider);

    await factory.methods.CreateCampaign('100').send({ from: accounts[0], gas: '1000000' });

    [campaignAddress] = await factory.methods.GetCampaigns().call();
    campaign = await new web3.eth.Contract(
        compiledCampaign.abi,
        campaignAddress
    );
});

describe('Campaign Tests', () => {
    it('Contracts deployed', () =>
    {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('Campaign has correct manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.strictEqual(manager, accounts[0]);
    });

    it('Can be contributed to', async () => {
        const from = accounts[1];
        await campaign.methods.Contribute().send({ from: from, value: 100 });
        assert(await campaign.methods.contributers(from).call());
    });

    it('Requires a minimum contribution', async () => {
        try{
            await campaign.methods.Contribute().send({ from: accounts[1], value: 0 });
            assert(false);
        }catch (err) {
            assert(err);
        }
    });

    it('Allows manager to make a request', async () => {
        await campaign.methods
            .CreateRequest('Test', 100, accounts[1])
            .send({ from: accounts[0], gas: '1000000' });
        
        const request = await campaign.methods.requests(0).call();
        assert.strictEqual(request.description, 'Test');
    });

    it('Processes requests', async () => {
        await campaign.methods.Contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .CreateRequest('Test', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000' });
        
        await campaign.methods.ApproveRequest(0)
            .send({ from: accounts[1], gas: '1000000' });
        
        let previousBalance = await web3.eth.getBalance(accounts[1]);
        previousBalance = web3.utils.fromWei(previousBalance, 'ether');
        previousBalance = parseFloat(previousBalance);

        await campaign.methods.FinalizeRequest(0)
            .send({ from: accounts[0], gas: '1000000' });
        
        let finalBalance = await web3.eth.getBalance(accounts[1]);
        finalBalance = web3.utils.fromWei(finalBalance, 'ether');
        finalBalance = parseFloat(finalBalance);
        
        assert.strictEqual(finalBalance - previousBalance, 5);
    });
});