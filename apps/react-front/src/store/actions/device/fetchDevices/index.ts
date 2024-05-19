import { DeviceService } from '@packages/demo-api'
import { DevicePageState } from '@/store/state/devicePageState'

const fetchDevices = async (
  state: DevicePageState,
  deviceService: DeviceService,
): Promise<DevicePageState> => {
  const { offset, pageSize, searchParam } = state
  const {
    offset: newOffset,
    total,
    list,
  } = await deviceService.fetchDeviceList({
    offset,
    limit: pageSize,
    name: searchParam?.name,
    model: searchParam?.model,
  })
  return {
    ...state,
    offset: newOffset,
    total,
    devices: list.map((item) => {
      return {
        id: item.deviceId,
        name: item.name,
        model: item.model,
      }
    }),
  }
}

export default fetchDevices
