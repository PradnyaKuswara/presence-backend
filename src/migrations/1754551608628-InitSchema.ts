import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1754551608628 implements MigrationInterface {
    name = 'InitSchema1754551608628'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schools" ADD "logo" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "schools" DROP COLUMN "logo"`);
    }

}
