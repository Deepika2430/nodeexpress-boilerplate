-- CreateTable
CREATE TABLE "Media" (
    "mediaId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "mediaType" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "publishDate" TIMESTAMP(3) NOT NULL,
    "tags" TEXT NOT NULL,
    "customParameters" JSONB NOT NULL,
    "images" JSONB[],
    "tracks" JSONB[],
    "assets" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("mediaId")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "playlistId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "playlist" JSONB[],
    "description" TEXT,
    "customParameters" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("playlistId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_playlistId_key" ON "Playlist"("playlistId");
