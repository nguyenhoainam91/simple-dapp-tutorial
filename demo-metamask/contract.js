/*global ethereum, MetamaskOnboarding */

/*
The `piggybankContract` is compiled from:

  pragma solidity ^0.4.0;
  contract PiggyBank {

      uint private balance;
      address public owner;

      function PiggyBank() public {
          owner = msg.sender;
          balance = 0;
      }

      function deposit() public payable returns (uint) {
          balance += msg.value;
          return balance;
      }

      function withdraw(uint withdrawAmount) public returns (uint remainingBal) {
          require(msg.sender == owner);
          balance -= withdrawAmount;

          msg.sender.transfer(withdrawAmount);

          return balance;
      }
  }
*/

const forwarderOrigin = "https://darkland.io/";

let accounts;

const initialize = () => {
  console.log("initialize");

  //You will start here
  //Basic Actions Section
  const onboardButton = document.getElementById("connectButton");
  const getAccountsButton = document.getElementById("getAccounts");
  const getAccountsResult = document.getElementById("getAccountsResult");

  // Dapp Status Section
  const networkDiv = document.getElementById("network");
  const chainIdDiv = document.getElementById("chainId");
  const accountsDiv = document.getElementById("accounts");

  function handleNewAccounts(newAccounts) {
    MetaMaskClientCheck();

    
  }

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  const isMetaMaskConnected = () => accounts && accounts.length > 0;

  //We create a new MetaMask onboarding object to use in our app
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
  //This will start the onboarding proccess
  const onClickInstall = () => {
    onboardButton.innerText = "Onboarding in progress";
    onboardButton.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };

  const getAccountInfo = async () => {
    try {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      accountsDiv.innerHTML = accounts[0] || "Not able to get accounts";

      const chainId = await ethereum.request({
        method: "eth_chainId",
      });

      chainIdDiv.innerHTML = chainId || "Not able to get accounts";

      const networkId = await ethereum.request({
        method: "net_version",
      });
      networkDiv.innerHTML = networkId || "Not able to get accounts";
      return accounts;
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      onboardButton.disabled = true;
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      await getAccountInfo();
    } catch (error) {
      console.error(error);
    }
  };

  const MetaMaskClientCheck = async () => {
    //Now we check to see if MetaMask is installed
    if (!isMetaMaskInstalled()) {
      console.log("metamask not installed");
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = "Click here to install MetaMask!";

      //When the button is clicked we call this function
      onboardButton.onclick = onClickInstall;
      //The button is now disabled
      onboardButton.disabled = false;
    } else {

      ethereum.on("accountsChanged", handleNewAccounts);

      console.log("metamask installed");

      const accountInfo = await getAccountInfo();

      if (accountInfo && accountInfo.length > 0) {
        onboardButton.innerText = "Connected";
        onboardButton.disabled = true;
      } else {
        //If it is installed we change our button text
        onboardButton.innerText = "Login with MetaMask";
        //When the button is clicked we call this function to connect the users MetaMask Wallet
        onboardButton.onclick = onClickConnect;
        //The button is now disabled
        onboardButton.disabled = false;

        networkDiv.innerHTML = "";
        chainIdDiv.innerHTML = "";
        accountsDiv.innerHTML = "";
      }

      
    }
  };
  MetaMaskClientCheck();

  //Eth_Accounts-getAccountsButton
  // getAccountsButton.addEventListener("click", async () => {
  //   //we use eth_accounts because it returns a list of addresses owned by us.
  //   const accounts = await ethereum.request({ method: "eth_accounts" });
  //   //We take the first address in the array of addresses and display it
  //   getAccountsResult.innerHTML = accounts[0] || "Not able to get accounts";
  // });
};
window.addEventListener("DOMContentLoaded", initialize);
