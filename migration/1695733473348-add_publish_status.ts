import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPublishStatus1695733473348 implements MigrationInterface {
  name = 'addPublishStatus1695733473348';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`content\` ADD \`published\` tinyint NOT NULL DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`content\` DROP COLUMN \`published\``,
    );
  }
}
