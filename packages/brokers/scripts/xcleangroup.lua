local info = redis.call('XINFO', 'CONSUMERS', KEYS[1], ARGS[1])
local empty = true

for k, consumer in pairs(info) do
  if consumer['idle'] != 0 then
    empty = false
    break
  end
end

if empty then
  redis.call('XGROUP', 'DESTROY', KEYS[1], ARGS[1])
  return true
end

return false
