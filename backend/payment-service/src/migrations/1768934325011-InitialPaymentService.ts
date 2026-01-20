import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialPaymentService1768934325011 implements MigrationInterface {
    name = 'InitialPaymentService1768934325011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "webhook_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "partnerId" uuid NOT NULL, "eventType" character varying(100) NOT NULL, "direction" character varying(20) NOT NULL, "payload" text NOT NULL, "signature" character varying(255), "retryCount" integer NOT NULL DEFAULT '0', "status" character varying(50) NOT NULL DEFAULT 'pending', "response" text, "errorMessage" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4cba37e6a0acb5e1fc49c34ebfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "partners" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "webhookUrl" text NOT NULL, "secret" text NOT NULL, "subscribedEvents" text NOT NULL DEFAULT '', "isActive" boolean NOT NULL DEFAULT true, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b8d14f1ff3b804b1c020dd99ca8" UNIQUE ("name"), CONSTRAINT "PK_998645b20820e4ab99aeae03b41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "provider" character varying(255) NOT NULL, "providerPaymentId" character varying(255), "amount" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'USD', "status" character varying(50) NOT NULL, "serviceType" character varying(255) NOT NULL, "userId" uuid, "projectId" uuid, "metadata" jsonb, "errorMessage" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "webhook_events" ADD CONSTRAINT "FK_3ab81a795090f89c4d00418d091" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "webhook_events" DROP CONSTRAINT "FK_3ab81a795090f89c4d00418d091"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "partners"`);
        await queryRunner.query(`DROP TABLE "webhook_events"`);
    }

}
