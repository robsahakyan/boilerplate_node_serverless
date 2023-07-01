import { IsBoolean, IsString } from "class-validator";
import "reflect-metadata" // important for class transformer

export class GameTypeAfterInsertionToS3 {
    @IsBoolean()
    success: boolean

    @IsString()
    key: string;

    @IsString()
    url: string;
}