"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareModel = exports.Compare = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const defaultClasses_1 = require("@typegoose/typegoose/lib/defaultClasses");
const typegoose_2 = require("@typegoose/typegoose");
class ProductVariant {
}
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], ProductVariant.prototype, "color", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], ProductVariant.prototype, "storage", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], ProductVariant.prototype, "ram", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], ProductVariant.prototype, "price", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", Number)
], ProductVariant.prototype, "countInStock", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], ProductVariant.prototype, "image", void 0);
let Compare = class Compare extends defaultClasses_1.TimeStamps {
};
exports.Compare = Compare;
__decorate([
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Compare.prototype, "userId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, index: true }),
    __metadata("design:type", String)
], Compare.prototype, "productId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Compare.prototype, "productName", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Compare.prototype, "productImage", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Compare.prototype, "productPrice", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Compare.prototype, "productSlug", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Compare.prototype, "productBrand", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Compare.prototype, "productCategory", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Compare.prototype, "productRating", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Compare.prototype, "productNumReviews", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => ProductVariant }),
    __metadata("design:type", ProductVariant)
], Compare.prototype, "selectedVariant", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [ProductVariant] }),
    __metadata("design:type", Array)
], Compare.prototype, "allVariants", void 0);
exports.Compare = Compare = __decorate([
    (0, typegoose_1.modelOptions)({ schemaOptions: { timestamps: true } })
], Compare);
exports.CompareModel = (0, typegoose_2.getModelForClass)(Compare);
//# sourceMappingURL=compareModel.js.map