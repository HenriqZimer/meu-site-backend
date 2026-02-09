import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/contact.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('contacts')
@Controller('contacts')
@UseGuards(RolesGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new contact message (Public)' })
  @ApiResponse({ status: 201, description: 'Contact message sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async create(@Body() createContactDto: CreateContactDto) {
    const contact = await this.contactsService.create(createContactDto);
    return {
      message: 'Mensagem enviada com sucesso!',
      data: contact,
    };
  }

  @Get()
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get all contact messages (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns all contact messages' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - necessário role admin' })
  async findAll() {
    const contacts = await this.contactsService.findAll();
    return {
      data: contacts,
      count: contacts.length,
    };
  }

  @Get(':id')
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get contact message by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Returns the contact message' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - necessário role admin' })
  async findOne(@Param('id') id: string) {
    const contact = await this.contactsService.findById(id);
    return {
      data: contact,
    };
  }

  @Patch(':id/read')
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Mark contact message as read (Admin only)' })
  @ApiResponse({ status: 200, description: 'Contact message marked as read' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - necessário role admin' })
  async markAsRead(@Param('id') id: string) {
    const contact = await this.contactsService.markAsRead(id);
    return {
      message: 'Mensagem marcada como lida',
      data: contact,
    };
  }

  @Patch(':id/toggle-read')
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Toggle contact message read status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Contact message read status toggled' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - necessário role admin' })
  async toggleRead(@Param('id') id: string) {
    const contact = await this.contactsService.toggleRead(id);
    return {
      message: contact.read ? 'Mensagem marcada como lida' : 'Mensagem marcada como não lida',
      data: contact,
    };
  }

  @Delete(':id')
  @Roles('admin')
  @ApiBearerAuth('JWT')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete contact message (Admin only)' })
  @ApiResponse({ status: 204, description: 'Contact message deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact message not found' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @ApiResponse({ status: 403, description: 'Acesso negado - necessário role admin' })
  async remove(@Param('id') id: string) {
    await this.contactsService.delete(id);
  }
}
