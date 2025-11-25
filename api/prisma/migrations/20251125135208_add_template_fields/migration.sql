-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "placeholders" TEXT NOT NULL DEFAULT '[]',
    "categorieId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Template_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "Categorie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Template" ("categorieId", "content", "createdAt", "id", "name") SELECT "categorieId", "content", "createdAt", "id", "name" FROM "Template";
DROP TABLE "Template";
ALTER TABLE "new_Template" RENAME TO "Template";
CREATE UNIQUE INDEX "Template_name_categorieId_key" ON "Template"("name", "categorieId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
