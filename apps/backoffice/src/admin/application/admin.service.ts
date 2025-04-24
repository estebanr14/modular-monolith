import {
  BadRequestException,
  NotFoundException,
  Injectable,
  Logger,
  UnauthorizedException,
  OnModuleInit,
} from '@nestjs/common';
import { MongoAdminRepository } from '../infraestructure/repositories/admin.mongo.repository';
import { Admin } from '../domain/entities/admin.entity';
import { IUserService } from '@app/shared';
import { EmailValueObject } from '@app/shared/value-objects/email.value-object';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService implements IUserService, OnModuleInit {
  constructor(private readonly adminRepository: MongoAdminRepository) {}
  private readonly logger = new Logger(AdminService.name);

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  async createDefaultAdmin() {
    try {
      const email = 'admin@example.com';
      const password = 'Password11*';
      const emailHash = new EmailValueObject(email).toHashed();
      const passwordHash = await bcrypt.hash(password, 10);
      const adminEntity = new Admin({
        email: email,
        name: 'Admin',
        lastname: 'Default',
        password: passwordHash,
        emailHash,
      });
      await this.createAdmin(adminEntity);
    } catch (error) {
      this.logger.log(`[createDefaultAdmin]: Admin already exists: ${error}`);
    }
  }

  async createAdmin(admin: Admin): Promise<Admin> {
    this.logger.log(`[createAdmin]: INIT`);
    const existingAdmin = await this.adminRepository.findByEmailHash(
      admin.emailHash.toString(),
    );
    if (existingAdmin) {
      this.logger.error(`[createAdmin]: ERROR: admin already exists`);
      throw new BadRequestException(`admin already exists`);
    }
    const savedAdmin = await this.adminRepository.create(admin.toDatabase());
    this.logger.log(`[createAdmin]: admin created ${savedAdmin.id}`);
    return Admin.fromDatabase(savedAdmin);
  }

  async updateAdmin(admin: Admin): Promise<Admin> {
    this.logger.log(`[updateAdmin]: INIT`);
    const existingAdmin = await this.adminRepository.findById(admin.id);
    if (!existingAdmin) {
      this.logger.error(`[updateAdmin]: ERROR: admin not found`);
      throw new NotFoundException(`admin not found`);
    }
    if (admin.emailHash) {
      const existingAdminByEmailHash =
        await this.adminRepository.findByEmailHash(admin.emailHash.toString());
      if (
        existingAdminByEmailHash &&
        existingAdminByEmailHash.id !== admin.id
      ) {
        this.logger.error(`[updateAdmin]: ERROR: email already exists`);
        throw new BadRequestException(`email already exists`);
      }
    }
    const savedAdmin = await this.adminRepository.update(
      { id: existingAdmin.id },
      admin.toDatabase(),
    );
    this.logger.log(`[updateAdmin]: admin updated ${savedAdmin.id}`);
    return Admin.fromDatabase(savedAdmin);
  }

  async findById(id: string): Promise<Admin | null> {
    const adminDocument = await this.adminRepository.findById(id);
    if (!adminDocument) {
      throw new NotFoundException(`Admin with id ${id} not found`);
    }
    return adminDocument ? Admin.fromDatabase(adminDocument) : null;
  }

  async setInactive(id: string): Promise<Admin | null> {
    const adminDocument = await this.adminRepository.setInactive(id);
    return adminDocument ? Admin.fromDatabase(adminDocument) : null;
  }

  async findByEmailHash(emailHash: string): Promise<Admin | null> {
    const adminDocument = await this.adminRepository.findByEmailHash(emailHash);
    return adminDocument ? Admin.fromDatabase(adminDocument) : null;
  }

  async changePassword(id: string, newPasswordHash: string): Promise<void> {
    const admin = await this.findById(id);
    if (!admin) throw new NotFoundException('Admin not found');
    const adminEntity = new Admin({
      ...admin.toPrimitives(),
      password: newPasswordHash,
    });
    await this.adminRepository.update(
      { id },
      { password: adminEntity.password.encryptedValue },
    );
  }

  async findAll(): Promise<Admin[]> {
    const adminDocuments = await this.adminRepository.findAll();
    return adminDocuments.map((doc) => Admin.fromDatabase(doc));
  }

  async setActive(id: string): Promise<Admin | null> {
    const adminDocument = await this.adminRepository.setActive(id);
    return adminDocument ? Admin.fromDatabase(adminDocument) : null;
  }

  async validateMFA(email: string, code: string): Promise<Admin> {
    const admin = await this.findByEmailHash(
      new EmailValueObject(email).toHashed(),
    );

    if (
      !admin ||
      !admin.mfaValidation?.value ||
      admin.mfaValidation.isCodeExpired() ||
      !(await admin.mfaValidation.isCodeValid(code))
    )
      throw new UnauthorizedException('Invalid MFA code');

    const updatedAdmin = await this.adminRepository.update(
      { id: admin.id },
      {
        mfaValidation: null,
      },
    );

    return Admin.fromDatabase(updatedAdmin);
  }
}
