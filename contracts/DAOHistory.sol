pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Poll.sol";
import "./struct/dao/DAOInfo.sol";

contract DAOHistory is AccessControl, Ownable {
    mapping(string => mapping(string => DAOHistoryItem[])) public histories;
    mapping(string => mapping(string => Assessment[])) public assessments;
    mapping(string => mapping(string => address)) public pollAddress;
    mapping(string => DAOInfo) public daoInfo;

    // Role to add DAO History
    bytes32 public constant ADD_HISTORY_ROLE = keccak256("ADD_HISTORY_ROLE");

    function setupAddHistoryRole(address contractAddress)
        public
        onlyOwner
        returns (bool)
    {
        _setupRole(ADD_HISTORY_ROLE, contractAddress);
        return true;
    }

    function addDao(
        string memory daoId,
        string memory projectId,
        string memory name,
        string memory description,
        string memory website,
        string memory logo
    ) public onlyOwner returns (address) {
        require(
            keccak256(abi.encode(daoInfo[daoId].name)) !=
                keccak256(abi.encode("")),
            "DAOHistory: DAO already exists"
        );
        string[] memory projects = new string[](1);
        projects[0] = projectId;
        daoInfo[daoId] = DAOInfo(name, description, website, logo, projects);

        // Create a poll contract
        Poll poll = new Poll(daoId, projectId);
        setupAddHistoryRole(address(poll));
        pollAddress[daoId][projectId] = address(poll);
        poll.setDaoHistoryAddress(address(this));

        // grant permission
        poll.setPollAdminRole(msg.sender);
        poll.transferOwnership(msg.sender);

        return address(poll);
    }

    function getDaoInfo(string memory daoId)
        public
        view
        returns (DAOInfo memory)
    {
        return daoInfo[daoId];
    }

    function getDaoHistory(string memory daoId, string memory projectId)
        public
        view
        returns (DAOHistoryItem[] memory)
    {
        return histories[daoId][projectId];
    }

    function getDaoAssessments(string memory daoId, string memory projectId)
        public
        view
        returns (Assessment[] memory)
    {
        return assessments[daoId][projectId];
    }

    function addDaoHistory(
        string memory daoId,
        string memory projectId,
        DAOHistoryItem memory daoHistoryItem
    ) public {
        require(
            hasRole(ADD_HISTORY_ROLE, msg.sender),
            "Caller has no permission to add history"
        );
        histories[daoId][projectId].push(daoHistoryItem);
    }

    function addAssessment(
        string memory daoId,
        string memory projectId,
        Assessment[] memory _assessments
    ) public {
        require(
            hasRole(ADD_HISTORY_ROLE, msg.sender),
            "Caller has no permission to add assessment"
        );
        for (uint256 i = 0; i < _assessments.length; i++) {
            assessments[daoId][projectId].push(_assessments[i]);
        }
    }
}
