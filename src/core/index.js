import iVue from './instance/index.js'
import {initGlobalAPI} from './global-api/index.js'

initGlobalAPI(iVue);

iVue.version = '_VERSION_'

export default iVue;