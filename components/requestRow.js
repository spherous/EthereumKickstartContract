import React from 'react';
import {Table, Button, Message, Form} from 'semantic-ui-react';
import web3 from '../Ethereum/web3';
import Campaign from '../Ethereum/campaign';
import {Router} from '../routes'

class RequestRow extends React.Component
{
    state = {
        errorMessage:'',
        loading: false
    };

    onApprove = async () =>
    {
        const campaign = Campaign(this.props.address);
        const accounts = await window.ethereum.request({method: 'eth_accounts'});
        
        this.setState({loading: true, errorMessage: ''});
        
        try {
            await campaign.methods.ApproveRequest(this.props.id).send({from: accounts[0]});
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            this.setState({errorMessage: err.message});
        }
        
        this.setState({loading: false});
    }
    
    onFinalize = async () =>
    {
        const campaign = Campaign(this.props.address);
        const accounts = await window.ethereum.request({method: 'eth_accounts'});
        
        this.setState({loading: true, errorMessage: ''});
        
        try {
            await campaign.methods.FinalizeRequest(this.props.id).send({from: accounts[0]});
            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            this.setState({errorMessage: err.message});
        }

        this.setState({loading: false});
    }

    render()
    {
        const {Row, Cell} = Table;
        const {id, request, contributerCount} = this.props;
        const readyToFinalize = request.approvalCount > contributerCount / 2;

        return(
            <Row disabled = {request.complete} positive = {readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{contributerCount}</Cell>
                <Cell>
                    {request.complete ? null : (
                        <Button color = "green" basic onClick = {this.onApprove} loading = {this.state.loading}>
                            Approve
                        </Button>
                    )}
                </Cell>
                <Cell>
                    {request.complete || !readyToFinalize ? null : (
                        <Button color = "yellow" basic onClick = {this.onFinalize} loading = {this.state.loading}>
                            Finalize
                        </Button>
                    )}
                    <Form error = {!!this.state.errorMessage}>
                        <Message
                            error
                            header = 'Oops!'
                            content = {this.state.errorMessage}
                        />
                    </Form>
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;