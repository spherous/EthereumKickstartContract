import React from 'react';
import Layout from '../../../components/layout'
import {Button, Table} from 'semantic-ui-react';
import {Link} from '../../../routes';
import Campaign from '../../../Ethereum/campaign';
import { Router } from 'next/router';
import RequestRow from '../../../components/requestRow';

class RequestIndex extends React.Component
{
    static async getInitialProps(props)
    {
        const {address} = props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.GetRequestCount().call();
        const contributerCount = await campaign.methods.numberOfContributers().call();

        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill()
                .map((element, index) => {
                    return campaign.methods.requests(index).call()
                })
        );
        
        return {address, requests, requestCount, contributerCount};
    }

    renderRows()
    {
        return this.props.requests.map((request, index) => {
            return (
                <RequestRow 
                    key = {index}
                    id = {index}
                    request = {request}
                    address = {this.props.address}
                    contributerCount = {this.props.contributerCount}
                />
            );
        });
    }

    render()
    {
        const{ Header, Row, HeaderCell, Body } = Table;

        return (
            <Layout>
                <h3>Request List</h3>
                <Link route = {`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated = 'right' style = {{marginBottom: 10}}>
                            Add Request
                        </Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount (ether)</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRows()}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} requets.</div>
            </Layout>
        );
    }
}

export default RequestIndex;