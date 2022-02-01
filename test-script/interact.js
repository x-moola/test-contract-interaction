const hre = require("hardhat");

let userAddr;
let tokenAddr;
let lendingPoolContractAddr;
let abiDataProviderAddr;

const abiMintableERC20 = require("../test-abi/MintableERC20.json");
const abiLendingPool = require("../test-abi/LendingPool.json");
const abiPriceOracle = require("../test-abi/PriceOracle.json");
const abiDataProvider = require("../test-abi/AaveProtocolDataProvider.json");

let tokenContract;
let lendingPoolContract;
let dataProviderContract;

async function setUpContract(user, token, lendingPool, priceOracle, dataProvider) {
  userAddr = user
  tokenAddr = token
  lendingPoolContractAddr = lendingPool
  priceOracleAddr = priceOracle
  dataProviderAddr = dataProvider

  tokenContract = await hre.ethers.getContractAt(
    abiMintableERC20,
    token
  );
  lendingPoolContract = await hre.ethers.getContractAt(
    abiLendingPool,
    lendingPool
  );
  priceOracleContract= await hre.ethers.getContractAt(
    abiPriceOracle,
    priceOracle
  )
  dataProviderContract= await hre.ethers.getContractAt(
    abiDataProvider,
    dataProvider
  )
}

async function mintToken(amount) {
  await tokenContract.mint(amount)
}

async function deposit(depositAmount) {
  await tokenContract.approve(lendingPoolContractAddr, depositAmount);
  await lendingPoolContract.deposit(tokenAddr, depositAmount, userAddr, 0);
}

async function borrow(amount, rate) {
  // rate: 1 for stable 2 for variable
  await lendingPoolContract.borrow(tokenAddr, amount, rate, 0, userAddr)
}

async function getReserveData() {
  const reserve = await lendingPoolContract.getReserveData(tokenAddr);

  console.log('reserve: ', reserve)
}

async function getUserTokenAmount() {
  const balance = await tokenContract.balanceOf(userAddr)

  console.log('user balance', balance)
}

async function getTokenPrice() {
  const price = await priceOracleContract.getAssetPrice(tokenAddr);

  console.log(`${tokenAddr} price is: `, price);
}

async function setTokenPrice(price) {
  await priceOracleContract.setAssetPrice(tokenAddr, price);
}

async function getUserReserveData() {
  const result = await dataProviderContract.getUserReserveData(tokenAddr, userAddr);

  console.log("Reserve data: ", result)
}

async function run() {
  const user = '0x8623de4d10eC1147874dAb2aEFd2BE1c759D7954';
  const token = '0xEB20AC8AE0ca1779160A92f2448fe952408B85C0'
  const lendingPool = '0xdA655FC5BA71Cb4573b139c204cB42081039861f'
  const priceOracle = '0xBc09eCc57dcCaCd05bFE72dA84B4E144176e573A'
  const dataProvider = '0x89006e664C9B7409a803eF6fDF3fAF0C9E4ffA72'

  const mintAmount = 10000;
  const depositAmount = 10000;
  const borrowAmount = 30;
  const borrowInterestMode = 2; // variable

  await setUpContract(user, token, lendingPool, priceOracle, dataProvider);

  // await getReserveData();
  // await getUserTokenAmount()

  // mint, deposit, borrow
  // await mintToken(mintAmount);
  // await deposit(depositAmount);
  // await borrow(borrowAmount, borrowInterestMode);

  // get price, set price
  // const priceToSet = 1000;
  // await setTokenPrice(priceToSet)
  // getTokenPrice()

  await getUserReserveData()

}

run()
