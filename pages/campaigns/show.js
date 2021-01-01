import React from 'react';
import Layout from '../../components/layout';
import ContributeForm from '../../components/contributeForm';
import Campaign from '../../Ethereum/campaign';
import {Card, Grid, Button} from 'semantic-ui-react';
import web3 from '../../Ethereum/web3';
import {Link} from '../../routes';

class CampaignShow extends React.Component
{
    static async getInitialProps(props)
    {
        const campaign = Campaign(props.query.address);
        const summary = await campaign.methods.GetSummary().call();
        
        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            numberOfRequests: summary[2],
            numberOfContributers: summary[3],
            manager: summary[4]
        };
    }

    renderCards()
    {
        const {
            balance,
            manager,
            minimumContribution,
            numberOfRequests,
            numberOfContributers
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Managers address',
                description: 'The manager created this campaign and can create requests to withdraw money.',
                style: {overflowWrap: 'break-word'}
            },
            {
                header: minimumContribution,
                meta: 'Minimum contribution (wei)',
                description: 'You must contribute at least this much wei to become a contributer.'
            },
            {
                header: numberOfRequests,
                meta: 'Number of requests',
                description: 'A request tries to withdraw money from the contract. Requests must be approved by contributers.'
            },
            {
                header: numberOfContributers,
                meta: 'Number of contributers',
                description: 'Number of people who have already donated to this campaign.'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign balance (ether)',
                description: 'The amount of money left for this campaign to spend.'
            }
        ];

        return <Card.Group items = {items} />
    }

    render()
    {
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width = {10}>
                            {this.renderCards()}
                        </Grid.Column>
                        <Grid.Column width = {6}>
                            <ContributeForm address = {this.props.address} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route = {`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button primary>
                                        View Requests
                                    </Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>  
        );
    }
}

export default CampaignShow;