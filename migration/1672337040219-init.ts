import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1672337040219 implements MigrationInterface {
  name = 'init1672337040219';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`registeredAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`content\` (\`id\` int NOT NULL AUTO_INCREMENT, \`videoTitle\` varchar(255) NOT NULL, \`videoUrl\` varchar(255) NOT NULL, \`comment\` varchar(255) NOT NULL, \`rating\` int NOT NULL, \`thumbnailUrl\` varchar(255) NOT NULL, \`creatorName\` varchar(255) NOT NULL, \`creatorUrl\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`postedById\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`content\` ADD CONSTRAINT \`FK_78397bc1156d757107b446c9a4a\` FOREIGN KEY (\`postedById\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`content\` DROP FOREIGN KEY \`FK_78397bc1156d757107b446c9a4a\``,
    );
    await queryRunner.query(`DROP TABLE \`content\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
