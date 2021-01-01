import React from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../Ethereum/factory';
import Layout from '../components/layout';
import {Link} from '../routes';

class CampaignIndex extends React.Component
{
    static async getInitialProps()
    {
        const deployedCampaigns = await factory.methods.GetCampaigns().call();
        return { deployedCampaigns };
    }

    renderCampaigns()
    {
        const items = this.props.deployedCampaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route = {`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items = {items} />
    }

    render()
    {
        return (
            <Layout>
                <div>
                    <h3>Open Campaigns</h3>

                    <Link route = '/campaigns/new'>
                        <a>
                            <Button 
                                content = "Create Campaign"
                                icon = "add"
                                primary
                                floated = "right"
                            />      
                        </a>
                    </Link>

                    { this.renderCampaigns() }
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;