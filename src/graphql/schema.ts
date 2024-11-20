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
    t.field('tags', {
      type: inputObjectType({
        name: 'Tags',
        definition(t) {
          t.string('include');
          t.string('exclude');
        }
      })
    });
    t.field('customParameters',{
      type: inputObjectType({
        name: 'customParameters',
        definition(t) {
          t.field('include', { type: 'JSON' });
          t.field('exclude', { type: 'JSON' });
        }
      })
    });
    t.field('sort', {
      type: inputObjectType({
        name: 'Sort',
        definition(t) {
          t.string('field');
          t.string('order');
        }
      })
    });
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
    t.field('customParameters', {
      type: 'JSON', // Returning a JSON object containing all dynamic fields
      resolve(parent) {
        const { feedid, title, description, playlist, ...customParameters } = parent;
        return customParameters;
      },
    });
  },
});


// Query Type
const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('media', {
      type: 'JSON',
      args: { id: nonNull(idArg()) },
      resolve: async (_parent, { id }, ctx: Context) => {
        return ctx.getMedia(id);
      },
    });
    t.field('getPlaylistById', {
      type: 'JSON', // Define the type as Playlist
      args: { playlistId: nonNull(idArg()) }, // Accept a non-null ID argument
      resolve: async (_parent, { playlistId }, ctx: Context) => {
        const playlist = await ctx.getPlaylistById(playlistId); // Fetch the playlist by ID
        if (!playlist) {
          throw new Error(`Playlist with ID ${playlistId} not found.`);
        }
        return playlist;
      },
    });
  },
});

// Mutation Type
const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('createPlaylist', {
      type: 'JSON',
      args: {
        playlistMetadata: nonNull(PlaylistMetadata),
        dynamicPlaylistConfig: nonNull(DynamicPlaylistConfig),
      },
      resolve: async (_parent, { playlistMetadata, dynamicPlaylistConfig }, ctx) => {
        return ctx.createPlaylist(playlistMetadata, dynamicPlaylistConfig)
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
