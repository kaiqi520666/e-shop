import * as path from 'path';
import * as os from 'os';
import * as md5 from 'md5';
import * as fs from 'fs';

/**
 * 获得配置文件中的 keys
 * @returns
 */
const getKeys = () => {
  const configFile = path.join(__dirname, '../config/config.default.js');
  const configContent = fs.readFileSync(configFile, 'utf8');
  const keys = configContent.match(/keys: '([^']+)'/)?.[1];
  return keys;
};
const PROD_UPLOAD_PATH = '/www/wwwroot/e-shop/images/upload';

const isProd =
  process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production';
console.log(isProd, 'isProd path.ts');
/**
 * 项目数据目录
 */
export const pDataPath = () => {
  const dirPath = isProd
    ? PROD_UPLOAD_PATH
    : path.join(os.homedir(), '.cool-admin', md5(getKeys()));

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
};

/**
 * 上传目录
 */
export const pUploadPath = () => {
  if (isProd) return pDataPath();

  const uploadPath = path.join(pDataPath(), 'upload');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

/**
 * 插件目录
 * @returns
 */
export const pPluginPath = () => {
  const pluginPath = path.join(pDataPath(), 'plugin');
  if (!fs.existsSync(pluginPath)) {
    fs.mkdirSync(pluginPath, { recursive: true });
  }
  return pluginPath;
};

/**
 * sqlite 数据库文件
 */
export const pSqlitePath = () => {
  return path.join(pDataPath(), 'cool.sqlite');
};

/**
 * 缓存目录
 * @returns
 */
export const pCachePath = () => {
  return path.join(pDataPath(), 'cache');
};
