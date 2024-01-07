// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { ISwapRouter } from "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import { TransferHelper } from "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract UniDEX {

    ISwapRouter public immutable swapRouter;
    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    uint24 public constant feeTier = 3000;


    constructor(ISwapRouter _swapRouter) {
        swapRouter = ISwapRouter(_swapRouter);
    }

    function swapWETHForDAI(uint256 _amountIn) external returns (uint256 daiAmountOut){

        TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), _amountIn);
        TransferHelper.safeApprove(WETH9, address(swapRouter), _amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: WETH9,
            tokenOut: DAI,
            fee: feeTier,
            recipient: msg.sender,
            deadline: block.timestamp,
            amountIn: _amountIn,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });

        daiAmountOut = swapRouter.exactInputSingle(params);
        return daiAmountOut;
    }

}