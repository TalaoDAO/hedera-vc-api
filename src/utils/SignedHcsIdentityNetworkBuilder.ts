/**
 * This file copy pasted from https://github.com/hashgraph/did-sdk-js/blob/21ef7af0171e1eecccb1db2b68fcdb2e956e501d/src/identity/hcs/hcs-identity-network-builder.ts#L5
 * As to add setAdminKey which is a privateKey used to signed the address book when uploaded in a FileTransaction.
 * Without signing the file, it's impossible to allow it to be deleted.
 */
// hedera sdk is CommonJS and won't be transpiled properly if not "required".
/* eslint-disable @typescript-eslint/no-var-requires */
const {
  Client,
  Hbar,
  TopicCreateTransaction,
  TopicId,
  PublicKey,
  PrivateKey,
  FileCreateTransaction
} = require("@hashgraph/sdk");

import { HcsIdentityNetwork, AddressBook } from "@hashgraph/did-sdk-js";

export class SignedHcsIdentityNetworkBuilder {
  private adminKey: typeof PrivateKey;
  private appnetName = "";
  private didTopicId: typeof TopicId;
  private vcTopicId: typeof TopicId;
  private network = "";
  private didServers: string[] = [];
  private publicKey: typeof PublicKey;
  private maxTransactionFee = new Hbar(2);
  private didTopicMemo: string = "";
  private vcTopicMemo: string = "";

  public async execute(client: typeof Client): Promise<HcsIdentityNetwork> {
    const didTopicCreateTransaction = new TopicCreateTransaction()
      .setMaxTransactionFee(this.maxTransactionFee)
      .setTopicMemo(this.didTopicMemo);

    if (this.publicKey) {
      didTopicCreateTransaction.setAdminKey(this.publicKey);
    }

    const didTxId = await didTopicCreateTransaction.execute(client);
    this.didTopicId = (await didTxId.getReceipt(client)).topicId;

    const vcTopicCreateTransaction = new TopicCreateTransaction()
      .setMaxTransactionFee(this.maxTransactionFee)
      .setTopicMemo(this.vcTopicMemo);

    if (this.publicKey) {
      vcTopicCreateTransaction.setAdminKey(this.publicKey);
    }

    const vcTxId = await vcTopicCreateTransaction.execute(client);
    this.vcTopicId = (await vcTxId.getReceipt(client)).topicId;

    const addressBook = AddressBook.create(
      this.appnetName,
      this.didTopicId.toString(),
      this.vcTopicId.toString(),
      this.didServers
    );

    const fileCreateTx = new FileCreateTransaction()
      .setKeys([this.adminKey.publicKey])
      .setContents(addressBook.toJSON())
      .freezeWith(client);

    const fileSignTx = await fileCreateTx.sign(this.adminKey);
    const response = await fileSignTx.execute(client);
    const receipt = await response.getReceipt(client);
    const fileId = receipt.fileId;

    addressBook.setFileId(fileId);

    return HcsIdentityNetwork.fromAddressBook(this.network, addressBook);
  }

  public setAdminKey(adminKey: typeof PrivateKey) {
    this.adminKey = adminKey;
    return this;
  }

  public addAppnetDidServer(serverUrl: string) {
    if (!this.didServers) {
      this.didServers = [];
    }

    if (this.didServers.indexOf(serverUrl) == -1) {
      this.didServers.push(serverUrl);
    }

    return this;
  }

  public setAppnetName(appnetName: string) {
    this.appnetName = appnetName;
    return this;
  }

  public setDidTopicMemo(didTopicMemo: string) {
    this.didTopicMemo = didTopicMemo;
    return this;
  }

  public setVCTopicMemo(vcTopicMemo: string) {
    this.vcTopicMemo = vcTopicMemo;
    return this;
  }

  public setDidTopicId(didTopicId: typeof TopicId) {
    this.didTopicId = didTopicId;
    return this;
  }

  public setVCTopicId(vcTopicId: typeof TopicId) {
    this.vcTopicId = vcTopicId;
    return this;
  }

  public setMaxTransactionFee(maxTransactionFee: typeof Hbar) {
    this.maxTransactionFee = maxTransactionFee;
    return this;
  }

  public setPublicKey(publicKey: typeof PublicKey) {
    this.publicKey = publicKey;
    return this;
  }

  public setNetwork(network: string) {
    this.network = network;
    return this;
  }
}
