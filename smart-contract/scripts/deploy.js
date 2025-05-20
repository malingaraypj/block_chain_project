const hre = require("hardhat");

async function main() {

  const ContentPlatform = await hre.ethers.getContractFactory("ContentPlatform");
  const contentPlatform = await ContentPlatform.deploy();

  await contentPlatform.waitForDeployment();

  console.log(
    `ContentPlatform deployed to ${contentPlatform.target}`
  );
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
