// @ts-check
import { BE } from 'be-enhanced/BE.js';


/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/be-imbued/types' */;
/** @import {IMountObserver} from './ts-refs/mount-observer/types' */

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
     * @type {MutationObserver | undefined}
     */
    #mutationObserver;

    /**
     * @type {Array<[WeakRef<Element>, IMountObserver]>}
     */
    #kindredObservers = [];

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
        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                const {addedNodes} = mutation;
                const addedElements = Array.from(addedNodes).filter(x => x instanceof Element);
                const newNodesToImbue = [...self.nodesToImbue];
                for(const addedNode of addedElements){
                    newNodesToImbue.push(addedNode);
                }
                self.nodesToImbue = newNodesToImbue;
            }
            
        };
        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(content, config);
        return /* @type {PAP} */ ({
            nodesToImbue
        });
    }

    detachedCallback(){
        if(this.#mutationObserver){
            this.#mutationObserver.disconnect();
        }
        for(const mo of this.#kindredObservers){
            const target = mo[0].deref();
            if(target === undefined) continue;
            mo[1].disconnect(target);
        }
    }

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async imbue(self){
        const { enhancedElement, imbueRules, nodesToImbue } = self;
        const {beKindred}  = await import('mount-observer/slotkin/beKindred.js');
        const rn = /** @type {Document | ShadowRoot} */ (enhancedElement.getRootNode());
        for(const imbueRule of imbueRules){
            const {idref} = imbueRule;
            
            const target = rn.getElementById(idref);
            for(const node of nodesToImbue){
                if(this.#alreadyProcessed.has(node)) continue;
                this.#alreadyProcessed.add(node);
                this.#kindredObservers.push([new WeakRef(target), beKindred(target, node)]);
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