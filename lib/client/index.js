"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BncClient = exports.checkNumber = exports.LedgerSigningDelegate = exports.DefaultBroadcastDelegate = exports.DefaultSigningDelegate = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _crypto = require("../crypto");

var crypto = _interopRequireWildcard(_crypto);

var _tx = require("../tx");

var _tx2 = _interopRequireDefault(_tx);

var _request = require("../utils/request");

var _request2 = _interopRequireDefault(_request);

var _big = require("big.js");

var _big2 = _interopRequireDefault(_big);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @module client
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */


var MAX_INT64 = Math.pow(2, 63);

var api = {
  broadcast: "/api/v1/broadcast",
  nodeInfo: "/api/v1/node-info",
  getAccount: "/api/v1/account",
  getMarkets: "/api/v1/markets"
};

var NETWORK_PREFIX_MAPPING = {
  "testnet": "tbnb",
  "mainnet": "bnb"

  /**
   * The default signing delegate which uses the local private key.
   * @param  {Transaction} tx      the transaction
   * @param  {Object}      signMsg the canonical sign bytes for the msg
   * @return {Transaction}
   */
};var DefaultSigningDelegate = exports.DefaultSigningDelegate = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(tx, signMsg) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", tx.sign(this.privateKey, signMsg));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function DefaultSigningDelegate(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * The default broadcast delegate which immediately broadcasts a transaction.
 * @param {Transaction} signedTx the signed transaction
 */
var DefaultBroadcastDelegate = exports.DefaultBroadcastDelegate = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(signedTx) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", this.sendTransaction(signedTx));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function DefaultBroadcastDelegate(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * The Ledger signing delegate.
 * @param  {LedgerApp}  ledgerApp
 * @param  {preSignCb}  function
 * @param  {postSignCb} function
 * @param  {errCb} function
 * @return {function}
 */
var LedgerSigningDelegate = exports.LedgerSigningDelegate = function LedgerSigningDelegate(ledgerApp, preSignCb, postSignCb, errCb, hdPath) {
  return function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(tx, signMsg) {
      var signBytes, pubKeyResp, sigResp, pubKey;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              signBytes = tx.getSignBytes(signMsg);

              preSignCb && preSignCb(signBytes);
              pubKeyResp = void 0, sigResp = void 0;
              _context3.prev = 3;
              _context3.next = 6;
              return ledgerApp.getPublicKey(hdPath);

            case 6:
              pubKeyResp = _context3.sent;
              _context3.next = 9;
              return ledgerApp.sign(signBytes, hdPath);

            case 9:
              sigResp = _context3.sent;

              postSignCb && postSignCb(pubKeyResp, sigResp);
              _context3.next = 17;
              break;

            case 13:
              _context3.prev = 13;
              _context3.t0 = _context3["catch"](3);

              console.warn("LedgerSigningDelegate error", _context3.t0);
              errCb && errCb(_context3.t0);

            case 17:
              if (!(sigResp && sigResp.signature)) {
                _context3.next = 20;
                break;
              }

              pubKey = crypto.getPublicKey(pubKeyResp.pk.toString("hex"));
              return _context3.abrupt("return", tx.addSignature(pubKey, sigResp.signature));

            case 20:
              return _context3.abrupt("return", tx);

            case 21:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[3, 13]]);
    }));

    return function (_x4, _x5) {
      return _ref3.apply(this, arguments);
    };
  }();
};

/**
 * validate the input number.
 * @param {Number} value
 */
var checkNumber = exports.checkNumber = function checkNumber(value) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "input number";

  if (value <= 0) {
    throw new Error(name + " should be a positive number");
  }

  if (MAX_INT64 <= value) {
    throw new Error(name + " should be less than 2^63");
  }
};

/**
 * The Binance Chain client.
 */

var BncClient = function () {
  /**
   * @param {string} server Binance Chain public url
   * @param {Boolean} useAsyncBroadcast use async broadcast mode, faster but less guarantees (default off)
   */
  function BncClient(server) {
    var useAsyncBroadcast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, BncClient);

    if (!server) {
      throw new Error("Binance chain server should not be null");
    }
    this._httpClient = new _request2.default(server);
    this._signingDelegate = DefaultSigningDelegate;
    this._broadcastDelegate = DefaultBroadcastDelegate;
    this._useAsyncBroadcast = useAsyncBroadcast;
  }

  /**
   * Initialize the client with the chain's ID. Asynchronous.
   * @return {Promise}
   */


  _createClass(BncClient, [{
    key: "initChain",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var data;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.chainId) {
                  _context4.next = 5;
                  break;
                }

                _context4.next = 3;
                return this._httpClient.request("get", api.nodeInfo);

              case 3:
                data = _context4.sent;

                this.chainId = data.result.node_info && data.result.node_info.network;

              case 5:
                return _context4.abrupt("return", this);

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function initChain() {
        return _ref4.apply(this, arguments);
      }

      return initChain;
    }()

    /**
     * @param {String} network Indicate testnet or mainnet
     */

  }, {
    key: "chooseNetwork",
    value: function chooseNetwork(network) {
      this.addressPrefix = NETWORK_PREFIX_MAPPING[network] || "tbnb";
      this.network = NETWORK_PREFIX_MAPPING[network] ? network : "testnet";
    }

    /**
     * Sets the client's private key for calls made by this client. Asynchronous.
     * @return {Promise}
     */

  }, {
    key: "setPrivateKey",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(privateKey) {
        var address, promise, data;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(privateKey !== this.privateKey)) {
                  _context5.next = 13;
                  break;
                }

                address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);

                if (address) {
                  _context5.next = 4;
                  break;
                }

                throw new Error("address is falsy: ${address}. invalid private key?");

              case 4:
                if (!(address === this.address)) {
                  _context5.next = 6;
                  break;
                }

                return _context5.abrupt("return", this);

              case 6:
                // safety
                this.privateKey = privateKey;
                this.address = address;
                // _setPkPromise used in _sendTransaction for non-await calls
                promise = this._setPkPromise = this._httpClient.request("get", api.getAccount + "/" + address);
                _context5.next = 11;
                return promise;

              case 11:
                data = _context5.sent;

                this.account_number = data.result.account_number;

              case 13:
                return _context5.abrupt("return", this);

              case 14:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function setPrivateKey(_x8) {
        return _ref5.apply(this, arguments);
      }

      return setPrivateKey;
    }()

    /**
     * Use async broadcast mode. Broadcasts faster with less guarantees (default off)
     * @param {Boolean} useAsyncBroadcast
     * @return {BncClient} this instance (for chaining)
     */

  }, {
    key: "useAsyncBroadcast",
    value: function useAsyncBroadcast() {
      var _useAsyncBroadcast = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this._useAsyncBroadcast = _useAsyncBroadcast;
      return this;
    }

    /**
     * Sets the signing delegate (for wallet integrations).
     * @param {function} delegate
     * @return {BncClient} this instance (for chaining)
     */

  }, {
    key: "setSigningDelegate",
    value: function setSigningDelegate(delegate) {
      if (typeof delegate !== "function") throw new Error("signing delegate must be a function");
      this._signingDelegate = delegate;
      return this;
    }

    /**
     * Sets the broadcast delegate (for wallet integrations).
     * @param {function} delegate
     * @return {BncClient} this instance (for chaining)
     */

  }, {
    key: "setBroadcastDelegate",
    value: function setBroadcastDelegate(delegate) {
      if (typeof delegate !== "function") throw new Error("broadcast delegate must be a function");
      this._broadcastDelegate = delegate;
      return this;
    }

    /**
     * Applies the default signing delegate.
     * @return {BncClient} this instance (for chaining)
     */

  }, {
    key: "useDefaultSigningDelegate",
    value: function useDefaultSigningDelegate() {
      this._signingDelegate = DefaultSigningDelegate;
      return this;
    }

    /**
     * Applies the default broadcast delegate.
     * @return {BncClient} this instance (for chaining)
     */

  }, {
    key: "useDefaultBroadcastDelegate",
    value: function useDefaultBroadcastDelegate() {
      this._broadcastDelegate = DefaultBroadcastDelegate;
      return this;
    }

    /**
     * Applies the Ledger signing delegate.
     * @param {function} ledgerApp
     * @param {function} preSignCb
     * @param {function} postSignCb
     * @param {function} errCb
     * @return {BncClient} this instance (for chaining)
     */

  }, {
    key: "useLedgerSigningDelegate",
    value: function useLedgerSigningDelegate(ledgerApp, preSignCb, postSignCb, errCb, hdPath) {
      this._signingDelegate = LedgerSigningDelegate(ledgerApp, preSignCb, postSignCb, errCb, hdPath);
      return this;
    }

    /**
     * Transfer tokens from one address to another.
     * @param {String} fromAddress
     * @param {String} toAddress
     * @param {Number} amount
     * @param {String} asset
     * @param {String} memo optional memo
     * @param {Number} sequence optional sequence
     * @return {Object} response (success or fail)
     */

  }, {
    key: "transfer",
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(fromAddress, toAddress, amount, asset) {
        var memo = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
        var sequence = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
        var accCode, toAccCode, coin, msg, signMsg, signedTx;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                accCode = crypto.decodeAddress(fromAddress);
                toAccCode = crypto.decodeAddress(toAddress);

                amount = parseInt(amount * Math.pow(10, 8));

                checkNumber(amount, "amount");

                coin = {
                  denom: asset,
                  amount: amount
                };
                msg = {
                  inputs: [{
                    address: accCode,
                    coins: [coin]
                  }],
                  outputs: [{
                    address: toAccCode,
                    coins: [coin]
                  }],
                  msgType: "MsgSend"
                };
                signMsg = {
                  inputs: [{
                    address: fromAddress,
                    coins: [{
                      amount: amount,
                      denom: asset
                    }]
                  }],
                  outputs: [{
                    address: toAddress,
                    coins: [{
                      amount: amount,
                      denom: asset
                    }]
                  }]
                };
                _context6.next = 9;
                return this._prepareTransaction(msg, signMsg, fromAddress, sequence, memo);

              case 9:
                signedTx = _context6.sent;
                return _context6.abrupt("return", this._broadcastDelegate(signedTx));

              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function transfer(_x12, _x13, _x14, _x15) {
        return _ref6.apply(this, arguments);
      }

      return transfer;
    }()

    /**
     * Cancel an order.
     * @param {String} fromAddress
     * @param {String} symbol the market pair
     * @param {String} refid the order ID of the order to cancel
     * @param {Number} sequence optional sequence
     * @return {Object} response (success or fail)
     */

  }, {
    key: "cancelOrder",
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(fromAddress, symbol, refid) {
        var sequence = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var accCode, msg, signMsg, signedTx;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                accCode = crypto.decodeAddress(fromAddress);
                msg = {
                  sender: accCode,
                  symbol: symbol,
                  refid: refid,
                  msgType: "CancelOrderMsg"
                };
                signMsg = {
                  refid: refid,
                  sender: fromAddress,
                  symbol: symbol
                };
                _context7.next = 5;
                return this._prepareTransaction(msg, signMsg, fromAddress, sequence, "");

              case 5:
                signedTx = _context7.sent;
                return _context7.abrupt("return", this._broadcastDelegate(signedTx));

              case 7:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function cancelOrder(_x17, _x18, _x19) {
        return _ref7.apply(this, arguments);
      }

      return cancelOrder;
    }()

    /**
     * Place an order.
     * @param {String} address
     * @param {String} symbol the market pair
     * @param {Number} side (1-Buy, 2-Sell)
     * @param {Number} price
     * @param {Number} quantity
     * @param {Number} sequence optional sequence
     * @param {Number} timeinforce (1-GTC(Good Till Expire), 3-IOC(Immediate or Cancel))
     * @return {Object} response (success or fail)
     */

  }, {
    key: "placeOrder",
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var address = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.address;
        var symbol = arguments[1];
        var side = arguments[2];
        var price = arguments[3];
        var quantity = arguments[4];
        var sequence = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
        var timeinforce = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;
        var accCode, data, bigPrice, bigQuantity, placeOrderMsg, signMsg, signedTx;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (address) {
                  _context8.next = 2;
                  break;
                }

                throw new Error("address should not be falsy");

              case 2:
                if (symbol) {
                  _context8.next = 4;
                  break;
                }

                throw new Error("symbol should not be falsy");

              case 4:
                if (!(side !== 1 && side !== 2)) {
                  _context8.next = 6;
                  break;
                }

                throw new Error("side can only be 1 or 2");

              case 6:
                if (!(timeinforce !== 1 && timeinforce !== 3)) {
                  _context8.next = 8;
                  break;
                }

                throw new Error("timeinforce can only be 1 or 3");

              case 8:
                accCode = crypto.decodeAddress(address);

                if (!(sequence !== 0 && !sequence)) {
                  _context8.next = 14;
                  break;
                }

                _context8.next = 12;
                return this._httpClient.request("get", api.getAccount + "/" + address);

              case 12:
                data = _context8.sent;

                sequence = data.result && data.result.sequence;

              case 14:
                bigPrice = new _big2.default(price);
                bigQuantity = new _big2.default(quantity);
                placeOrderMsg = {
                  sender: accCode,
                  id: (accCode.toString("hex") + "-" + (sequence + 1)).toUpperCase(),
                  symbol: symbol,
                  ordertype: 2,
                  side: side,
                  price: parseFloat(bigPrice.mul(Math.pow(10, 8)).toString(), 10),
                  quantity: parseFloat(bigQuantity.mul(Math.pow(10, 8)).toString(), 10),
                  timeinforce: timeinforce,
                  msgType: "NewOrderMsg"
                };
                signMsg = {
                  id: placeOrderMsg.id,
                  ordertype: placeOrderMsg.ordertype,
                  price: placeOrderMsg.price,
                  quantity: placeOrderMsg.quantity,
                  sender: address,
                  side: placeOrderMsg.side,
                  symbol: placeOrderMsg.symbol,
                  timeinforce: timeinforce
                };


                checkNumber(placeOrderMsg.price, "price");
                checkNumber(placeOrderMsg.quantity, "quantity");

                _context8.next = 22;
                return this._prepareTransaction(placeOrderMsg, signMsg, address, sequence, "");

              case 22:
                signedTx = _context8.sent;
                return _context8.abrupt("return", this._broadcastDelegate(signedTx));

              case 24:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function placeOrder() {
        return _ref8.apply(this, arguments);
      }

      return placeOrder;
    }()

    /**
     * Prepare a serialized raw transaction for sending to the blockchain.
     * @param {Object} msg the msg object
     * @param {Object} stdSignMsg the sign doc object used to generate a signature
     * @param {String} address
     * @param {Number} sequence optional sequence
     * @param {String} memo optional memo
     * @return {Transaction} signed transaction
     */

  }, {
    key: "_prepareTransaction",
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(msg, stdSignMsg, address) {
        var sequence = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var memo = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
        var data, options, tx;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!((!this.account_number || !sequence) && address)) {
                  _context9.next = 8;
                  break;
                }

                _context9.next = 3;
                return this._httpClient.request("get", api.getAccount + "/" + address);

              case 3:
                data = _context9.sent;

                sequence = data.result.sequence;
                this.account_number = data.result.account_number;
                // if user has not used `await` in its call to setPrivateKey (old API), we should wait for the promise here
                _context9.next = 11;
                break;

              case 8:
                if (!this._setPkPromise) {
                  _context9.next = 11;
                  break;
                }

                _context9.next = 11;
                return this._setPkPromise;

              case 11:
                options = {
                  account_number: parseInt(this.account_number),
                  chain_id: this.chainId,
                  memo: memo,
                  msg: msg,
                  sequence: parseInt(sequence),
                  type: msg.msgType
                };
                tx = new _tx2.default(options);
                return _context9.abrupt("return", this._signingDelegate.call(this, tx, stdSignMsg));

              case 14:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function _prepareTransaction(_x25, _x26, _x27) {
        return _ref9.apply(this, arguments);
      }

      return _prepareTransaction;
    }()

    /**
     * Broadcast a transaction to the blockchain.
     * @param {signedTx} tx signed Transaction object
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Object} response (success or fail)
     */

  }, {
    key: "sendTransaction",
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(signedTx, sync) {
        var signedBz;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                signedBz = signedTx.serialize();
                return _context10.abrupt("return", this.sendRawTransaction(signedBz, sync));

              case 2:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function sendTransaction(_x28, _x29) {
        return _ref10.apply(this, arguments);
      }

      return sendTransaction;
    }()

    /**
     * Broadcast a raw transaction to the blockchain.
     * @param {String} signedBz signed and serialized raw transaction
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Object} response (success or fail)
     */

  }, {
    key: "sendRawTransaction",
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(signedBz) {
        var sync = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : !this._useAsyncBroadcast;
        var opts;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                opts = {
                  data: signedBz,
                  headers: {
                    "content-type": "text/plain"
                  }
                };
                return _context11.abrupt("return", this._httpClient.request("post", api.broadcast + "?sync=" + sync, null, opts));

              case 2:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function sendRawTransaction(_x31) {
        return _ref11.apply(this, arguments);
      }

      return sendRawTransaction;
    }()

    /**
     * Broadcast a raw transaction to the blockchain.
     * @param {Object} msg the msg object
     * @param {Object} stdSignMsg the sign doc object used to generate a signature
     * @param {String} address
     * @param {Number} sequence optional sequence
     * @param {String} memo optional memo
     * @param {Boolean} sync use synchronous mode, optional
     * @return {Object} response (success or fail)
     */

  }, {
    key: "_sendTransaction",
    value: function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(msg, stdSignMsg, address) {
        var sequence = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var memo = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
        var sync = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : !this._useAsyncBroadcast;
        var signedTx;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this._prepareTransaction(msg, stdSignMsg, address, sequence, memo);

              case 2:
                signedTx = _context12.sent;
                return _context12.abrupt("return", this.sendTransaction(signedTx, sync));

              case 4:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function _sendTransaction(_x35, _x36, _x37) {
        return _ref12.apply(this, arguments);
      }

      return _sendTransaction;
    }()

    /**
     * get account
     * @param {String} address
     * @return {Object} http response
     */

  }, {
    key: "getAccount",
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
        var address = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.address;
        var data;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (address) {
                  _context13.next = 2;
                  break;
                }

                throw new Error("address should not be falsy");

              case 2:
                _context13.prev = 2;
                _context13.next = 5;
                return this._httpClient.request("get", api.getAccount + "/" + address);

              case 5:
                data = _context13.sent;
                return _context13.abrupt("return", data);

              case 9:
                _context13.prev = 9;
                _context13.t0 = _context13["catch"](2);
                return _context13.abrupt("return", null);

              case 12:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[2, 9]]);
      }));

      function getAccount() {
        return _ref13.apply(this, arguments);
      }

      return getAccount;
    }()

    /**
     * get balances
     * @param {String} address optional address
     * @return {Object} http response
     */

  }, {
    key: "getBalance",
    value: function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
        var address = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.address;
        var data;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;
                _context14.next = 3;
                return this.getAccount(address);

              case 3:
                data = _context14.sent;
                return _context14.abrupt("return", data.result.balances);

              case 7:
                _context14.prev = 7;
                _context14.t0 = _context14["catch"](0);
                return _context14.abrupt("return", []);

              case 10:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[0, 7]]);
      }));

      function getBalance() {
        return _ref14.apply(this, arguments);
      }

      return getBalance;
    }()

    /**
     * get markets
     * @param {Number} offset from beggining, default 0
     * @param {Number} limit, max 1000 is default
     * @return {Object} http response
     */

  }, {
    key: "getMarkets",
    value: function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
        var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var data;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.prev = 0;
                _context15.next = 3;
                return this._httpClient.request("get", api.getMarkets + "?limit=" + limit + "&offset=" + offset);

              case 3:
                data = _context15.sent;
                return _context15.abrupt("return", data);

              case 7:
                _context15.prev = 7;
                _context15.t0 = _context15["catch"](0);

                console.warn("getMarkets error", _context15.t0);
                return _context15.abrupt("return", []);

              case 11:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this, [[0, 7]]);
      }));

      function getMarkets() {
        return _ref15.apply(this, arguments);
      }

      return getMarkets;
    }()

    /**
     * Creates a private key.
     * @return {Object}
     * {
     *  address,
     *  privateKey
     * }
     */

  }, {
    key: "createAccount",
    value: function createAccount() {
      var privateKey = crypto.generatePrivateKey();
      return {
        privateKey: privateKey,
        address: crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix)
      };
    }

    /**
     *
     * @param {String} password
     *  {
     *  privateKey,
     *  address,
     *  keystore
     * }
     */

  }, {
    key: "createAccountWithKeystore",
    value: function createAccountWithKeystore(password) {
      if (!password) {
        throw new Error("password should not be falsy");
      }
      var privateKey = crypto.generatePrivateKey();
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      var keystore = crypto.generateKeyStore(privateKey, password);
      return {
        privateKey: privateKey,
        address: address,
        keystore: keystore
      };
    }

    /**
     * @return {Object}
     * {
     *  privateKey,
     *  address,
     *  mnemonic
     * }
     */

  }, {
    key: "createAccountWithMneomnic",
    value: function createAccountWithMneomnic() {
      var mnemonic = crypto.generateMnemonic();
      var privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic);
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      return {
        privateKey: privateKey,
        address: address,
        mnemonic: mnemonic
      };
    }

    /**
     * @param {String} keystore
     * @param {String} password
     * {
     * privateKey,
     * address
     * }
     */

  }, {
    key: "recoverAccountFromKeystore",
    value: function recoverAccountFromKeystore(keystore, password) {
      var privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      return {
        privateKey: privateKey,
        address: address
      };
    }

    /**
     * @param {String} mneomnic
     * {
     * privateKey,
     * address
     * }
     */

  }, {
    key: "recoverAccountFromMneomnic",
    value: function recoverAccountFromMneomnic(mneomnic) {
      var privateKey = crypto.getPrivateKeyFromMnemonic(mneomnic);
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      return {
        privateKey: privateKey,
        address: address
      };
    }

    /**
     * @param {String} privateKey
     * {
     * privateKey,
     * address
     * }
     */

  }, {
    key: "recoverAccountFromPrivateKey",
    value: function recoverAccountFromPrivateKey(privateKey) {
      var address = crypto.getAddressFromPrivateKey(privateKey, this.addressPrefix);
      return {
        privateKey: privateKey,
        address: address
      };
    }

    /**
     * @param {String} address
     * @return {Boolean}
     */

  }, {
    key: "checkAddress",
    value: function checkAddress(address) {
      return crypto.checkAddress(address);
    }

    /**
     * Returns the address for the current account if setPrivateKey has been called on this client.
     * @return {String}
     */

  }, {
    key: "getClientKeyAddress",
    value: function getClientKeyAddress() {
      if (!this.privateKey) throw new Error("no private key is set on this client");
      var address = crypto.getAddressFromPrivateKey(this.privateKey, this.addressPrefix);
      this.address = address;
      return address;
    }
  }]);

  return BncClient;
}();

exports.BncClient = BncClient;