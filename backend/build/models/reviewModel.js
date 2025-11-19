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
exports.ReviewModel = exports.Review = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const defaultClasses_1 = require("@typegoose/typegoose/lib/defaultClasses");
const typegoose_2 = require("@typegoose/typegoose");
let Review = (() => {
    let _classDecorators = [(0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = defaultClasses_1.TimeStamps;
    let _productId_decorators;
    let _productId_initializers = [];
    let _productId_extraInitializers = [];
    let _userId_decorators;
    let _userId_initializers = [];
    let _userId_extraInitializers = [];
    let _userName_decorators;
    let _userName_initializers = [];
    let _userName_extraInitializers = [];
    let _userEmail_decorators;
    let _userEmail_initializers = [];
    let _userEmail_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _title_decorators;
    let _title_initializers = [];
    let _title_extraInitializers = [];
    let _comment_decorators;
    let _comment_initializers = [];
    let _comment_extraInitializers = [];
    let _isVerifiedPurchase_decorators;
    let _isVerifiedPurchase_initializers = [];
    let _isVerifiedPurchase_extraInitializers = [];
    let _helpful_decorators;
    let _helpful_initializers = [];
    let _helpful_extraInitializers = [];
    var Review = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.productId = __runInitializers(this, _productId_initializers, void 0);
            this.userId = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
            this.userName = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _userName_initializers, void 0));
            this.userEmail = (__runInitializers(this, _userName_extraInitializers), __runInitializers(this, _userEmail_initializers, void 0));
            this.rating = (__runInitializers(this, _userEmail_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.title = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _title_initializers, void 0));
            this.comment = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _comment_initializers, void 0));
            this.isVerifiedPurchase = (__runInitializers(this, _comment_extraInitializers), __runInitializers(this, _isVerifiedPurchase_initializers, void 0));
            this.helpful = (__runInitializers(this, _isVerifiedPurchase_extraInitializers), __runInitializers(this, _helpful_initializers, void 0));
            __runInitializers(this, _helpful_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Review");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
        _productId_decorators = [(0, typegoose_1.prop)({ required: true, index: true })];
        _userId_decorators = [(0, typegoose_1.prop)({ required: true })];
        _userName_decorators = [(0, typegoose_1.prop)({ required: true })];
        _userEmail_decorators = [(0, typegoose_1.prop)({ required: true })];
        _rating_decorators = [(0, typegoose_1.prop)({ required: true, min: 1, max: 5 })];
        _title_decorators = [(0, typegoose_1.prop)({ required: true })];
        _comment_decorators = [(0, typegoose_1.prop)({ required: true })];
        _isVerifiedPurchase_decorators = [(0, typegoose_1.prop)({ default: false })];
        _helpful_decorators = [(0, typegoose_1.prop)({ default: 0 })];
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: obj => "productId" in obj, get: obj => obj.productId, set: (obj, value) => { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: obj => "userId" in obj, get: obj => obj.userId, set: (obj, value) => { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
        __esDecorate(null, null, _userName_decorators, { kind: "field", name: "userName", static: false, private: false, access: { has: obj => "userName" in obj, get: obj => obj.userName, set: (obj, value) => { obj.userName = value; } }, metadata: _metadata }, _userName_initializers, _userName_extraInitializers);
        __esDecorate(null, null, _userEmail_decorators, { kind: "field", name: "userEmail", static: false, private: false, access: { has: obj => "userEmail" in obj, get: obj => obj.userEmail, set: (obj, value) => { obj.userEmail = value; } }, metadata: _metadata }, _userEmail_initializers, _userEmail_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: obj => "title" in obj, get: obj => obj.title, set: (obj, value) => { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
        __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: obj => "comment" in obj, get: obj => obj.comment, set: (obj, value) => { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _comment_extraInitializers);
        __esDecorate(null, null, _isVerifiedPurchase_decorators, { kind: "field", name: "isVerifiedPurchase", static: false, private: false, access: { has: obj => "isVerifiedPurchase" in obj, get: obj => obj.isVerifiedPurchase, set: (obj, value) => { obj.isVerifiedPurchase = value; } }, metadata: _metadata }, _isVerifiedPurchase_initializers, _isVerifiedPurchase_extraInitializers);
        __esDecorate(null, null, _helpful_decorators, { kind: "field", name: "helpful", static: false, private: false, access: { has: obj => "helpful" in obj, get: obj => obj.helpful, set: (obj, value) => { obj.helpful = value; } }, metadata: _metadata }, _helpful_initializers, _helpful_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Review = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Review = _classThis;
})();
exports.Review = Review;
exports.ReviewModel = (0, typegoose_2.getModelForClass)(Review);
//# sourceMappingURL=reviewModel.js.map