import React from 'react';
import {Button, Form, Input, Message} from 'semantic-ui-react';
import Campaign from '../Ethereum/campaign';
import web3 from '../Ethereum/web3';
import {Router} from '../routes';

class ContributeForm extends React.Component
{
    state = {
        value: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async event =>
    {
        event.preventDefault();
        const campaign = Campaign(this.props.address);

        this.setState({loading: true, errorMessage: ''});

        try {
            const accounts = await window.ethereum.request({method: 'eth_accounts'});
            await campaign.methods.Contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            
            Router.replaceRoute(`/campaigns/${this.props.address}`);
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false, value: ''});
    };

    render()
    {
        return (
            <Form onSubmit = {this.onSubmit} error = {!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input 
                        value = {this.state.value}
                        onChange = {event => this.setState({value: event.target.value})}
                        label = 'ether'
                        labelPosition = 'right'
                    />
                    <Message 
                        error 
                        header = 'Oops!' 
                        content = {this.state.errorMessage} 
                    />
                    <Button primary loading = {this.state.loading}>
                        Contribute!
                    </Button>
                </Form.Field>
            </Form>
        );
    }
}

export default ContributeForm;