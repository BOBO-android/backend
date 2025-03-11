import { Controller, Post, Body, Get, Param, HttpCode } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Role, Roles } from '@/decorator/roles.decorator';
import { Public, ResponseMessage } from '@/decorator/customize';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.Admin)
  @ResponseMessage('Create new category successfully')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  @Public()
  @HttpCode(200)
  @ResponseMessage('Get all categories successfully')
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Public()
  @HttpCode(200)
  @Get(':slug')
  @ResponseMessage('Get category sucessfully')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }
}
