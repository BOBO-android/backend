import { Controller, Post, Body, Get, Param, HttpCode } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Role, Roles } from '@/decorator/roles.decorator';
import { Public, ResponseMessage } from '@/decorator/customize';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiBody({ type: CreateCategoryDto })
  @ResponseMessage('Create new category successfully')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  @Public()
  @HttpCode(200)
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved categories',
  })
  @ResponseMessage('Get all categories successfully')
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Public()
  @HttpCode(200)
  @Get(':slug')
  @ApiOperation({ summary: 'Get category by slug' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiParam({ name: 'slug', type: 'string', description: 'Category slug' })
  @ResponseMessage('Get category successfully')
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findBySlug(slug);
  }
}
