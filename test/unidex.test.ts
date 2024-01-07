const { ethers } = require("hardhat");
const ERC20ABI = require('../contracts/utils/erc20abi.json');

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const DAI_DECIMALS = 18;
const SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const ercAbi = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    // Authenticated Functions
    "function transfer(address to, uint amount) returns (bool)",
    "function deposit() public payable",
    "function approve(address spender, uint256 amount) returns (bool)",
];


describe("🛠️ UniDEX swap testing", function() {

    it('Should provide a caller with more DAI than they started with after a swap',
        async function() {

            /* Deploy the SimpleSwap contract */
            const uniDexFactory = await ethers.getContractFactory("UniDEX");
            const dex = await uniDexFactory.deploy(SwapRouterAddress);
            await dex.waitForDeployment();
            let signers = await ethers.getSigners();

            /* Connect to WETH and wrap some eth  */
            const WETH = new ethers.Contract(WETH_ADDRESS, ercAbi, signers[0]);
            const deposit = await WETH.deposit({ value: ethers.parseEther("10")});
            await deposit.wait();
            const expandedWETHBalanceBefore = await WETH.balanceOf(signers[0].address);
            const WETHBalanceBefore = Number(ethers.formatUnits(expandedWETHBalanceBefore, DAI_DECIMALS));
            console.log("WETH balance:", WETHBalanceBefore);

            const DAI = new ethers.Contract(DAI_ADDRESS, ERC20ABI, signers[0]);
            const expandedDAIBalanceBefore = await DAI.balanceOf(signers[0].address);
            const DAIBalanceBefore = Number(ethers.formatUnits(expandedDAIBalanceBefore, DAI_DECIMALS));
            console.log("DAI balance:", DAIBalanceBefore);

            /* Approve the swapper contract to spend WETH for me */
            await WETH.approve(dex.target, ethers.parseEther("1"));

            const amountIn = ethers.parseEther("0.1");
            const swap = await dex.swapWETHForDAI(amountIn, { gasLimit: 300000 });
            await swap.wait();

            /* Check DAI end balance */
            const expandedDAIBalanceAfter = await DAI.balanceOf(signers[0].address);
            const DAIBalanceAfter = Number(ethers.formatUnits(expandedDAIBalanceAfter, DAI_DECIMALS));
            console.log("DAI balance after swap", DAIBalanceAfter);
        })
})