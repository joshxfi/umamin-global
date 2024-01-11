import { registerEnumType } from "type-graphql";

enum CacheControlScope {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

registerEnumType(CacheControlScope, {
  name: 'CacheControlScope',
});
