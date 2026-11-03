import 'server-only';
import {getCloudflareContext} from '@opennextjs/cloudflare';

export async function obtenerEntorno() {
  const {env} = await getCloudflareContext({async: true});
  return env;
}
