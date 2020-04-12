import iVue from './runtime/index';
import {query} from './util/index';
import { warn } from '../../core/util';

const idToTemplate = (id)=>{
    const el = query(id);
    return el && el.innerHTML;
}

const mount = iVue.prototype.$mount;

iVue.prototype.$mount = function(el,hydrating){
    el = el && query(el);
    const options = this.$options;
    if(!options.render){
        let template = options.template;
        if(template){
            if(typeof template === 'string'){
                if(template.charAt(0) === '#'){
                    template = idToTemplate(template);
                }
            }else if(template.nodeType){
                template = template.innerHTML;
            }else {
                warn('invalid template option:' + template,this);
                return this;
            }
        }else if(el){
            template = getOuterHTML(el);
        }

        if(template){
            const {render, staticRenderFns} = compileToFunctions(template,{

            });
            options.render = render;
            options.staticRenderFns = staticRenderFns;
        }
    }
    return mount.call(this, el, hydrating);
}

function getOuterHTML(el){
    if(el.outerHTML){
        return el.outerHTML;
    }else{
        const container = document.createElement('div');
        container.appendChild(el.cloneNode(true));
        return container.innerHTML;
    }
}

iVue.compile = compileToFunctions;

export default iVue;