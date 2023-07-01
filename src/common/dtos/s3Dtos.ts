import { IsBoolean, IsString } from "class-validator";
import "reflect-metadata" // important for class transformer

export class InsertionToS3Dto {
    @IsBoolean()
    success: boolean

    @IsString()
    key: string;

    @IsString()
    url: string;
}