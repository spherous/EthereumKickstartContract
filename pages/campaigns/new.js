import React from 'react';
import Layout from '../../components/layout';
import {Form, Button, Input, Message} from 'semantic-ui-react';
import factory from '../../Ethereum/factory';
import {Router} from '../../routes';

class CampaignNew extends React.Component
{
    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({loading: true});
        this.setState({errorMessage: ''})

        try {
            const accounts = await window.ethereum.request({method: 'eth_accounts'});
            
            await factory.methods
                .CreateCampaign(this.state.minimumContribution)
                .send({from: accounts[0]});

            Router.pushRoute('/');
        } catch (err) {
            this.setState({errorMessage: err.message});
        }

        this.setState({loading: false});
    };

    render()
    {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit = {this.onSubmit} error = {!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input 
                            label = 'wei' 
                            labelPosition = 'right' 
                            value = {this.state.minimumContribution}
                            onChange = {event => this.setState({minimumContribution: event.target.value})}
                        />
                    </Form.Field>

                    <Message 
                        error 
                        header = "Oops!" 
                        content = {this.state.errorMessage}
                    />

                    <Button primary loading = {this.state.loading} >
                        Create!
                    </Button>
                </Form>
            </Layout>
        );
    }   
}

export default CampaignNew;