import { LIMIT_DEFAULT } from '@/const/common'
import { ResponseFetchDevices } from '@/controller/device/index.type'
import Device from '@/domain/device/entity/device'
import { IDeviceRepository } from '@/domain/device/IDeviceRepository'
import DeviceName from '@/domain/device/value/deviceName'
import ModelName from '@/domain/device/value/modelName'
import DeviceId from '../../domain/device/value/deviceId'

class DeviceFetchUseCase {
  private repository: IDeviceRepository
  constructor(repository: IDeviceRepository) {
    this.repository = repository
  }

  fetchDevice = async (id: string): Promise<Device> => {
    const device = await this.repository.fetchDevice(new DeviceId(id))
    if (device === undefined) {
      throw new Error()
    }
    return device
  }

  fetchDevices = async (
    offset: number | undefined,
    limit: number | undefined,
    searchParams?: { name?: string; model?: string; parentDeviceGroupId?: string },
  ): Promise<ResponseFetchDevices> => {
    const complementedOffset = offset ?? 0
    const complementedLimit = limit ?? LIMIT_DEFAULT
    const deviceName = searchParams?.name ? new DeviceName(searchParams.name) : undefined
    const modelName = searchParams?.model ? new ModelName(searchParams.model) : undefined
    const params = {
      deviceName,
      modelName,
    }

    const {
      total,
      pageCount,
      list,
      offset: newOffset,
    } = await this.repository.fetchDevices(complementedOffset, complementedLimit, params)
    const responseList =
      list.length > 0
        ? list.map((device) => {
            return {
              id: device!.id.value,
              name: device!.name.value,
              model: device!.modelName.value,
              description: device!.description.value,
            }
          })
        : []

    return {
      offset: newOffset,
      total,
      count: pageCount,
      list: responseList,
    }
  }
}

export default DeviceFetchUseCase
