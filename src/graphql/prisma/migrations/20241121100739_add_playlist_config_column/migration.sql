-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "playlistConfig" JSONB NOT NULL DEFAULT '{}';
