import { Contract, utils } from 'ethers';

export const submitContentForReview = async (contract, accounts, {
  _title,
  _description,
  _ipfsHash,
  _price,
  _contentType,
  _permissions
}) => {
  try {
    const transaction = await contract.submitContentForReview(
      _title,
      _description,
      _ipfsHash,
      _price,
      _contentType,
      _permissions,
      { from: accounts[0], gasLimit: 6000000 }
    );
    return transaction.wait();
  } catch (error) {
    console.error('Transaction error:', error);
    const reason = error.data?.message || error.reason || error.message;
    throw new Error(reason || 'Transaction failed');
  }
};

export const getCreatorContents = async (contract, creatorAddress) => {
  try {
    const contents = await contract.getCreatorContents(creatorAddress);
    return contents.map(content => ({
      id: content.id.toNumber(),
      creator: content.creator,
      title: content.title,
      description: content.description,
      price: utils.formatEther(content.price),
      contentType: parseInt(content.contentType),
    }));
  } catch (error) {
    console.error('Error fetching creator contents:', error);
    throw error;
  }
};