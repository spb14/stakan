import TargetSelect from '@/components/target-select'
import ElTime from '@/components/el-time'
import L2Table from '@/components/l2-table'

import subscriptions from './subscriptions'
import * as computed from './computed'

const props = {
  broker: String,
  symbol: String
}

export default {
  name: 'orderbook',
  subscriptions,
  props,
  computed,
  components: {
    TargetSelect,
    ElTime,
    L2Table
  }
}
