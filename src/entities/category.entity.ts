import BaseEntity from "./base.entity";
import { Category } from '../database/models/category.model'
import Boom from "boom";

class CategoryEntity extends BaseEntity {
    constructor() {
        super(Category);
    }

    async addNewCategory(categoryName, categoryRate) {
        let payload = { categoryName: categoryName, categoryRate: categoryRate }
        return await this.create(payload)
    }

    async ifCategoryExists(categoryName) {
        let condition = { categoryName: categoryName }
        let data = await this.findOne(condition)
        return data;
    }

    async updateCategoryRate(categoryName, categoryRate) {
        let condition = { categoryName: categoryName }
        let payload = { categoryRate: categoryRate }
        let data = await this.update(payload, condition)
        return data;
    }

    async removeCategory(categoryName) {
        let condition = { categoryName: categoryName }
        let category = await this.findOne(condition);
        if (!category)
            throw Boom.notFound(`Category ${categoryName} not found`);
        await this.destroy(category);
        return category;
    }

    async getCategoryRate(categoryName) {
        let condition = { categoryName: categoryName }
        let data = await this.findOne(condition)
        return data;
    }

    async getAllCategory() {
        let data = await this.findAll()
        return data;
    }

}

export const CategoryE = new CategoryEntity();


