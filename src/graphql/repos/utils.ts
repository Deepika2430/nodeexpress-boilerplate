import { writeFileSync } from 'fs';

import mediaRecords from './media_records.json';

const updatedMediaRecords = mediaRecords.map((media) => {
    const customParams = media.customParameters.reduce((acc, customParameter) => {
        return { ...acc, [customParameter.key]: customParameter.value };
    }, {});
    delete (media as { customParameters?: any }).customParameters;
    (media as { customParameters?: any }).customParameters = customParams;
    return media;
});

writeFileSync("./media_record.json", JSON.stringify(updatedMediaRecords));