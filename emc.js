// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/be-imbued/types' */;

const inRemoteSpecifierString = String.raw `^(i|I)n (?<remoteSpecifierString>.*)`;

/**
 * @type {[string, string]}
 */
const rssTors = ['remoteSpecifierString', 'remoteSpecifier'];

/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    base: 'be-imbued',
    // enhancedElementInstanceOf: HTMLTemplateElement,
    map: {
        '0.0': {
            instanceOf: 'Object$entences',
            objValMapsTo: '.',
            regExpExts: {
                imbueRules: [
                    {
                        regExp: inRemoteSpecifierString,
                        defaultVals: {},
                        dssKeys: [rssTors]
                    }

                ]
            }
        }
    },
    enhPropKey: 'beImbued',
    importEnh: async () => {
        const { BeImbued } = 
        /** @type {{new(): IEnhancement<Element>}} */ 
        /** @type {any} */
        (await import('./be-imbued.js'));
        return BeImbued;
    }
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);