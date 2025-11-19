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
exports.ProductModel = exports.Product = void 0;
const typegoose_1 = require("@typegoose/typegoose");
let Variant = (() => {
    var _a;
    let _color_decorators;
    let _color_initializers = [];
    let _color_extraInitializers = [];
    let _storage_decorators;
    let _storage_initializers = [];
    let _storage_extraInitializers = [];
    let _ram_decorators;
    let _ram_initializers = [];
    let _ram_extraInitializers = [];
    let _price_decorators;
    let _price_initializers = [];
    let _price_extraInitializers = [];
    let _countInStock_decorators;
    let _countInStock_initializers = [];
    let _countInStock_extraInitializers = [];
    let _image_decorators;
    let _image_initializers = [];
    let _image_extraInitializers = [];
    return _a = class Variant {
            constructor() {
                this.color = __runInitializers(this, _color_initializers, void 0);
                this.storage = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _storage_initializers, void 0));
                this.ram = (__runInitializers(this, _storage_extraInitializers), __runInitializers(this, _ram_initializers, void 0));
                this.price = (__runInitializers(this, _ram_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.countInStock = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _countInStock_initializers, void 0));
                this.image = (__runInitializers(this, _countInStock_extraInitializers), __runInitializers(this, _image_initializers, void 0));
                __runInitializers(this, _image_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _color_decorators = [(0, typegoose_1.prop)({ required: true })];
            _storage_decorators = [(0, typegoose_1.prop)({ required: true })];
            _ram_decorators = [(0, typegoose_1.prop)({ required: true })];
            _price_decorators = [(0, typegoose_1.prop)({ required: true })];
            _countInStock_decorators = [(0, typegoose_1.prop)({ required: true })];
            _image_decorators = [(0, typegoose_1.prop)()];
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: obj => "color" in obj, get: obj => obj.color, set: (obj, value) => { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _storage_decorators, { kind: "field", name: "storage", static: false, private: false, access: { has: obj => "storage" in obj, get: obj => obj.storage, set: (obj, value) => { obj.storage = value; } }, metadata: _metadata }, _storage_initializers, _storage_extraInitializers);
            __esDecorate(null, null, _ram_decorators, { kind: "field", name: "ram", static: false, private: false, access: { has: obj => "ram" in obj, get: obj => obj.ram, set: (obj, value) => { obj.ram = value; } }, metadata: _metadata }, _ram_initializers, _ram_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: obj => "price" in obj, get: obj => obj.price, set: (obj, value) => { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _countInStock_decorators, { kind: "field", name: "countInStock", static: false, private: false, access: { has: obj => "countInStock" in obj, get: obj => obj.countInStock, set: (obj, value) => { obj.countInStock = value; } }, metadata: _metadata }, _countInStock_initializers, _countInStock_extraInitializers);
            __esDecorate(null, null, _image_decorators, { kind: "field", name: "image", static: false, private: false, access: { has: obj => "image" in obj, get: obj => obj.image, set: (obj, value) => { obj.image = value; } }, metadata: _metadata }, _image_initializers, _image_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
let Product = (() => {
    let _classDecorators = [(0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _slug_decorators;
    let _slug_initializers = [];
    let _slug_extraInitializers = [];
    let _brand_decorators;
    let _brand_initializers = [];
    let _brand_extraInitializers = [];
    let _category_decorators;
    let _category_initializers = [];
    let _category_extraInitializers = [];
    let _description_decorators;
    let _description_initializers = [];
    let _description_extraInitializers = [];
    let _rating_decorators;
    let _rating_initializers = [];
    let _rating_extraInitializers = [];
    let _numReviews_decorators;
    let _numReviews_initializers = [];
    let _numReviews_extraInitializers = [];
    let _image_decorators;
    let _image_initializers = [];
    let _image_extraInitializers = [];
    let _price_decorators;
    let _price_initializers = [];
    let _price_extraInitializers = [];
    let _countInStock_decorators;
    let _countInStock_initializers = [];
    let _countInStock_extraInitializers = [];
    let _variants_decorators;
    let _variants_initializers = [];
    let _variants_extraInitializers = [];
    var Product = _classThis = class {
        constructor() {
            this.name = __runInitializers(this, _name_initializers, void 0);
            this.slug = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _slug_initializers, void 0));
            this.brand = (__runInitializers(this, _slug_extraInitializers), __runInitializers(this, _brand_initializers, void 0));
            this.category = (__runInitializers(this, _brand_extraInitializers), __runInitializers(this, _category_initializers, void 0));
            this.description = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.rating = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
            this.numReviews = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _numReviews_initializers, void 0));
            this.image = (__runInitializers(this, _numReviews_extraInitializers), __runInitializers(this, _image_initializers, void 0));
            this.price = (__runInitializers(this, _image_extraInitializers), __runInitializers(this, _price_initializers, void 0));
            this.countInStock = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _countInStock_initializers, void 0));
            // 🆕 Mảng biến thể
            this.variants = (__runInitializers(this, _countInStock_extraInitializers), __runInitializers(this, _variants_initializers, void 0));
            __runInitializers(this, _variants_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Product");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _name_decorators = [(0, typegoose_1.prop)({ required: true })];
        _slug_decorators = [(0, typegoose_1.prop)({ required: true, unique: true })];
        _brand_decorators = [(0, typegoose_1.prop)({ required: true })];
        _category_decorators = [(0, typegoose_1.prop)({ required: true })];
        _description_decorators = [(0, typegoose_1.prop)({ required: true })];
        _rating_decorators = [(0, typegoose_1.prop)({ required: true, default: 0 })];
        _numReviews_decorators = [(0, typegoose_1.prop)({ required: true, default: 0 })];
        _image_decorators = [(0, typegoose_1.prop)()];
        _price_decorators = [(0, typegoose_1.prop)({ default: 0 })];
        _countInStock_decorators = [(0, typegoose_1.prop)({ default: 0 })];
        _variants_decorators = [(0, typegoose_1.prop)({ type: () => [Variant], required: true })];
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _slug_decorators, { kind: "field", name: "slug", static: false, private: false, access: { has: obj => "slug" in obj, get: obj => obj.slug, set: (obj, value) => { obj.slug = value; } }, metadata: _metadata }, _slug_initializers, _slug_extraInitializers);
        __esDecorate(null, null, _brand_decorators, { kind: "field", name: "brand", static: false, private: false, access: { has: obj => "brand" in obj, get: obj => obj.brand, set: (obj, value) => { obj.brand = value; } }, metadata: _metadata }, _brand_initializers, _brand_extraInitializers);
        __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: obj => "category" in obj, get: obj => obj.category, set: (obj, value) => { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: obj => "description" in obj, get: obj => obj.description, set: (obj, value) => { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: obj => "rating" in obj, get: obj => obj.rating, set: (obj, value) => { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
        __esDecorate(null, null, _numReviews_decorators, { kind: "field", name: "numReviews", static: false, private: false, access: { has: obj => "numReviews" in obj, get: obj => obj.numReviews, set: (obj, value) => { obj.numReviews = value; } }, metadata: _metadata }, _numReviews_initializers, _numReviews_extraInitializers);
        __esDecorate(null, null, _image_decorators, { kind: "field", name: "image", static: false, private: false, access: { has: obj => "image" in obj, get: obj => obj.image, set: (obj, value) => { obj.image = value; } }, metadata: _metadata }, _image_initializers, _image_extraInitializers);
        __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: obj => "price" in obj, get: obj => obj.price, set: (obj, value) => { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
        __esDecorate(null, null, _countInStock_decorators, { kind: "field", name: "countInStock", static: false, private: false, access: { has: obj => "countInStock" in obj, get: obj => obj.countInStock, set: (obj, value) => { obj.countInStock = value; } }, metadata: _metadata }, _countInStock_initializers, _countInStock_extraInitializers);
        __esDecorate(null, null, _variants_decorators, { kind: "field", name: "variants", static: false, private: false, access: { has: obj => "variants" in obj, get: obj => obj.variants, set: (obj, value) => { obj.variants = value; } }, metadata: _metadata }, _variants_initializers, _variants_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Product = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Product = _classThis;
})();
exports.Product = Product;
exports.ProductModel = (0, typegoose_1.getModelForClass)(Product);
//# sourceMappingURL=productModel.js.map