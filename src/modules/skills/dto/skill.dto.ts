import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({ example: 'Kubernetes' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Orquestração' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'mdi-kubernetes' })
  @IsString()
  icon: string;

  @ApiProperty({ example: '#326CE5' })
  @IsString()
  color: string;

  @ApiProperty({ example: '#e3f2fd' })
  @IsString()
  bgColor: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateSkillDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  bgColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
