import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './schemas/contact.schema';
import { CreateContactDto } from './dto/contact.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class ContactsService {
  private readonly logger = new Logger(ContactsService.name);

  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    private emailService: EmailService,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = new this.contactModel(createContactDto);
    const savedContact = await contact.save();

    // Envia notificação por email de forma assíncrona (não bloqueia a resposta)
    this.emailService
      .sendContactNotification({
        name: savedContact.name,
        email: savedContact.email,
        subject: savedContact.subject,
        message: savedContact.message,
        createdAt: savedContact.createdAt,
      })
      .catch((error) => {
        this.logger.error('Failed to send email notification:', error);
      });

    return savedContact;
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<Contact> {
    return this.contactModel.findById(id).exec();
  }

  async markAsRead(id: string): Promise<Contact> {
    return this.contactModel
      .findByIdAndUpdate(id, { read: true, readAt: new Date() }, { new: true })
      .exec();
  }

  async toggleRead(id: string): Promise<Contact> {
    const contact = await this.contactModel.findById(id).exec();
    if (!contact) {
      throw new Error('Contact not found');
    }

    const newReadState = !contact.read;
    return this.contactModel
      .findByIdAndUpdate(
        id,
        {
          read: newReadState,
          readAt: newReadState ? new Date() : null,
        },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<Contact> {
    return this.contactModel.findByIdAndDelete(id).exec();
  }
}
