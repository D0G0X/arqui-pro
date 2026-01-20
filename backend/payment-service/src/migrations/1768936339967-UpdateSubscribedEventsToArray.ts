import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSubscribedEventsToArray1768936339967 implements MigrationInterface {
    name = 'UpdateSubscribedEventsToArray1768936339967'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "subscribedEvents"`);
        await queryRunner.query(`ALTER TABLE "partners" ADD "subscribedEvents" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partners" DROP COLUMN "subscribedEvents"`);
        await queryRunner.query(`ALTER TABLE "partners" ADD "subscribedEvents" text NOT NULL DEFAULT ''`);
    }

}
