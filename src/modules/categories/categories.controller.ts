import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Role, Roles } from '@/decorator/roles.decorator';
import { Public } from '@/decorator/customize';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.Admin)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  @Public()
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Public()
  @Get(':slug')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }
}
