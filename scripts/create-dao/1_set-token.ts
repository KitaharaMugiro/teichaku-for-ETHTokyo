import { ethers } from "hardhat";

const daoId = "mydao";
const projectId = "myproject";
const daoHistoryAddress = "0x1e453D8255C829334317A3aF8C11D069641D44EC"
const tokenAddress = "0x296765fAA585C18b1d66204EEf5cdE899Eb6B523"
const contributorReward = ethers.utils.parseEther("7000");
const voterReward = ethers.utils.parseEther("3000");
async function main() {
    const token = await ethers.getContractAt("DAOToken", tokenAddress);
    const daoHistory = await ethers.getContractAt("DAOHistory", daoHistoryAddress);


    const pollAddress = await daoHistory.pollAddress(daoId, projectId);
    const poll = await ethers.getContractAt("Poll", pollAddress);

    await poll.setTokenAddress(token.address, "0x0000000000000000000000000000000000000000");
    await poll.setAssignmentToken(contributorReward, voterReward);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
