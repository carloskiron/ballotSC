import { expect } from "chai";
import { ethers } from "hardhat";
import { convertStringArrayToBytes32 } from "../scripts/util/scriptUtils";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

describe("Ballot", () => {
  let ballotContract: Ballot;

  beforeEach(async function () {
    const ballotFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployed();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("has zero votes for all proposals", async function () {
      const winningProposal = await ballotContract.winningProposal();
      expect(winningProposal.toNumber()).to.eq(0);
    });
    it("sets the deployer address as chairperson", async function () {
      const [deployer] = await ethers.getSigners();
      const chairPerson = await ballotContract.chairperson();
      expect(chairPerson).to.eq(deployer.address);
    });
    it("sets the voting weight for the chairperson as 1", async function () {
      const [deployer] = await ethers.getSigners();
      const voter = await ballotContract.voters(deployer.address);
      expect(voter.weight.toNumber()).to.eq(1);
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
    it("gives right to vote for another address", async function () {
      const [, voter] = await ethers.getSigners();
      const tx = await ballotContract.giveRightToVote(voter.address);
      const receipt = await tx.wait();
      const voter1 = await ballotContract.voters(voter.address);
      expect(voter1.weight.toNumber()).to.eq(1);
    });
    it("can not give right to vote for someone that has voted", async function () {
      const [, voter] = await ethers.getSigners();
      let tx = await ballotContract.giveRightToVote(voter.address);
      const receipt = await tx.wait();
      tx = await ballotContract.connect(voter).vote(1);
      const receipt2 = await tx.wait();
      await expect(ballotContract.connect(voter).vote(1)).to.be.rejectedWith(
        "Already voted."
      );
    });
    it("can not give right to vote for someone that has already voting rights", async function () {
      const [deployer, voter] = await ethers.getSigners();
      let tx = await ballotContract.giveRightToVote(voter.address);
      const receipt = await tx.wait();
      await expect(
        ballotContract.giveRightToVote(voter.address)
      ).to.be.rejectedWith();
    });
  });

  describe("when the voter interact with the vote function in the contract", function () {
    // TODO
    it("should register the vote", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the voter interact with the delegate function in the contract", function () {
    // TODO
    it("should transfer voting power", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the vote function in the contract", function () {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when the an attacker interact with the delegate function in the contract", function () {
    // TODO
    it("should revert", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function before any votes are cast", function () {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    // TODO
    it("should return 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winnerName function before any votes are cast", function () {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    // TODO
    it("should return name of proposal 0", async () => {
      throw Error("Not implemented");
    });
  });

  describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
    // TODO
    it("should return the name of the winner proposal", async () => {
      throw Error("Not implemented");
    });
  });
});
