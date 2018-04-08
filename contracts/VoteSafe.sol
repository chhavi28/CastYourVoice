pragma solidity ^0.4.4;

contract VoteSafe
{
    struct Node
    {
        uint8 OptionSelected;
        bytes32 AadharHash;
        uint Timestamp;
    } 

    string PollOptions;
    string PollTitle;
    mapping(uint8 => uint) Vote; //option => itsvotecount
    mapping(uint => bytes32) AadharHashList; //sno => aadharHash
    uint TotalVoteCount=0;

    function AddNewVote(uint8 option, string aadhar) public
    {
        Node memory newVote;
        newVote.OptionSelected = option;
        newVote.AadharHash = GetHash(aadhar);
        newVote.Timestamp = now;
        Vote[option]++;
        AadharHashList[TotalVoteCount] = newVote.AadharHash;
        TotalVoteCount++;
    }

    function GetVotePerOption(uint8 option) public returns(uint)
    {
        return (Vote[option]);
    } 

    function GetTotalVoteCount() public returns (uint)
    {
        return (TotalVoteCount);
    }
    function GetHash(string input) public returns (bytes32)
    {
        bytes32 val = sha256(input);
        return (val);
    }
    function AddPollOptions(string list, string title) public 
    {
       PollOptions = list;
       PollTitle = title;
    }

    function GetPollOptions() returns (string)
    {
        return PollOptions;
    }

    function GetPollTitle() returns (string)
    {
        return PollTitle;
    }

    function IsFirstVisit (string aadhar) returns (bool)
    {
        bytes32 hashAadhar = GetHash(aadhar);
        bool result = true;
        for (uint i = 0; i < TotalVoteCount; i ++)
        {
            bytes32 listHash = AadharHashList[i];
            if(listHash==hashAadhar)
                return result;
        }
        return result;
    }
}

