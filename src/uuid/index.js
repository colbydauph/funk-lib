import { test } from 'ramda';


/** Random UUID v4
  * @func
  * @sig a → String
  * @example uuid(); // 'c4f2e775-a5f9-4796-bd31-46e544bfab06'
*/
export const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (placeholder) => {
    const rand = Math.random() * 16 | 0, val = placeholder === 'x' ? rand : (rand & 0x3 | 0x8);
    return val.toString(16);
  });
};

/** Is UUID v4?
  * @func
  * @sig a → Boolean
  * @example isUuid('c4f2e775-a5f9-4796-bd31-46e544bfab06'); // true
*/
export const isUuid = test(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
