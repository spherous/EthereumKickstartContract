pragma solidity ^0.8.0;

contract CampaignFactory
{
    Campaign[] public deployedCampaigns;
    
    function CreateCampaign(uint minimumContribution) public
    {
        Campaign newCampaign = new Campaign(minimumContribution, msg.sender);
        deployedCampaigns.push(newCampaign);
    }
    
    function GetCampaigns() public view returns (Campaign[] memory)
    {
        return deployedCampaigns;
    }
}


contract Campaign
{
    struct Request
    {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    address public manager;
    uint public minimumContribution;
    
    uint public numberOfContributers;
    mapping(address => bool) public contributers;
    
    uint public nextRequestKey;
    mapping(uint => Request) public requests;
    
    modifier Restricted()
    {
        require(msg.sender == manager);
        _;
    }
    
    constructor(uint minimum, address campaignManager)
    {
        manager = campaignManager;
        minimumContribution = minimum;
    }

    function GetSummary() public view returns (uint, uint, uint, uint, address)
    {
        return(
            minimumContribution,
            address(this).balance,
            nextRequestKey,
            numberOfContributers,
            manager
        );
    }

    function GetRequestCount() public view returns (uint)
    {
        return nextRequestKey;
    }
    
    function Contribute() public payable 
    {
        require(msg.value >= minimumContribution);
        
        contributers[msg.sender] = true;
        numberOfContributers++;
    }
    
    function CreateRequest(string memory description, uint value, address recipient) public Restricted
    {
        Request storage newRequest = requests[nextRequestKey];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
        
        nextRequestKey++;
    }
    
    function ApproveRequest(uint requestIndex) public
    {
        require(contributers[msg.sender]);
        
        Request storage request = requests[requestIndex];
        require(!request.approvals[msg.sender]);
        
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    
    function FinalizeRequest(uint requestIndex) public Restricted
    {
        Request storage request = requests[requestIndex];
        require(!request.complete);
        
        require(request.approvalCount > (numberOfContributers / 2));
        require(address(this).balance >= request.value);
        
        payable(request.recipient).transfer(request.value);
        
        request.complete = true;
    }
    
}