import Env from './env';
const burl = Env == 'development' ? 'http://api.uooc.online:8088' : 'http://test.uooconline.com';
let config = {
    env: Env,
    basicUrl: burl,
    docUrl: burl + '/upload/index'
};
export default config;