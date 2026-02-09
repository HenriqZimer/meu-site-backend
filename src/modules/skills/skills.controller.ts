import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SkillsService } from './skills.service';
import { CreateSkillDto, UpdateSkillDto } from './dto/skill.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('skills')
@Controller('skills')
@UseGuards(RolesGuard)
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get('admin/all')
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all skills for admin (including inactive)' })
  @ApiResponse({ status: 200, description: 'Returns all skills' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - necessário role admin' })
  findAllForAdmin() {
    return this.skillsService.findAllForAdmin();
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all active skills' })
  @ApiResponse({ status: 200, description: 'Returns all active skills' })
  findAll(@Query('category') category?: string) {
    if (category) {
      return this.skillsService.findByCategory(category);
    }
    return this.skillsService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get skill by ID' })
  @ApiResponse({ status: 200, description: 'Returns the skill' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new skill (Admin only)' })
  @ApiResponse({ status: 201, description: 'Skill created successfully' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - necessário role admin' })
  create(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Put(':id')
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update a skill (Admin only)' })
  @ApiResponse({ status: 200, description: 'Skill updated successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - necessário role admin' })
  update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete a skill (Admin only)' })
  @ApiResponse({ status: 200, description: 'Skill deleted successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - necessário role admin' })
  remove(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
