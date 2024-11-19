import path from 'path';

import {
  objectType,
  inputObjectType,
  makeSchema,
  nonNull,
  idArg,
  asNexusMethod,
} from 'nexus';
import { GraphQLDateTime, GraphQLJSON } from 'graphql-scalars'; // Import scalars

import { Context } from './context';
import { fetchPlaylistPreview } from './repos/repos.media';
import { convertMediaFormat } from './utils/utils.media';

// Add custom scalars
export const DateTime = asNexusMethod(GraphQLDateTime, 'date');
export const JSON = asNexusMethod(GraphQLJSON, 'json');

// MediaPlaylistItem Type
const MediaPlaylistItem = objectType({
  name: 'MediaPlaylistItem',
  definition(t) {
    t.nonNull.string('title');
    t.nonNull.string('mediaid');
    t.string('image');
    t.list.field('images', { type: 'JSON' });
    t.nonNull.float('duration');
    t.nonNull.field('pubDate', { type: 'DateTime' });
    t.string('tags');
    t.list.field('sources', { type: 'JSON' });
    t.list.field('tracks', { type: 'JSON' });
  },
});

// Media Type
const Media = objectType({
  name: 'Media',
  definition(t) {
    t.nonNull.string('title');
    t.string('description');
    t.string('kind');
    t.list.field('playlist', { type: MediaPlaylistItem });
  },
});

// PlaylistMetadata Input Type
const PlaylistMetadata = inputObjectType({
  name: 'PlaylistMetadata',
  definition(t) {
    t.string('title');
    t.string('description');
    t.string('type');
    t.field('customParameters', { type: 'JSON' });
  },
});

// DynamicPlaylistConfig Input Type
const DynamicPlaylistConfig = inputObjectType({
  name: 'DynamicPlaylistConfig',
  definition(t) {
    t.field('tags', { type: 'JSON' });
    t.field('customParameters', { type: 'JSON' });
    t.field('sort', { type: 'JSON' });
    t.int('itemsPerPage');
    t.int('pageNumber');
  },
});

// Playlist Type
const Playlist = objectType({
  name: 'Playlist',
  definition(t) {
    t.nonNull.string('feedid');
    t.nonNull.string('title');
    t.string('description');
    t.list.field('playlist', { type: Media });
  },
});

// Query Type
const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('media', {
      type: 'Media',
      args: { id: nonNull(idArg()) },
      resolve: async (_parent, { id }, ctx: Context) => {
        const media = convertMediaFormat(await ctx.fetchMediaItemById(id));
        return media;
      },
    });
  },
});

// Mutation Type
const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createPlaylist', {
      type: 'Playlist',
      args: {
        playlistMetadata: nonNull(PlaylistMetadata),
        dynamicPlaylistConfig: nonNull(DynamicPlaylistConfig),
      },
      resolve: async (_parent, { playlistMetadata, dynamicPlaylistConfig }, ctx) => {
        const mediaItems = await fetchPlaylistPreview(dynamicPlaylistConfig);
        const convertedMediaItems = (await mediaItems).map((mediaItem) =>
          convertMediaFormat(mediaItem)
        );
        const createdPlaylist = await ctx.createPlaylist(playlistMetadata, convertedMediaItems);
        const playlist: { [key: string]: any } = {
          title: createdPlaylist.title,
          feedid: createdPlaylist.playlistId,
          playlist: createdPlaylist.playlist,
          description: createdPlaylist.description,
          kind: createdPlaylist.kind
        }
        if (createdPlaylist.customParameters) {
          Object.entries(createdPlaylist.customParameters).forEach(([key, value]) => {
            playlist[key] = value;
          });
        }
        return playlist
      },
    });
  },
});

// Schema Configuration
export const schema = makeSchema({
  types: [
    DateTime,
    JSON,
    Query,
    Mutation,
    Media,
    Playlist,
    MediaPlaylistItem,
    PlaylistMetadata,
    DynamicPlaylistConfig,
  ],
  outputs: {
    schema: path.join(__dirname, 'schema.graphql'),
    typegen: path.join(__dirname, 'nexus-typegen.ts'),
  },
});

// Export the types
export {
  Media,
  MediaPlaylistItem,
  PlaylistMetadata,
  DynamicPlaylistConfig,
  Mutation,
};
