import { Media } from '@prisma/client';
import { CloudEventV1 } from 'cloudevents';

import { logger } from '../logger/log';
import { BullMQTask } from '../workers/generic.bullmq';
import { Job } from "../types/types.queue";

import { fetchPlaylistPreview } from './repos/repos.media';
import { DynamicPlaylistConfig } from './types/types.playlist';

export let playlistTask: BullMQTask;

export const mediaItems = (async () => {
  playlistTask = new BullMQTask("playlistTask");
  await playlistTask.startConsumer(
    async (message: CloudEventV1<Job>) => {
          const mediaItems: Media[] = await fetchPlaylistPreview(message as DynamicPlaylistConfig);
        //   Update playlist mediaItems
          logger.info(mediaItems);
          logger.info("Its working!");
    }
  );
})();