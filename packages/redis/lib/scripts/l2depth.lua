local topic = KEYS[1]

-- Constants

local SCALING_FACTOR = 100000000

-- Utils

local function keyfor (sub)
  return table.concat({ topic, sub }, ":")
end

local function unscaled (x)
  local num = tonumber(x) / SCALING_FACTOR
  return tostring(num)
end

--

local function pull (side)
  local key = keyfor(side)

  local arr = redis.call("ZRANGEBYSCORE", key, "(0", "+inf", "WITHSCORES")

  for i = 1, #arr, 2 do
    arr[i] = unscaled(arr[i])
  end

  return arr
end

local function get_rev ()
  return redis.call("GET", keyfor "rev")
end

return {
  get_rev(),
  pull "bids",
  pull "asks",
}
