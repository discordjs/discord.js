<!-- An experimental document so i dont lose track of changes -->

# What does it change?

## Separation of API and Cache

The main focus of the PR is completely separating API and cache for data models.
This allows us to:
- Easily swap out API methods.
- Easily extend Managers.
- Easily swap out cache types and disable certain non-managed caches like presence and message.
- Separate API and cache methods so as not to have weird overwrites on various managers
- Separate 

## Misc

- Managers of any kind are no longer iterable.
- Managers do not have a `Symbol.species` of `Collection` anymore.
- The `BaseManager` class is `abstract` unlike `DataStore`.
- Neither the `BaseManager` class, nor standalone managers extend `Collection`.
- Collection methods are no longer overwritten with API methods due to the separation of purposes.
- Multiple properties on stores have been documented in managers, e.g. `MessageManager#channel`.
- `MessageStore#remove()` has been renamed to `MessageManager#delete()`

## Managers! 

Abstract:  
`DataStore` => `BaseManager`

Extends `BaseManager`:  
`GuildChannelStore` => `GuildChannelManager`  
`GuildEmojiStore` => `GuildEmojiManager`  
`GuildMemberStore` => `GuildMemberManager`  
`MessageStore` => `MessageManager`  
`PresenceStore` => `PresenceManager`  
`ReactionStore` => `ReactionManager`  
`GuildStore`  => `GuildManager`  
`ReactionUserStore` => `ReactionUserManager`  
`UserStore` => `UserManager`  

Standalone (`cache` is a getter):  
`GuildMemberRoleStore` => `GuildMemberRoleManager`  

# TODO

- Rethink if Standalone stores should be reworked to extend `BaseManager`
- See if max LRUCollection size should be a client option
- Rethink methods such as `GuildMember#manageable` and `GuildMember#kickable`, these properties for example will always error if guild member cache is disabled.