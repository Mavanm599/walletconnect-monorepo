// @ts-nocheck
import "mocha";
import {
  expect,
  initTwoClients,
  testConnectMethod,
  TEST_APPROVE_PARAMS,
  TEST_CONNECT_PARAMS,
  TEST_REJECT_PARAMS,
  TEST_UPDATE_ACCOUNTS_PARAMS,
  TEST_UPDATE_EXPIRY_PARAMS,
  TEST_REQUEST_PARAMS,
  TEST_EMIT_PARAMS,
  TEST_RESPOND_PARAMS,
  TEST_UPDATE_NAMESPACES_PARAMS,
} from "./shared";
import Client from "../src";
import { calcExpiry } from "@walletconnect/utils";
import { ONE_MINUTE, SEVEN_DAYS } from "@walletconnect/time";

let client: Client;
let pairingTopic: string;
let topic: string;

describe("Client Validation", () => {
  before(async () => {
    const clients = await initTwoClients();
    await testConnectMethod(clients);
    client = clients.A;
    pairingTopic = client.pairing.keys[0];
    topic = client.session.keys[0];
  });

  describe("connect", () => {
    it("throws when no params are passed", async () => {
      await expect(client.connect()).to.eventually.be.rejectedWith(
        "Missing or invalid connect params",
      );
    });

    it("throws when invalid pairingTopic is provided", async () => {
      await expect(
        client.connect({ ...TEST_CONNECT_PARAMS, pairingTopic: 123 }),
      ).to.eventually.be.rejectedWith("Missing or invalid connect pairingTopic");
    });

    it("throws when empty pairingTopic is provided", async () => {
      await expect(
        client.connect({ ...TEST_CONNECT_PARAMS, pairingTopic: "" }),
      ).to.eventually.be.rejectedWith("Missing or invalid connect pairingTopic");
    });

    it("throws when non existant pairingTopic is provided", async () => {
      await expect(
        client.connect({ ...TEST_CONNECT_PARAMS, pairingTopic: "none" }),
      ).to.eventually.be.rejectedWith("No matching pairing with topic: none");
    });

    it("throws when empty namespaces are provided", async () => {
      await expect(
        client.connect({ ...TEST_CONNECT_PARAMS, pairingTopic, namespaces: [] }),
      ).to.eventually.be.rejectedWith("Missing or invalid connect namespaces");
    });

    it("throws when invalid namespaces are provided", async () => {
      await expect(
        client.connect({ ...TEST_CONNECT_PARAMS, pairingTopic, namespaces: {} }),
      ).to.eventually.be.rejectedWith("Missing or invalid connect namespaces");
    });
  });

  describe("pair", () => {
    it("throws when no params are passed", async () => {
      await expect(client.pair()).to.eventually.be.rejectedWith("Missing or invalid pair params");
    });

    it("throws when empty uri is provided", async () => {
      await expect(client.pair({ uri: "" })).to.eventually.be.rejectedWith(
        "Missing or invalid pair uri",
      );
    });

    it("throws when invalid uri is provided", async () => {
      await expect(client.pair({ uri: 123 })).to.eventually.be.rejectedWith(
        "Missing or invalid pair uri",
      );
    });

    it("throws when no uri is provided", async () => {
      await expect(client.pair({ uri: undefined })).to.eventually.be.rejectedWith(
        "Missing or invalid pair uri",
      );
    });
  });

  describe("approve", () => {
    it("throws when no params are passed", async () => {
      await expect(client.approve()).to.eventually.be.rejectedWith(
        "Missing or invalid approve params",
      );
    });

    it("throws when invalid id is provided", async () => {
      await expect(
        client.approve({ ...TEST_APPROVE_PARAMS, id: "123" }),
      ).to.eventually.be.rejectedWith("Missing or invalid approve id");
    });

    it("throws when empty id is provided", async () => {
      await expect(
        client.approve({ ...TEST_APPROVE_PARAMS, id: "" }),
      ).to.eventually.be.rejectedWith("Missing or invalid approve id");
    });

    it("throws when no id is provided", async () => {
      await expect(
        client.approve({ ...TEST_APPROVE_PARAMS, id: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid approve id");
    });

    it("throws when invalid accounts are provided", async () => {
      await expect(
        client.approve({ ...TEST_APPROVE_PARAMS, accounts: [123] }),
      ).to.eventually.be.rejectedWith("Missing or invalid approve accounts");
      await expect(
        client.approve({ ...TEST_APPROVE_PARAMS, accounts: ["123"] }),
      ).to.eventually.be.rejectedWith("Missing or invalid approve accounts");
    });

    it("throws when empty accounts are provided", async () => {
      await expect(
        client.approve({ ...TEST_APPROVE_PARAMS, accounts: [] }),
      ).to.eventually.be.rejectedWith("Missing or invalid approve accounts");
    });

    it("throws when no accounts are provided", async () => {
      await expect(
        client.approve({ ...TEST_APPROVE_PARAMS, accounts: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid approve accounts");
    });

    it("throws when invalid namespaces are provided", async () => {
      await expect(
        client.approve({ ...TEST_APPROVE_PARAMS, namespaces: {} }),
      ).to.eventually.be.rejectedWith("Missing or invalid approve namespaces");
    });

    it("throws when empty namespaces are provided", async () => {
      await expect(
        client.approve({ ...TEST_APPROVE_PARAMS, namespaces: [] }),
      ).to.eventually.be.rejectedWith("Missing or invalid approve namespaces");
    });

    it("throws when no namespaces are provided", async () => {
      await expect(
        client.approve({ ...TEST_APPROVE_PARAMS, namespaces: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid approve namespaces");
    });

    it("throws when invalid relayProtocol are provided", async () => {
      await expect(
        client.approve({ ...TEST_APPROVE_PARAMS, relayProtocol: 123 }),
      ).to.eventually.be.rejectedWith("Missing or invalid approve relayProtocol");
    });

    it("throws when empty relayProtocol is provided", async () => {
      await expect(
        client.approve({ ...TEST_APPROVE_PARAMS, relayProtocol: "" }),
      ).to.eventually.be.rejectedWith("Missing or invalid approve relayProtocol");
    });
  });

  describe("reject", () => {
    it("throws when no params are passed", async () => {
      await expect(client.reject()).to.eventually.be.rejectedWith(
        "Missing or invalid reject params",
      );
    });

    it("throws when invalid id is provided", async () => {
      await expect(
        client.reject({ ...TEST_REJECT_PARAMS, id: "123" }),
      ).to.eventually.be.rejectedWith("Missing or invalid reject id");
    });

    it("throws when empty id is provided", async () => {
      await expect(client.reject({ ...TEST_REJECT_PARAMS, id: "" })).to.eventually.be.rejectedWith(
        "Missing or invalid reject id",
      );
    });

    it("throws when no id is provided", async () => {
      await expect(
        client.reject({ ...TEST_REJECT_PARAMS, id: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid reject id");
    });

    it("throws when empty reason is provided", async () => {
      await expect(
        client.reject({ ...TEST_REJECT_PARAMS, reason: {} }),
      ).to.eventually.be.rejectedWith("Missing or invalid reject reason");
    });

    it("throws when invalid reason is provided", async () => {
      await expect(
        client.reject({ ...TEST_REJECT_PARAMS, reason: [] }),
      ).to.eventually.be.rejectedWith("Missing or invalid reject reason");
    });

    it("throws when no reason is provided", async () => {
      await expect(
        client.reject({ ...TEST_REJECT_PARAMS, reason: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid reject reason");
    });

    it("throws when invalid reason code is provided", async () => {
      await expect(
        client.reject({
          ...TEST_REJECT_PARAMS,
          reason: { ...TEST_REJECT_PARAMS.reason, code: "1" },
        }),
      ).to.eventually.be.rejectedWith("Missing or invalid reject reason");
    });

    it("throws when empty reason code is provided", async () => {
      await expect(
        client.reject({
          ...TEST_REJECT_PARAMS,
          reason: { ...TEST_REJECT_PARAMS.reason, code: "" },
        }),
      ).to.eventually.be.rejectedWith("Missing or invalid reject reason");
    });

    it("throws when no reason code is provided", async () => {
      await expect(
        client.reject({
          ...TEST_REJECT_PARAMS,
          reason: { ...TEST_REJECT_PARAMS.reason, code: undefined },
        }),
      ).to.eventually.be.rejectedWith("Missing or invalid reject reason");
    });

    it("throws when invalid reason message is provided", async () => {
      await expect(
        client.reject({
          ...TEST_REJECT_PARAMS,
          reason: { ...TEST_REJECT_PARAMS.reason, message: 123 },
        }),
      ).to.eventually.be.rejectedWith("Missing or invalid reject reason");
    });

    it("throws when empty reason message is provided", async () => {
      await expect(
        client.reject({
          ...TEST_REJECT_PARAMS,
          reason: { ...TEST_REJECT_PARAMS.reason, message: "" },
        }),
      ).to.eventually.be.rejectedWith("Missing or invalid reject reason");
    });

    it("throws when no reason message is provided", async () => {
      await expect(
        client.reject({
          ...TEST_REJECT_PARAMS,
          reason: { ...TEST_REJECT_PARAMS.reason, message: undefined },
        }),
      ).to.eventually.be.rejectedWith("Missing or invalid reject reason");
    });
  });

  describe("updateAccounts", () => {
    it("throws when no params are passed", async () => {
      await expect(client.updateAccounts()).to.eventually.be.rejectedWith(
        "Missing or invalid updateAccounts params",
      );
    });

    it("throws when invalid topic is provided", async () => {
      await expect(
        client.updateAccounts({ ...TEST_UPDATE_ACCOUNTS_PARAMS, topic: 123 }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateAccounts topic");
    });

    it("throws when empty topic is provided", async () => {
      await expect(
        client.updateAccounts({ ...TEST_UPDATE_ACCOUNTS_PARAMS, topic: "" }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateAccounts topic");
    });

    it("throws when no topic is provided", async () => {
      await expect(
        client.updateAccounts({ ...TEST_UPDATE_ACCOUNTS_PARAMS, topic: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateAccounts topic");
    });

    it("throws when non existant topic is provided", async () => {
      await expect(
        client.updateAccounts({ ...TEST_UPDATE_ACCOUNTS_PARAMS, topic: "none" }),
      ).to.eventually.be.rejectedWith("No matching session with topic: none");
    });

    it("throws when invalid accounts are provided", async () => {
      await expect(client.updateAccounts({ topic, accounts: [123] })).to.eventually.be.rejectedWith(
        "Missing or invalid updateAccounts accounts",
      );
      await expect(
        client.updateAccounts({ topic, accounts: ["123"] }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateAccounts accounts");
    });

    it("throws when no accounts are provided", async () => {
      await expect(
        client.updateAccounts({ topic, accounts: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateAccounts accounts");
    });

    it("throws when provided accounts are not in session namespace", async () => {
      await expect(
        client.updateAccounts({
          topic,
          accounts: [
            "eip155:42:0x3c582121909DE92Dc89A36898633C1aE4790382b",
            "eip155:10:0x3c582121909DE92Dc89A36898633C1aE4790382b",
          ],
        }),
      ).to.eventually.be.rejectedWith(
        "Invalid accounts with mismatched chains: eip155:42,eip155:10",
      );
    });
  });

  describe("updateNamespaces", () => {
    it("throws when no params are passed", async () => {
      await expect(client.updateNamespaces()).to.eventually.be.rejectedWith(
        "Missing or invalid updateNamespaces params",
      );
    });

    it("throws when invalid topic is provided", async () => {
      await expect(
        client.updateNamespaces({ ...TEST_UPDATE_NAMESPACES_PARAMS, topic: 123 }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateNamespaces topic");
    });

    it("throws when empty topic is provided", async () => {
      await expect(
        client.updateNamespaces({ ...TEST_UPDATE_NAMESPACES_PARAMS, topic: "" }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateNamespaces topic");
    });

    it("throws when no topic is provided", async () => {
      await expect(
        client.updateNamespaces({ ...TEST_UPDATE_NAMESPACES_PARAMS, topic: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateNamespaces topic");
    });

    it("throws when non existant topic is provided", async () => {
      await expect(
        client.updateNamespaces({ ...TEST_UPDATE_NAMESPACES_PARAMS, topic: "none" }),
      ).to.eventually.be.rejectedWith("No matching session with topic: none");
    });

    it("throws when invalid namespaces are provided", async () => {
      await expect(
        client.updateNamespaces({ topic, namespaces: {} }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateNamespaces namespaces");
    });

    it("throws when empty namespaces are provided", async () => {
      await expect(
        client.updateNamespaces({ topic, namespaces: [] }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateNamespaces namespaces");
    });

    it("throws when no namespaces are provided", async () => {
      await expect(
        client.updateNamespaces({ topic, namespaces: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateNamespaces namespaces");
    });
  });

  describe("updateExpiry", () => {
    it("throws when no params are passed", async () => {
      await expect(client.updateExpiry()).to.eventually.be.rejectedWith(
        "Missing or invalid updateExpiry params",
      );
    });

    it("throws when invalid topic is provided", async () => {
      await expect(
        client.updateExpiry({ ...TEST_UPDATE_EXPIRY_PARAMS, topic: 123 }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateExpiry topic");
    });

    it("throws when empty topic is provided", async () => {
      await expect(
        client.updateExpiry({ ...TEST_UPDATE_EXPIRY_PARAMS, topic: "" }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateExpiry topic");
    });

    it("throws when no topic is provided", async () => {
      await expect(
        client.updateExpiry({ ...TEST_UPDATE_EXPIRY_PARAMS, topic: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid updateExpiry topic");
    });

    it("throws when non existant topic is provided", async () => {
      await expect(
        client.updateExpiry({ ...TEST_UPDATE_EXPIRY_PARAMS, topic: "none" }),
      ).to.eventually.be.rejectedWith("No matching session with topic: none");
    });

    it("throws when invalid expiry is provided", async () => {
      await expect(client.updateExpiry({ topic, expiry: "1" })).to.eventually.be.rejectedWith(
        "Missing or invalid updateExpiry expiry (min 5 min, max 7 days)",
      );
    });

    it("throws when no expiry is provided", async () => {
      await expect(client.updateExpiry({ topic, expiry: undefined })).to.eventually.be.rejectedWith(
        "Missing or invalid updateExpiry expiry (min 5 min, max 7 days)",
      );
    });

    it("throws when expiry is less than 5 minutes", async () => {
      await expect(
        client.updateExpiry({ topic, expiry: calcExpiry(ONE_MINUTE) }),
      ).to.eventually.be.rejectedWith(
        "Missing or invalid updateExpiry expiry (min 5 min, max 7 days)",
      );
    });

    it("throws when expiry is more than 7 days", async () => {
      await expect(
        client.updateExpiry({ topic, expiry: calcExpiry(SEVEN_DAYS + ONE_MINUTE) }),
      ).to.eventually.be.rejectedWith(
        "Missing or invalid updateExpiry expiry (min 5 min, max 7 days)",
      );
    });
  });

  describe("request", () => {
    it("throws when no params are passed", async () => {
      await expect(client.request()).to.eventually.be.rejectedWith(
        "Missing or invalid request params",
      );
    });

    it("throws when invalid topic is provided", async () => {
      await expect(
        client.request({ ...TEST_REQUEST_PARAMS, topic: 123 }),
      ).to.eventually.be.rejectedWith("Missing or invalid request topic");
    });

    it("throws when empty topic is provided", async () => {
      await expect(
        client.request({ ...TEST_REQUEST_PARAMS, topic: "" }),
      ).to.eventually.be.rejectedWith("Missing or invalid request topic");
    });

    it("throws when no topic is provided", async () => {
      await expect(
        client.request({ ...TEST_REQUEST_PARAMS, topic: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid request topic");
    });

    it("throws when non existant topic is provided", async () => {
      await expect(
        client.request({ ...TEST_REQUEST_PARAMS, topic: "none" }),
      ).to.eventually.be.rejectedWith("No matching session with topic: none");
    });

    it("throws when invalid chainId is provided", async () => {
      await expect(
        client.request({ ...TEST_REQUEST_PARAMS, topic, chainId: 123 }),
      ).to.eventually.be.rejectedWith("Missing or invalid request chainId");
    });

    it("throws when empty chainId is provided", async () => {
      await expect(
        client.request({ ...TEST_REQUEST_PARAMS, topic, chainId: "" }),
      ).to.eventually.be.rejectedWith("Missing or invalid request chainId");
    });

    it("throws when invalid request is provided", async () => {
      await expect(
        client.request({ ...TEST_REQUEST_PARAMS, topic, request: 123 }),
      ).to.eventually.be.rejectedWith("Missing or invalid request method");
    });

    it("throws when empty request is provided", async () => {
      await expect(
        client.request({ ...TEST_REQUEST_PARAMS, topic, request: {} }),
      ).to.eventually.be.rejectedWith("Missing or invalid request method");
    });

    it("throws when no request is provided", async () => {
      await expect(
        client.request({ ...TEST_REQUEST_PARAMS, topic, request: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid request method");
    });

    it("throws when invalid request method is provided", async () => {
      await expect(
        client.request({ ...TEST_REQUEST_PARAMS, topic, request: { method: 123 } }),
      ).to.eventually.be.rejectedWith("Missing or invalid request method");
    });

    it("throws when empty request method is provided", async () => {
      await expect(
        client.request({ ...TEST_REQUEST_PARAMS, topic, request: { method: "" } }),
      ).to.eventually.be.rejectedWith("Missing or invalid request method");
    });

    it("throws when no request method is provided", async () => {
      await expect(
        client.request({ ...TEST_REQUEST_PARAMS, topic, request: { method: undefined } }),
      ).to.eventually.be.rejectedWith("Missing or invalid request method");
    });

    it("throws when request doesn't exist for given chainId", async () => {
      await expect(
        client.request({ ...TEST_REQUEST_PARAMS, topic, request: { method: "unknown" } }),
      ).to.eventually.be.rejectedWith("Missing or invalid request method");
    });
  });

  describe("respond", () => {
    it("throws when no params are passed", async () => {
      await expect(client.respond()).to.eventually.be.rejectedWith(
        "Missing or invalid respond params",
      );
    });

    it("throws when invalid topic is provided", async () => {
      await expect(
        client.respond({ ...TEST_REQUEST_PARAMS, topic: 123 }),
      ).to.eventually.be.rejectedWith("Missing or invalid respond topic");
    });

    it("throws when empty topic is provided", async () => {
      await expect(
        client.respond({ ...TEST_RESPOND_PARAMS, topic: "" }),
      ).to.eventually.be.rejectedWith("Missing or invalid respond topic");
    });

    it("throws when no topic is provided", async () => {
      await expect(
        client.respond({ ...TEST_RESPOND_PARAMS, topic: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid respond topic");
    });

    it("throws when no response or error is passed", async () => {
      await expect(
        client.respond({ ...TEST_RESPOND_PARAMS, topic, response: undefined, error: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid respond response");
    });

    it("throws when no id is passed", async () => {
      await expect(
        client.respond({
          ...TEST_RESPOND_PARAMS,
          topic,
          response: { ...TEST_RESPOND_PARAMS.response, id: undefined },
        }),
      ).to.eventually.be.rejectedWith("Missing or invalid respond response");
    });

    it("throws when invalid id is passed", async () => {
      await expect(
        client.respond({
          ...TEST_RESPOND_PARAMS,
          topic,
          response: { ...TEST_RESPOND_PARAMS.response, id: "123" },
        }),
      ).to.eventually.be.rejectedWith("Missing or invalid respond response");
    });

    it("throws when no jsonrpc is passed", async () => {
      await expect(
        client.respond({
          ...TEST_RESPOND_PARAMS,
          topic,
          response: { ...TEST_RESPOND_PARAMS.response, jsonrpc: undefined },
        }),
      ).to.eventually.be.rejectedWith("Missing or invalid respond response");
    });

    it("throws when invalid jsonrpc is passed", async () => {
      await expect(
        client.respond({
          ...TEST_RESPOND_PARAMS,
          topic,
          response: { ...TEST_RESPOND_PARAMS.response, jsonrpc: 123 },
        }),
      ).to.eventually.be.rejectedWith("Missing or invalid respond response");
    });

    it("throws when empty jsonrpc is passed", async () => {
      await expect(
        client.respond({
          ...TEST_RESPOND_PARAMS,
          topic,
          response: { ...TEST_RESPOND_PARAMS.response, jsonrpc: "" },
        }),
      ).to.eventually.be.rejectedWith("Missing or invalid respond response");
    });
  });

  describe("ping", () => {
    it("throws when no params are passed", async () => {
      await expect(client.ping()).to.eventually.be.rejectedWith("Missing or invalid ping params");
    });

    it("throws when invalid topic is provided", async () => {
      await expect(client.ping({ topic: 123 })).to.eventually.be.rejectedWith(
        "Missing or invalid ping topic",
      );
    });

    it("throws when empty topic is provided", async () => {
      await expect(client.ping({ topic: "" })).to.eventually.be.rejectedWith(
        "Missing or invalid ping topic",
      );
    });

    it("throws when no topic is provided", async () => {
      await expect(client.ping({ topic: undefined })).to.eventually.be.rejectedWith(
        "Missing or invalid ping topic",
      );
    });

    it("throws when non existant topic is provided", async () => {
      await expect(client.ping({ topic: "none" })).to.eventually.be.rejectedWith(
        "No matching pairing or session with topic: none",
      );
    });
  });

  describe("emit", () => {
    it("throws when no params are passed", async () => {
      await expect(client.emit()).to.eventually.be.rejectedWith("Missing or invalid emit params");
    });

    it("throws when invalid topic is provided", async () => {
      await expect(client.emit({ ...TEST_EMIT_PARAMS, topic: 123 })).to.eventually.be.rejectedWith(
        "Missing or invalid emit topic",
      );
    });

    it("throws when empty topic is provided", async () => {
      await expect(client.emit({ ...TEST_EMIT_PARAMS, topic: "" })).to.eventually.be.rejectedWith(
        "Missing or invalid emit topic",
      );
    });

    it("throws when no topic is provided", async () => {
      await expect(
        client.emit({ ...TEST_EMIT_PARAMS, topic: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid emit topic");
    });

    it("throws when non existant topic is provided", async () => {
      await expect(
        client.emit({ ...TEST_EMIT_PARAMS, topic: "none" }),
      ).to.eventually.be.rejectedWith("No matching session with topic: none");
    });

    it("throws when invalid chainId is provided", async () => {
      await expect(
        client.emit({ ...TEST_EMIT_PARAMS, topic, chainId: 123 }),
      ).to.eventually.be.rejectedWith("Missing or invalid emit chainId");
    });

    it("throws when empty chainId is provided", async () => {
      await expect(
        client.emit({ ...TEST_EMIT_PARAMS, topic, chainId: "" }),
      ).to.eventually.be.rejectedWith("Missing or invalid emit chainId");
    });

    it("throws when invalid event is provided", async () => {
      await expect(
        client.emit({ ...TEST_EMIT_PARAMS, topic, event: 123 }),
      ).to.eventually.be.rejectedWith("Missing or invalid emit event");
    });

    it("throws when empty event is provided", async () => {
      await expect(
        client.emit({ ...TEST_EMIT_PARAMS, topic, event: {} }),
      ).to.eventually.be.rejectedWith("Missing or invalid emit event");
    });

    it("throws when no event is provided", async () => {
      await expect(
        client.emit({ ...TEST_EMIT_PARAMS, topic, event: undefined }),
      ).to.eventually.be.rejectedWith("Missing or invalid emit event");
    });

    it("throws when invalid event name is provided", async () => {
      await expect(
        client.emit({ ...TEST_EMIT_PARAMS, topic, event: { name: 123 } }),
      ).to.eventually.be.rejectedWith("Missing or invalid emit event");
    });

    it("throws when empty event name is provided", async () => {
      await expect(
        client.emit({ ...TEST_EMIT_PARAMS, topic, event: { name: "" } }),
      ).to.eventually.be.rejectedWith("Missing or invalid emit event");
    });

    it("throws when no event name is provided", async () => {
      await expect(
        client.emit({ ...TEST_EMIT_PARAMS, topic, event: { name: undefined } }),
      ).to.eventually.be.rejectedWith("Missing or invalid emit event");
    });

    it("throws when event doesn't exist for given chainId", async () => {
      await expect(
        client.emit({ ...TEST_EMIT_PARAMS, topic, event: { name: "unknown" } }),
      ).to.eventually.be.rejectedWith("Missing or invalid emit event");
    });
  });

  describe("disconnect", () => {
    it("throws when no params are passed", async () => {
      await expect(client.disconnect()).to.eventually.be.rejectedWith(
        "Missing or invalid disconnect params",
      );
    });

    it("throws when invalid topic is provided", async () => {
      await expect(client.disconnect({ topic: 123 })).to.eventually.be.rejectedWith(
        "Missing or invalid disconnect topic",
      );
    });

    it("throws when empty topic is provided", async () => {
      await expect(client.disconnect({ topic: "" })).to.eventually.be.rejectedWith(
        "Missing or invalid disconnect topic",
      );
    });

    it("throws when no topic is provided", async () => {
      await expect(client.disconnect({ topic: undefined })).to.eventually.be.rejectedWith(
        "Missing or invalid disconnect topic",
      );
    });

    it("throws when non existant topic is provided", async () => {
      await expect(client.disconnect({ topic: "none" })).to.eventually.be.rejectedWith(
        "No matching pairing or session with topic: none",
      );
    });
  });
});