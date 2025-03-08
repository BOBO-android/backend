import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const { name } = createCategoryDto;

    // Check if category already exists
    const existingCategory = await this.categoryModel.findOne({ name });
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }

    // Generate slug
    const slug = slugify(name, { lower: true, strict: true });

    // Save new category
    const newCategory = new this.categoryModel({ ...createCategoryDto, slug });
    return newCategory.save();
  }

  async getAllCategories() {
    return await this.categoryModel.find();
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryModel.findOne({ slug });
    if (!category) {
      throw new ConflictException('Category not found');
    }
    return category;
  }
}
