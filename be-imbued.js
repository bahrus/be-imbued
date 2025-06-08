// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';

/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/be-imbued/types' */;

/**
 * @implements {Actions}
 */
class BeImbued extends BE {
    /**
     * @type {BEConfig<AP & BEAllProps, Actions & IEnhancement<HTMLTemplateElement>>}
     */
    static config = {
        propInfo:{
            imbueRules: {},
            nodesToImbue: {},
        },
        compacts:{
            when_imbueRules_changes_call_hydrate: 0,
        },
        actions:{
            imbue:{
                ifAllOf: ['nodesToImbue', 'imbueRules'],
            }
        }
    }

    /**
     * @type {WeakSet<Element>}
     */
    #alreadyProcessed = new WeakSet();

    /**
     * @type {MutationObserver}
     */
    #mutationObserver;

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async hydrate(self){
        const {enhancedElement} = self;
        const {content} = enhancedElement;
        const nodesToImbue = Array.from(content.children);
        const config = { attributes: true, childList: true, subtree: true };
        return /* @type {PAP} */ ({
            nodesToImbue
        });
    }

    detachedCallback(){
        if(this.#mutationObserver){
            this.#mutationObserver.disconnect();
        }
    }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async imbue(self){
        const { enhancedElement, imbueRules, nodesToImbue } = self;
        const {find} = await import('trans-render/dss/find.js');
        const {beKindred}  = await import('mount-observer/slotkin/beKindred.js');
        for(const imbueRule of imbueRules){
            const {remoteSpecifier} = imbueRule;
            const target = await find(enhancedElement, remoteSpecifier);
            for(const node of nodesToImbue){
                if(this.#alreadyProcessed.has(node)) continue;
                this.#alreadyProcessed.add(node);
                beKindred(target, node)
            }  
        }
            
        const newNodesToImbue = nodesToImbue.filter(node => !this.#alreadyProcessed.has(node));
        return /* @type {PAP} */ ({
            nodesToImbue: newNodesToImbue
        })
    }
}

await BeImbued.bootUp();
export { BeImbued };