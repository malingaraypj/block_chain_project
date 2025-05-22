// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DRM {
    struct Content {
        string title;
        string description;
        string ipfsHash;
        uint256 price;
        uint8 contentType;
        address creator;
        bool isApproved;
        Permissions permissions;
    }

    struct Permissions {
        bool viewOnly;
        bool download;
    }

    mapping(address => Content[]) private creatorContents;
    mapping(address => uint256) private creatorIncome;
    
    event ContentSubmitted(address indexed creator, string ipfsHash);
    event ContentPurchased(address indexed buyer, address indexed creator, uint256 price);

    function submitContent(
        string memory title,
        string memory description,
        string memory ipfsHash,
        uint256 price,
        uint8 contentType,
        Permissions memory permissions
    ) public returns (bool) {
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(price > 0, "Price must be greater than zero");
        require(contentType <= 1, "Invalid content type");
        Content memory newContent = Content({
            title: title,
            description: description,
            ipfsHash: ipfsHash,
            price: price,
            contentType: contentType,
            creator: msg.sender,
            isApproved: true,
            permissions: permissions
        });

        creatorContents[msg.sender].push(newContent);
        emit ContentSubmitted(msg.sender, ipfsHash);
        return true;
    }

    function getCreatorContents(address creator) public view returns (Content[] memory) {
        Content[] memory creatorContent = creatorContents[creator];
        return creatorContent; // Simply return empty array if no content exists
    }

    function purchaseContent(address creator, uint256 contentIndex) public payable {
        require(contentIndex < creatorContents[creator].length, "Content does not exist");
        Content memory content = creatorContents[creator][contentIndex];
        require(msg.value >= content.price, "Insufficient payment");
        
        creatorIncome[creator] += msg.value;
        emit ContentPurchased(msg.sender, creator, msg.value);
    }

    function getSalesData(address seller) public view returns (
        Content[] memory contents,
        uint256 totalIncome
    ) {
        return (creatorContents[seller], creatorIncome[seller]);
    }

    function getAllApprovedContents() public view returns (Content[] memory) {
        uint256 totalContents;
        for (uint256 i = 0; i < creatorContents[msg.sender].length; i++) {
            if (creatorContents[msg.sender][i].isApproved) {
                totalContents++;
            }
        }
        Content[] memory approvedContents = new Content[](totalContents);
        uint256 index = 0;
        for (uint256 i = 0; i < creatorContents[msg.sender].length; i++) {
            if (creatorContents[msg.sender][i].isApproved) {
                approvedContents[index] = creatorContents[msg.sender][i];
                index++;
            }
        }
        return approvedContents;
    }
}
