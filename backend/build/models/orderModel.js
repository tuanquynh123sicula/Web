"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = exports.Order = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const productModel_1 = require("./productModel");
const userModel_1 = require("./userModel");
let ShippingAddress = (() => {
    var _a;
    let _fullName_decorators;
    let _fullName_initializers = [];
    let _fullName_extraInitializers = [];
    let _address_decorators;
    let _address_initializers = [];
    let _address_extraInitializers = [];
    let _city_decorators;
    let _city_initializers = [];
    let _city_extraInitializers = [];
    let _country_decorators;
    let _country_initializers = [];
    let _country_extraInitializers = [];
    let _lat_decorators;
    let _lat_initializers = [];
    let _lat_extraInitializers = [];
    let _lng_decorators;
    let _lng_initializers = [];
    let _lng_extraInitializers = [];
    let _postalCode_decorators;
    let _postalCode_initializers = [];
    let _postalCode_extraInitializers = [];
    return _a = class ShippingAddress {
            constructor() {
                this.fullName = __runInitializers(this, _fullName_initializers, void 0);
                this.address = (__runInitializers(this, _fullName_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.city = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.country = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _country_initializers, void 0));
                this.lat = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _lat_initializers, void 0));
                this.lng = (__runInitializers(this, _lat_extraInitializers), __runInitializers(this, _lng_initializers, void 0));
                this.postalCode = (__runInitializers(this, _lng_extraInitializers), __runInitializers(this, _postalCode_initializers, void 0));
                __runInitializers(this, _postalCode_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fullName_decorators = [(0, typegoose_1.prop)()];
            _address_decorators = [(0, typegoose_1.prop)()];
            _city_decorators = [(0, typegoose_1.prop)()];
            _country_decorators = [(0, typegoose_1.prop)()];
            _lat_decorators = [(0, typegoose_1.prop)()];
            _lng_decorators = [(0, typegoose_1.prop)()];
            _postalCode_decorators = [(0, typegoose_1.prop)()];
            __esDecorate(null, null, _fullName_decorators, { kind: "field", name: "fullName", static: false, private: false, access: { has: obj => "fullName" in obj, get: obj => obj.fullName, set: (obj, value) => { obj.fullName = value; } }, metadata: _metadata }, _fullName_initializers, _fullName_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: obj => "address" in obj, get: obj => obj.address, set: (obj, value) => { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: obj => "city" in obj, get: obj => obj.city, set: (obj, value) => { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: obj => "country" in obj, get: obj => obj.country, set: (obj, value) => { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
            __esDecorate(null, null, _lat_decorators, { kind: "field", name: "lat", static: false, private: false, access: { has: obj => "lat" in obj, get: obj => obj.lat, set: (obj, value) => { obj.lat = value; } }, metadata: _metadata }, _lat_initializers, _lat_extraInitializers);
            __esDecorate(null, null, _lng_decorators, { kind: "field", name: "lng", static: false, private: false, access: { has: obj => "lng" in obj, get: obj => obj.lng, set: (obj, value) => { obj.lng = value; } }, metadata: _metadata }, _lng_initializers, _lng_extraInitializers);
            __esDecorate(null, null, _postalCode_decorators, { kind: "field", name: "postalCode", static: false, private: false, access: { has: obj => "postalCode" in obj, get: obj => obj.postalCode, set: (obj, value) => { obj.postalCode = value; } }, metadata: _metadata }, _postalCode_initializers, _postalCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
let Item = (() => {
    var _a;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _quantity_decorators;
    let _quantity_initializers = [];
    let _quantity_extraInitializers = [];
    let _image_decorators;
    let _image_initializers = [];
    let _image_extraInitializers = [];
    let _price_decorators;
    let _price_initializers = [];
    let _price_extraInitializers = [];
    let _product_decorators;
    let _product_initializers = [];
    let _product_extraInitializers = [];
    return _a = class Item {
            constructor() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.quantity = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _quantity_initializers, void 0));
                this.image = (__runInitializers(this, _quantity_extraInitializers), __runInitializers(this, _image_initializers, void 0));
                this.price = (__runInitializers(this, _image_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.product = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _product_initializers, void 0));
                __runInitializers(this, _product_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, typegoose_1.prop)({ required: true })];
            _quantity_decorators = [(0, typegoose_1.prop)({ required: true })];
            _image_decorators = [(0, typegoose_1.prop)({ required: true })];
            _price_decorators = [(0, typegoose_1.prop)({ required: true })];
            _product_decorators = [(0, typegoose_1.prop)({ ref: productModel_1.Product })];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _quantity_decorators, { kind: "field", name: "quantity", static: false, private: false, access: { has: obj => "quantity" in obj, get: obj => obj.quantity, set: (obj, value) => { obj.quantity = value; } }, metadata: _metadata }, _quantity_initializers, _quantity_extraInitializers);
            __esDecorate(null, null, _image_decorators, { kind: "field", name: "image", static: false, private: false, access: { has: obj => "image" in obj, get: obj => obj.image, set: (obj, value) => { obj.image = value; } }, metadata: _metadata }, _image_initializers, _image_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: obj => "price" in obj, get: obj => obj.price, set: (obj, value) => { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _product_decorators, { kind: "field", name: "product", static: false, private: false, access: { has: obj => "product" in obj, get: obj => obj.product, set: (obj, value) => { obj.product = value; } }, metadata: _metadata }, _product_initializers, _product_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
let PaymentResult = (() => {
    var _a;
    let _paymentId_decorators;
    let _paymentId_initializers = [];
    let _paymentId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _update_time_decorators;
    let _update_time_initializers = [];
    let _update_time_extraInitializers = [];
    let _email_address_decorators;
    let _email_address_initializers = [];
    let _email_address_extraInitializers = [];
    return _a = class PaymentResult {
            constructor() {
                this.paymentId = __runInitializers(this, _paymentId_initializers, void 0);
                this.status = (__runInitializers(this, _paymentId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.update_time = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _update_time_initializers, void 0));
                this.email_address = (__runInitializers(this, _update_time_extraInitializers), __runInitializers(this, _email_address_initializers, void 0));
                __runInitializers(this, _email_address_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _paymentId_decorators = [(0, typegoose_1.prop)()];
            _status_decorators = [(0, typegoose_1.prop)()];
            _update_time_decorators = [(0, typegoose_1.prop)()];
            _email_address_decorators = [(0, typegoose_1.prop)()];
            __esDecorate(null, null, _paymentId_decorators, { kind: "field", name: "paymentId", static: false, private: false, access: { has: obj => "paymentId" in obj, get: obj => obj.paymentId, set: (obj, value) => { obj.paymentId = value; } }, metadata: _metadata }, _paymentId_initializers, _paymentId_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _update_time_decorators, { kind: "field", name: "update_time", static: false, private: false, access: { has: obj => "update_time" in obj, get: obj => obj.update_time, set: (obj, value) => { obj.update_time = value; } }, metadata: _metadata }, _update_time_initializers, _update_time_extraInitializers);
            __esDecorate(null, null, _email_address_decorators, { kind: "field", name: "email_address", static: false, private: false, access: { has: obj => "email_address" in obj, get: obj => obj.email_address, set: (obj, value) => { obj.email_address = value; } }, metadata: _metadata }, _email_address_initializers, _email_address_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
let Order = (() => {
    let _classDecorators = [(0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _orderItems_decorators;
    let _orderItems_initializers = [];
    let _orderItems_extraInitializers = [];
    let _shippingAddress_decorators;
    let _shippingAddress_initializers = [];
    let _shippingAddress_extraInitializers = [];
    let _user_decorators;
    let _user_initializers = [];
    let _user_extraInitializers = [];
    let _paymentMethod_decorators;
    let _paymentMethod_initializers = [];
    let _paymentMethod_extraInitializers = [];
    let _paymentResult_decorators;
    let _paymentResult_initializers = [];
    let _paymentResult_extraInitializers = [];
    let _itemsPrice_decorators;
    let _itemsPrice_initializers = [];
    let _itemsPrice_extraInitializers = [];
    let _shippingPrice_decorators;
    let _shippingPrice_initializers = [];
    let _shippingPrice_extraInitializers = [];
    let _taxPrice_decorators;
    let _taxPrice_initializers = [];
    let _taxPrice_extraInitializers = [];
    let _discount_decorators;
    let _discount_initializers = [];
    let _discount_extraInitializers = [];
    let _totalPrice_decorators;
    let _totalPrice_initializers = [];
    let _totalPrice_extraInitializers = [];
    let _isPaid_decorators;
    let _isPaid_initializers = [];
    let _isPaid_extraInitializers = [];
    let _paidAt_decorators;
    let _paidAt_initializers = [];
    let _paidAt_extraInitializers = [];
    let _isDelivered_decorators;
    let _isDelivered_initializers = [];
    let _isDelivered_extraInitializers = [];
    let _deliveredAt_decorators;
    let _deliveredAt_initializers = [];
    let _deliveredAt_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _tierSnapshot_decorators;
    let _tierSnapshot_initializers = [];
    let _tierSnapshot_extraInitializers = [];
    var Order = _classThis = class {
        constructor() {
            this.orderItems = __runInitializers(this, _orderItems_initializers, void 0);
            this.shippingAddress = (__runInitializers(this, _orderItems_extraInitializers), __runInitializers(this, _shippingAddress_initializers, void 0));
            this.user = (__runInitializers(this, _shippingAddress_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.paymentMethod = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
            this.paymentResult = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _paymentResult_initializers, void 0));
            this.itemsPrice = (__runInitializers(this, _paymentResult_extraInitializers), __runInitializers(this, _itemsPrice_initializers, void 0));
            this.shippingPrice = (__runInitializers(this, _itemsPrice_extraInitializers), __runInitializers(this, _shippingPrice_initializers, void 0));
            this.taxPrice = (__runInitializers(this, _shippingPrice_extraInitializers), __runInitializers(this, _taxPrice_initializers, void 0));
            this.discount = (__runInitializers(this, _taxPrice_extraInitializers), __runInitializers(this, _discount_initializers, void 0));
            this.totalPrice = (__runInitializers(this, _discount_extraInitializers), __runInitializers(this, _totalPrice_initializers, void 0));
            this.isPaid = (__runInitializers(this, _totalPrice_extraInitializers), __runInitializers(this, _isPaid_initializers, void 0));
            this.paidAt = (__runInitializers(this, _isPaid_extraInitializers), __runInitializers(this, _paidAt_initializers, void 0));
            this.isDelivered = (__runInitializers(this, _paidAt_extraInitializers), __runInitializers(this, _isDelivered_initializers, void 0));
            this.deliveredAt = (__runInitializers(this, _isDelivered_extraInitializers), __runInitializers(this, _deliveredAt_initializers, void 0));
            this.status = (__runInitializers(this, _deliveredAt_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.tierSnapshot = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _tierSnapshot_initializers, void 0));
            __runInitializers(this, _tierSnapshot_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Order");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _orderItems_decorators = [(0, typegoose_1.prop)()];
        _shippingAddress_decorators = [(0, typegoose_1.prop)()];
        _user_decorators = [(0, typegoose_1.prop)({ ref: userModel_1.User })];
        _paymentMethod_decorators = [(0, typegoose_1.prop)({ required: true })];
        _paymentResult_decorators = [(0, typegoose_1.prop)()];
        _itemsPrice_decorators = [(0, typegoose_1.prop)({ required: true, default: 0 })];
        _shippingPrice_decorators = [(0, typegoose_1.prop)({ required: true, default: 0 })];
        _taxPrice_decorators = [(0, typegoose_1.prop)({ required: true, default: 0 })];
        _discount_decorators = [(0, typegoose_1.prop)({ required: true, default: 0 })];
        _totalPrice_decorators = [(0, typegoose_1.prop)({ required: true, default: 0 })];
        _isPaid_decorators = [(0, typegoose_1.prop)({ required: true, default: false })];
        _paidAt_decorators = [(0, typegoose_1.prop)()];
        _isDelivered_decorators = [(0, typegoose_1.prop)({ required: true, default: false })];
        _deliveredAt_decorators = [(0, typegoose_1.prop)()];
        _status_decorators = [(0, typegoose_1.prop)({
                enum: ['pending', 'packing', 'shipping', 'delivered', 'canceled'],
                default: 'pending',
            })];
        _tierSnapshot_decorators = [(0, typegoose_1.prop)({ enum: ['regular', 'vip', 'new'], default: 'regular' })];
        __esDecorate(null, null, _orderItems_decorators, { kind: "field", name: "orderItems", static: false, private: false, access: { has: obj => "orderItems" in obj, get: obj => obj.orderItems, set: (obj, value) => { obj.orderItems = value; } }, metadata: _metadata }, _orderItems_initializers, _orderItems_extraInitializers);
        __esDecorate(null, null, _shippingAddress_decorators, { kind: "field", name: "shippingAddress", static: false, private: false, access: { has: obj => "shippingAddress" in obj, get: obj => obj.shippingAddress, set: (obj, value) => { obj.shippingAddress = value; } }, metadata: _metadata }, _shippingAddress_initializers, _shippingAddress_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: obj => "user" in obj, get: obj => obj.user, set: (obj, value) => { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: obj => "paymentMethod" in obj, get: obj => obj.paymentMethod, set: (obj, value) => { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
        __esDecorate(null, null, _paymentResult_decorators, { kind: "field", name: "paymentResult", static: false, private: false, access: { has: obj => "paymentResult" in obj, get: obj => obj.paymentResult, set: (obj, value) => { obj.paymentResult = value; } }, metadata: _metadata }, _paymentResult_initializers, _paymentResult_extraInitializers);
        __esDecorate(null, null, _itemsPrice_decorators, { kind: "field", name: "itemsPrice", static: false, private: false, access: { has: obj => "itemsPrice" in obj, get: obj => obj.itemsPrice, set: (obj, value) => { obj.itemsPrice = value; } }, metadata: _metadata }, _itemsPrice_initializers, _itemsPrice_extraInitializers);
        __esDecorate(null, null, _shippingPrice_decorators, { kind: "field", name: "shippingPrice", static: false, private: false, access: { has: obj => "shippingPrice" in obj, get: obj => obj.shippingPrice, set: (obj, value) => { obj.shippingPrice = value; } }, metadata: _metadata }, _shippingPrice_initializers, _shippingPrice_extraInitializers);
        __esDecorate(null, null, _taxPrice_decorators, { kind: "field", name: "taxPrice", static: false, private: false, access: { has: obj => "taxPrice" in obj, get: obj => obj.taxPrice, set: (obj, value) => { obj.taxPrice = value; } }, metadata: _metadata }, _taxPrice_initializers, _taxPrice_extraInitializers);
        __esDecorate(null, null, _discount_decorators, { kind: "field", name: "discount", static: false, private: false, access: { has: obj => "discount" in obj, get: obj => obj.discount, set: (obj, value) => { obj.discount = value; } }, metadata: _metadata }, _discount_initializers, _discount_extraInitializers);
        __esDecorate(null, null, _totalPrice_decorators, { kind: "field", name: "totalPrice", static: false, private: false, access: { has: obj => "totalPrice" in obj, get: obj => obj.totalPrice, set: (obj, value) => { obj.totalPrice = value; } }, metadata: _metadata }, _totalPrice_initializers, _totalPrice_extraInitializers);
        __esDecorate(null, null, _isPaid_decorators, { kind: "field", name: "isPaid", static: false, private: false, access: { has: obj => "isPaid" in obj, get: obj => obj.isPaid, set: (obj, value) => { obj.isPaid = value; } }, metadata: _metadata }, _isPaid_initializers, _isPaid_extraInitializers);
        __esDecorate(null, null, _paidAt_decorators, { kind: "field", name: "paidAt", static: false, private: false, access: { has: obj => "paidAt" in obj, get: obj => obj.paidAt, set: (obj, value) => { obj.paidAt = value; } }, metadata: _metadata }, _paidAt_initializers, _paidAt_extraInitializers);
        __esDecorate(null, null, _isDelivered_decorators, { kind: "field", name: "isDelivered", static: false, private: false, access: { has: obj => "isDelivered" in obj, get: obj => obj.isDelivered, set: (obj, value) => { obj.isDelivered = value; } }, metadata: _metadata }, _isDelivered_initializers, _isDelivered_extraInitializers);
        __esDecorate(null, null, _deliveredAt_decorators, { kind: "field", name: "deliveredAt", static: false, private: false, access: { has: obj => "deliveredAt" in obj, get: obj => obj.deliveredAt, set: (obj, value) => { obj.deliveredAt = value; } }, metadata: _metadata }, _deliveredAt_initializers, _deliveredAt_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _tierSnapshot_decorators, { kind: "field", name: "tierSnapshot", static: false, private: false, access: { has: obj => "tierSnapshot" in obj, get: obj => obj.tierSnapshot, set: (obj, value) => { obj.tierSnapshot = value; } }, metadata: _metadata }, _tierSnapshot_initializers, _tierSnapshot_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Order = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Order = _classThis;
})();
exports.Order = Order;
exports.OrderModel = (0, typegoose_1.getModelForClass)(Order);
//# sourceMappingURL=orderModel.js.map