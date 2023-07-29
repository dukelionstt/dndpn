import { ITEM, MISC, PERSON, PLACE } from "../constants"
import { TagMap } from "../model/tag-map-model"

export const TAG_MAP: Map<string, TagMap> = new Map<string, TagMap>([
    ["13", {
        name: 'Dave',
        type: PERSON,
        referenceId: 0
    }],
    ["34", {
        name: 'Cat',
        type: PERSON,
        referenceId: 1
    }],
    ["63", {
        name: 'bits',
        type: PERSON,
        referenceId: 2
    }],
    ["65", {
        name: 'generic',
        type: MISC,
        referenceId: 0
    }],
    ["74", {
        name: 'local',
        type: PLACE,
        referenceId: 0
    }],
    ["96", {
        name: 'stuff',
        type: ITEM,
        referenceId: 0
    }],
    ["110", {
        name: 'more stuff',
        type: MISC,
        referenceId: 1
    }]
])