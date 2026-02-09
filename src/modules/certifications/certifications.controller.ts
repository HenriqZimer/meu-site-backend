import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CertificationsService } from './certifications.service';
import { CreateCertificationDto, UpdateCertificationDto } from './dto/certification.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('certifications')
@Controller('certifications')
@UseGuards(RolesGuard)
export class CertificationsController {
  constructor(private readonly certificationsService: CertificationsService) {}

  @Get('stats')
  @Public()
  @ApiOperation({ summary: 'Get certifications statistics' })
  @ApiResponse({ status: 200, description: 'Returns certifications statistics' })
  getStats() {
    return this.certificationsService.getStats();
  }

  @Get('admin/all')
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all certifications for admin (including inactive)' })
  @ApiResponse({ status: 200, description: 'Returns all certifications' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - necessário role admin' })
  findAllForAdmin() {
    return this.certificationsService.findAllForAdmin();
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all active certifications' })
  @ApiQuery({ name: 'issuer', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Returns all active certifications' })
  findAll(@Query('issuer') issuer?: string) {
    if (issuer) {
      return this.certificationsService.findByIssuer(issuer);
    }
    return this.certificationsService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get certification by ID' })
  @ApiResponse({ status: 200, description: 'Returns the certification' })
  @ApiResponse({ status: 404, description: 'Certification not found' })
  findOne(@Param('id') id: string) {
    return this.certificationsService.findOne(id);
  }

  @Post()
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new certification (Admin only)' })
  @ApiResponse({ status: 201, description: 'Certification created successfully' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - necessário role admin' })
  create(@Body() createCertificationDto: CreateCertificationDto) {
    return this.certificationsService.create(createCertificationDto);
  }

  @Put(':id')
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update a certification (Admin only)' })
  @ApiResponse({ status: 200, description: 'Certification updated successfully' })
  @ApiResponse({ status: 404, description: 'Certification not found' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - necessário role admin' })
  update(@Param('id') id: string, @Body() updateCertificationDto: UpdateCertificationDto) {
    return this.certificationsService.update(id, updateCertificationDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete a certification (Admin only)' })
  @ApiResponse({ status: 200, description: 'Certification deleted successfully' })
  @ApiResponse({ status: 404, description: 'Certification not found' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - necessário role admin' })
  remove(@Param('id') id: string) {
    return this.certificationsService.remove(id);
  }
}
